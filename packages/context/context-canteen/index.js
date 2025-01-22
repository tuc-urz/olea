/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createContext, useCallback, useEffect, useContext, useReducer, useMemo } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DateTime } from 'luxon';

import { onSettingCanteenMerge, useStagingServer } from "@openasist/core";
import { useUser } from '@openasist/context-user';
import { intersection } from 'lodash';

import CollektorVersion2ApiProvider, { NotModifiedResponse } from './CollektorVersion2ApiProvider.js';
import AsistServerApiProvider from './AsistServerApiProvider.js';

/**
 * @typedef {Object} Canteen
 * @property {string} id ID der Mensa
 */

/**
 * @typedef {Object.<string, Canteen>} CanteenState
 */

const AsistServerProviderName = 'asist-server';
const CollectorVersion2ProviderName = 'hs-collector-v2';

// Create a context for the canteen data
const CanteenContext = createContext({
    canteens: {},
});

const CanteensStoreKey = 'canteen:canteens';
const FavoriteCanteensStoreKey = 'canteen:favorite_canteens'

const RestoreCanteens = 'restore_canteens';
const SetMenuAction = 'set_menu';
const SetCanteenAction = 'set_canteen';
const RemoveUnusedCanteensAction = 'remove_unused_canteens'
const RemoveUnusedMenusAction = 'remove_unused_menus'

/**
 *
 * @param {CanteenState} state
 * @param {Object} action
 * @param {string} action.type
 * @returns {CanteenState}
 */
function CanteensStateReducer(state, action) {
    switch (action.type) {

        // Essensangebot einer Mensa zuordnen
        case SetMenuAction: {
            const canteenId = action.canteenId;
            const menuDate = action.date;
            const menu = action.menu;

            // Einfügen des Essensangebot(menu) für eine Mensa(canteenId) an einem Tag(menuDate)
            return {
                // Kopieren der vorherigen Mensen
                ...state ?? {},
                //Mense mit id(canteenId) neu erstellen
                [canteenId]: {
                    // Kopieren der vorherigen Daten der Mense
                    ...state?.[canteenId] ?? {},
                    // Essensangebote werden neu erstellt
                    menus: {
                        // Kopieren der alten Essensangebote
                        ...state?.[canteenId]?.menus ?? {},
                        // Es wird das Essensangebote(menu) für ein Datum(menuDate) hinterlegt
                        [menuDate]: menu,
                    }
                }
            };
        }

        // Anhand eines Datums werden alte Mensen entfernt
        case RemoveUnusedMenusAction: {
            const expiryDate = action.expiryDate;
            const expiryTimestamp = Date.parse(expiryDate);

            return Object.fromEntries(
                Object.entries(state ?? {})
                    .map(
                        ([canteenId, canteenData]) =>
                            [
                                canteenId,
                                {
                                    ...canteenData,
                                    menus: Object.fromEntries(
                                        Object.entries(canteenData?.menus ?? {})
                                            .filter(([menuDate, menu]) => Date.parse(menuDate) >= expiryTimestamp)
                                    )
                                }
                            ]
                    )
            );
        }

        // Es werden die Basisdaten einer Mensa hinzugefügt oder aktualisiert
        case SetCanteenAction: {
            const canteen = action.canteen;

            return {
                ...state ?? {},
                [canteen.id]: {
                    ...state?.[canteen.id] ?? {},
                    ...canteen,
                }
            };
        }

        // Anhand einer Liste von Mensa-IDs werden alte Mensen entfernt
        case RemoveUnusedCanteensAction: {
            const activeCanteenIds = action.activeCanteenIds;

            return Object.fromEntries(
                Object.entries(state ?? {})
                    .filter(([canteenId, canteenData]) => activeCanteenIds.includes(canteenId))
            );
        }

        // Mensen und zugehörige Essensangebote aus dem Cache wiederherstellen
        case RestoreCanteens: {
            const restoredCanteens = action.canteens;

            return state
                ? { ...state }
                : restoredCanteens;
        }
    }
}

const SetCanteensAction = 'set_canteens_ids';

/**
 *
 * @param {string[]} state
 * @param {Object} action
 * @param {string} action.type
 * @returns {string[]}
 */
function FavoriteCanteensStateReducer(state, action) {
    switch (action.type) {

        // Setzen der IDs der favoriten Mensen
        case SetCanteensAction: {
            const canteensIds = action?.canteensIds;

            return canteensIds;
        }

        // Filtert IDs aus der Einstellung heraus, welche nicht mehr vom Kollektor übersendet werden
        case RemoveUnusedCanteensAction: {
            const activeCanteenIds = action?.activeCanteenIds;

            const favoriteCanteensIds = intersection(state, activeCanteenIds);

            return Array.isArray(favoriteCanteensIds) && favoriteCanteensIds.length > 0
                ? favoriteCanteensIds
                : null;
        }

        // Falls ein unbekannter Actionstyp übergeben wurde, wird nichts gemacht
        default: {
            return state;
        }
    }
}

//const providersInitializers = {
//    'hs-collector-v2': ({appSettings }) => {
//        const baseUrl = appSettings?.modules?.canteen?.api?.baseUrl;
//        CollektorVersion2ApiProvider.from(baseUrl,)
//    },
//    'asist-server': ({ }) => {
//
//    },
//}

// Define a provider component for the canteen context
function CanteenContextProvider({ children, settings, rootUrl, rootStgUrl, useStaging }) {
    const componentName = arguments.callee.name;

    const reduxDispatch = useDispatch();
    const [user] = useUser();
    const theme = useTheme();

    const appSettings = theme?.appSettings;
    const groupsOfPersons = appSettings?.groupsOfPersons;
    const language = settings.language;
    const availableSelections = theme?.appSettings?.mealSelections;
    const favoriteSelections = settings?.settingsCanteens?.favoriteSelection;

    // Ermitteln des Preisgruppen-Codes des Nutzers
    const priceGroupCode =
        // Wenn der Nutzer selber eine Preisgruppe festgelegt hast, ist diese im Redux hinterlegt
        // Prüfen ob im Redux eine Preisgruppe hinterlegt ist
        useSelector(
            (reduxState) =>
                // Wenn der Preisgruppen-Code ein leerer String ist, wird stattdessen null zurückgegeben
                reduxState?.settingReducer?.settingsCanteens?.favoritePrice
                    ? reduxState?.settingReducer?.settingsCanteens?.favoritePrice
                    : null
        )
        // Ist im Redux keine Preisgruppe hinterlegt, wird anhand des angemeldeten Nutzers die Preisgruppe ermittelt
        // Dabei werden die Angehörigkeiten(user.member_types) des Nutzer mit den möglichen Personengruppen-Codes verglichen
        // Ist eine Angehörigkeit, welche einem Code einer Personengruppe gleicht, vorhanden, wird die entsprechende Personengruppe verwendet
        // Besitzt ein Nutzer mehrer Angehörigkeiten (z.B. Student, Mitarbeiter) wird anhand der Reihenfolge der Personengruppen in der Settings.js priorisiert.
        // Dabei besetzt die erste bzw. oberste Personengruppe die höchste Priorität
        ?? groupsOfPersons.find((personGroup) => user?.member_types?.includes?.(personGroup?.code))?.code
        // Wenn der Nutzer nicht eingeloogt ist oder durch den Angehörigkeiten keine Personengruppe ermittelt werden konnt, wird die Standartgruppe ausgewählt
        // Bei der Standartpersonengruppe ist in der Sttings.js das 'default'-Feld auf Wahr/true gesetzt.
        ?? groupsOfPersons.find(personGroup => personGroup?.default)?.code;

    // Daten für Essenstypen
    const availableMealTypes = theme?.appSettings?.mealTypes;
    const favoriteMealTypes = settings?.settingsCanteens?.favoriteMealTypes;

    // Einstellung für Serverauswahl
    const isStagingServerActive = useStagingServer();

    // Einstellungen für Mensa-Modul
    const canteenSettings = appSettings?.modules?.canteen;

    // Einstellungen für Fallback API-Provider
    const fallbackApiSettings = theme?.appSettings?.api;
    const fallbackApiProvider = AsistServerProviderName;
    const fallbackApiBaseUrl = (isStagingServerActive ? fallbackApiSettings.rootStgUrl : fallbackApiSettings.rootUrl) + 'app/';
    const fallbbackApiUniversity = fallbackApiSettings?.university;

    // Einstellungen für API-Provider
    const canteenApiSettings = canteenSettings.api;
    // Soll der Staging-Provider verwendet werden?
    const canteenApiProviderSettings = isStagingServerActive
        // Wenn ja, werden die Staging Provider-Einstellungen geladen
        ? canteenApiSettings?.staging
        // Wenn nein, werden die productiven Provider-Einstellungen geladen
        : canteenApiSettings?.production;
    const canteenApiProvider = canteenApiProviderSettings?.provider ?? fallbackApiProvider;
    const canteenApiBaseUrl = canteenApiProviderSettings?.url ?? fallbackApiBaseUrl;
    const canteenApiUniversity = canteenApiProviderSettings?.university ?? fallbbackApiUniversity;

    const [canteens, dispatchCanteens] = useReducer(CanteensStateReducer, null);
    const [favoriteCanteens, dispatchFavoriteCanteens] = useReducer(FavoriteCanteensStateReducer, null);

    // Einmaliges Laden der gecachten Mensadaten und der zugehörigen Speisepläne aus dem Cache in den Kontext
    useEffect(
        () => {
            AsyncStorage
                .getItem(CanteensStoreKey)
                .then(storedCanteens => {
                    dispatchCanteens({ type: RestoreCanteens, canteens: JSON.parse(storedCanteens) });
                    dispatchCanteens({ type: RemoveUnusedMenusAction, expiryDate: DateTime.now().minus({ weeks: 1 }).endOf('week').toISODate() });
                })
                .catch(reason => console.error(componentName, ':', 'can not restore canteens', ':', reason, 'key', ':', CanteensStoreKey));
        }
        , []
    )

    // Wenn die Mensa-Daten sich ändern, werden diese in den Cache zurückgespeichert
    useEffect(
        () => {
            if (canteens) {
                AsyncStorage
                    .setItem(CanteensStoreKey, JSON.stringify(canteens))
                    .catch(reason => console.error(componentName, ':', 'can`t store canteens: ', reason, 'key:', CanteensStoreKey, 'value:', canteens));
            }
        }
        , [canteens]
    )

    // Einmaliges laden der favorisirten Mensen
    useEffect(
        () => {
            AsyncStorage
                .getItem(FavoriteCanteensStoreKey)
                .then(storedFavoriteCanteens => {
                    console.debug(componentName, ':', 'restore favorite canteens ids', ':', storedFavoriteCanteens);
                    dispatchFavoriteCanteens({ type: SetCanteensAction, canteensIds: JSON.parse(storedFavoriteCanteens) });
                })
                .catch(reason => console.error(componentName, ':', 'can not restore favorite canteens ids', ':', reason, 'key', ':', FavoriteCanteensStoreKey));
        },
        []
    )

    // Wenn die favorisirten Mensen sich ändern, werden diese in den Cache zurückgespeichert
    useEffect(
        () => {
            if (Array.isArray(favoriteCanteens)) {
                console.debug(componentName, ':', 'store favorite canteens', favoriteCanteens);
                AsyncStorage
                    .setItem(FavoriteCanteensStoreKey, JSON.stringify(favoriteCanteens))
                    .catch(reason => console.error(componentName, ':', 'can`t store canteens: ', reason, 'key:', FavoriteCanteensStoreKey, 'value:', favoriteCanteens));
            }
        },
        [favoriteCanteens]
    )

    console.debug(componentName, ':', 'favorite selections', ':', favoriteSelections);
    console.debug(componentName, ':', 'available selections', ':', availableSelections);

    const activeSelections = useMemo(
        () => {
            if (Array.isArray(favoriteSelections) && favoriteSelections.length > 0 && Array.isArray(availableSelections)) {
                return availableSelections
                    .filter(availableSelection => favoriteSelections.includes(availableSelection.code));
            } else {
                return null;
            }
        },
        [favoriteSelections, availableSelections]
    );

    console.debug(componentName, ':', 'active selections', ':', activeSelections);

    const activeSelectionFilters = useMemo(
        () => {
            if (Array.isArray(activeSelections) && activeSelections.length > 0) {
                return [
                    ...new Set(
                        activeSelections
                            .flatMap(activeSelection => activeSelection?.filters)
                    )
                ];
            } else {
                return null;
            }
        },
        [activeSelections]
    )

    console.debug(componentName, ':', 'active selection filter', ':', activeSelectionFilters);


    console.debug(componentName, ':', 'available meal typeas', ':', availableMealTypes);
    console.debug(componentName, ':', 'favorite meal types', ':', favoriteMealTypes);

    const activeMealtypes = useMemo(
        () => {
            if (Array.isArray(favoriteMealTypes) && favoriteMealTypes.length > 0 && Array.isArray(availableMealTypes)) {
                return availableMealTypes
                    .filter(activeMealtype => favoriteMealTypes.includes(activeMealtype.code));
            }
            else {
                return null;
            }
        },
        [favoriteMealTypes, availableMealTypes]
    )

    console.debug(componentName, ':', 'active meal types', ':', activeMealtypes);

    const activeMealtypeFilters = useMemo(
        () => {
            if (Array.isArray(activeMealtypes) && activeMealtypes.length > 0) {
                return [
                    ... new Set(
                        activeMealtypes
                            .flatMap(activeMealtype => activeMealtype?.filters ?? activeMealtype?.code ?? [])
                    )
                ];
            } else {
                return null;
            }
        }
    )

    console.debug(componentName, ':', 'active meal type filters', ':', activeMealtypeFilters);

    // Estellen des API-Providers bzw. erneuern wenn sich Einstellungen sich ändern.
    const apiProvider = useMemo(
        () => {
            switch (canteenApiProvider?.toLowerCase()) {
                case AsistServerProviderName:
                    console.debug(componentName, ': use asist server api');
                    return new AsistServerApiProvider.from(canteenApiBaseUrl, canteenApiUniversity, language);
                case CollectorVersion2ProviderName:
                    console.debug(componentName, ': use collector v2 api');
                    return new CollektorVersion2ApiProvider.from(canteenApiBaseUrl, language);
                default:
                    console.log(`${componentName}: Can't build api provider: ${canteenApiProvider}`)
                    return null;
            }
        },
        [canteenApiSettings, canteenApiProvider, canteenApiBaseUrl, canteenApiUniversity, language]
    );

    // Sobald der Mensa-Context erstellt wird, werden die Mensen vom Server geholt
    useEffect(
        () => {
            if (apiProvider) {
                apiProvider.getCanteens()
                    .then(
                        canteens => {
                            // Jede Mensa wird einzeln in den Mensa-State hineinreduziert
                            canteens.forEach(canteen => dispatchCanteens({ type: SetCanteenAction, canteen }));

                            // Danach werden die alten Mensen, die nicht in der Serverantwort sind, herausreduziert
                            // Liste der IDs der in der Serverantwort enthaltenen Mensen erstellen
                            const activeCanteenIds = canteens.map(canteen => canteen?.id);
                            // Alte Mensen aus den gecachten Mensa-Daten löschen
                            dispatchCanteens(
                                {
                                    type: RemoveUnusedCanteensAction,
                                    activeCanteenIds: activeCanteenIds,
                                }
                            );
                            // Alte Mensen aus den favorisierten Mensen löschen
                            dispatchFavoriteCanteens(
                                {
                                    type: RemoveUnusedCanteensAction,
                                    activeCanteenIds: activeCanteenIds,
                                }
                            );
                        }
                    );
            }
        },
        [apiProvider]
    );

    /**
     * Refresh a menu in canteens object.
     *
     * @param {String} canteenId ID of the canteen of the menu to be refreshing
     * @param {String} date Date of the menu to be refreshing
     * @returns {Promise<void>} Promise as an indicator of whether the refresh is in progress
     */
    function refreshMenu(canteenId, date) {
        return apiProvider.getMenu(canteenId, date)
            .then(
                menu =>
                    dispatchCanteens(
                        {
                            type: SetMenuAction,
                            menu,
                            canteenId: canteenId,
                            date: date,
                        }
                    ),
                reason => {
                    if (reason instanceof NotModifiedResponse) {
                        console.debug(componentName, ':', 'Meal from', date, 'and canteen', canteenId, 'not modified');
                    } else {
                        throw reason;
                    }
                }
            );
    }

    /**
     * Setz den vom Nutzer gewünschen Mensapreis, anhand des Codes der entsprechnden Personengruppe.
     * @function
     * @param {string} personGroupCode Code der Personengruppe, welche für die Mensapreise zu verwenden ist
     */
    const setPriceGroupCode = useCallback(
        /**
         * @param {string} personGroupCode Code der Personengruppe, welche für die Mensapreise zu verwenden ist
         */
        (personGroupCode) =>
            reduxDispatch(
                onSettingCanteenMerge(
                    "canteenSettings",
                    { favoritePrice: personGroupCode }
                )
            ),
        [reduxDispatch]
    );

    /**
     * Setzt die favorsierten Mensen, anhand einer Liste der IDs
     */
    const setFavoriteCanteens = useCallback(
        /**
         * @param {string[]} favoriteCanteens IDs der Mensen, die als favorisiert gesetzt werden sollen
         */
        (favoriteCanteens) => {
            console.debug(componentName, ':', 'set favorite canteens', ':', favoriteCanteens);
            dispatchFavoriteCanteens(
                {
                    type: SetCanteensAction,
                    canteensIds: favoriteCanteens,
                }
            );
        },
        [dispatchFavoriteCanteens, SetCanteensAction]
    );

    // Render the provider component with the filtered canteens and canteens data
    return (
        <CanteenContext.Provider
            value={{
                canteens: canteens ?? {},
                favoriteCanteens: favoriteCanteens ?? Object.keys(canteens ?? {}),
                setFavoriteCanteens,
                priceGroupCode,
                setPriceGroupCode,
                activeSelections,
                activeSelectionFilters,
                activeMealtypes,
                activeMealtypeFilters,
                refreshMenu,
            }}
        >
            {children}
        </CanteenContext.Provider>
    );
}

// Map the Redux state to props
const mapStateToProps = storeState => {
    return {
        settings: storeState.settingReducer,
        rootUrl: storeState.settingReducer.api.rootUrl,
        rootStgUrl: storeState.settingReducer.api.rootStgUrl,
        useStaging: storeState.settingReducer.settingsDevelop.useStaging,
    };
};

// Connect the CanteenContextProvider component to Redux
const ConnectedCanteenContextProvider = connect(mapStateToProps)(CanteenContextProvider);


// Custom hook to use the CanteenContext
function useCanteenContext() {
    const context = useContext(CanteenContext);
    if (context === undefined) {
        throw new Error('useCanteenContext must be used within a CanteenContextProvider')
    }
    return context;
}

/**
 * Dieser Hook gibt die Mensen und eine Aktualisierungsfunktion für Tagesangebote zurück.
 * @returns {[?Object, (canteenId: String, menuDate: String) => Promise<void>]} Ein aus 2 Elementen bestehendes Array. Das erste Element ist ein Objekt, welches die Mensen enthält. Das zweite Element ist die Aktualisierungsfunktion.
 * @example
 * [canteens, refreshMenu] = useCanteen();
 * canteen = canteens['1'];
 * menu = canteen.menus['2024-12-31'];
 * meal = menu[0];
 *
 * refreshMenu('1', '2024-12-31');
 */
function useCanteens() {
    const canteenContext = useCanteenContext();

    return [canteenContext.canteens ?? null, canteenContext.refreshMenu];
}

/**
 *
 *
 * @param {String} canteenId
 * @returns {[?Object, (menuDate: String) => Promise<void>]}
 */
function useCanteen(canteenId) {
    const [canteens, refreshMenu] = useCanteens();

    return [
        canteens?.[canteenId] ?? null, // Holt die Mensa mit der ID canteenId aus dem Mensa-Objekt
        (menuDate) => refreshMenu(canteenId, menuDate), // Erstellt eine Funktion, die das Essen ohne angeben der canteenId aktualisiert
    ];
}

/**
 *
 *
 * @param {String} canteenId
 * @param {String} menuDate
 * @returns {[?Object[], () => Promise<void>]}
 */
function useMenu(canteenId, menuDate) {
    const [canteen, refreshMenu] = useCanteen(canteenId);

    return [
        canteen?.menus?.[menuDate] ?? null, // Holt das Essen aus der Mensa mit der ID canteenId
        () => refreshMenu(menuDate), // Erstellt eine Funktion, die das Essen ohne angeben von canteenId und menuDate aktualisiert
    ];
}

/**
 *
 *
 * @param {String} canteenId
 * @param {String} menuDate
 * @returns {[?Object, () => Promise<void>]}
 */
function useFilteredMenu(canteenId, menuDate) {
    //const hookName = arguments.callee.name;
    //const hookCall = `${hookName}(canteenId: ${canteenId}, menuDate: ${menuDate})`;

    const {
        activeSelections,
        activeSelectionFilters,
        activeMealtypes,
        activeMealtypeFilters
    } = useCanteenContext();
    const [menu, refreshMenu] = useMenu(canteenId, menuDate);

    let filteredMenu = menu;

    if (activeSelectionFilters) {
        filteredMenu = filteredMenu?.filter(
            meal => activeSelectionFilters.every(
                activeSelectionFilter => meal.selections.includes(activeSelectionFilter)
            )
        );
    }

    if (activeMealtypeFilters) {
        filteredMenu = filteredMenu
            ?.filter(
                meal =>
                    meal?.type
                        ? activeMealtypeFilters.includes(meal.type)
                        : true
            );
    }

    const mealAmount = menu?.length ?? 0;
    const filteredMealAmount = filteredMenu?.length ?? 0;

    return [
        filteredMenu,
        refreshMenu,
        mealAmount,
        filteredMealAmount,
        activeSelections,
        activeMealtypes,
    ];
}

/**
 * Gibt ein Array zurück, welches als erstes Element den Coder der aktuellen Preisgruppe für Mensaessen enthält.
 * Als Zweites wird eine Funktion zum setzen der Preisgruppe in dem Rückgabearray gespeichert.
 *
 * Es werden 3 Quellen zum ermitteln der Preisgruppe verwendet.
 * Zuerst wird geprüft, ob der Nutzer selber einen Preis gesetzt hat, dann wird dieser verwendet.
 * Ansonsten wird geprüft, ob ein Nutzer eingeloggt ist und dessen Angehörigkeitsstatus ausgewertet.
 * Treffen diese beiden Fälle nicht zu, wird die als Standartgruppe gesetzte Gruppe verwendet.
 * @returns {[priceGroupCode: string, (priceGroupCode:string) => void ]}
 * @example
 * const [priceGroupCode, setPriceGroupCode] = usePriceGroupCode();
 *
 * console.log(priceGroupCode);
 * setPriceGroupCode('guest');
 */
function usePriceGroupCode() {
    const { priceGroupCode, setPriceGroupCode } = useCanteenContext();

    return [priceGroupCode, setPriceGroupCode];
}

/**
 * Gibt die favorisierten Mensen und eine Set-Funktion für diese in einem Array zurück.
 *
 * @returns {[favoriteCanteens: string[], setFavoriteCanteens: (favoriteCanteens: string[]) => void]}
 * @example
 * const [favoriteCanteens, setFavoriteCanteens] = useFavoriteCanteens();
 *
 * setFavoriteCanteens(['canteen1', 'canteen2']);
 */
function useFavoriteCanteens() {
    const { favoriteCanteens, setFavoriteCanteens } = useCanteenContext();

    return [favoriteCanteens, setFavoriteCanteens];
}

export {
    ConnectedCanteenContextProvider as CanteenContextProvider,
    CanteenContext as default,
    useCanteenContext,
    useCanteens,
    useCanteen,
    useMenu,
    useFilteredMenu,
    usePriceGroupCode,
    useFavoriteCanteens,
};
