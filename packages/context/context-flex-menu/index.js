import { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react'

import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useStagingServer } from "@olea-bps/core";

import CollectorVersion2ApiProvider from './CollectorVersion2ApiProvider'

const AsistServerProviderName = 'asist-server';
const CollectorVersion2ProviderName = 'hs-collector-v2';

const MenuEntriesStoreKey = 'flexMenu.menuEnries';

/**
 * @typedef {Object} MenuEntry
 * @property {string} id Id des Menüeintrages
 * @property {string[]} subMenuEntries Liste der IDs der Untermenüeinträge
 * @property {string} parentMenuEntry ID des Elternmenüeintrages
 * @property {string} openIn `webbrowser` wenn die URL im Browser geöffent werden soll. `webview` wenn die URL in einer Webview geöffent werden soll.
 * @property {string} type - Falls dieser Menüeintrag ein Hauptmenüeintrag ist, ist hier der zugeötige Tab anzugeben
 * @property {string} language Sprache des Menüeintrages. Die möglichen Werte sind in der Settings.js in der Sprachenliste als `extCode` zu finden
 * @property {string} title Titel des Menüeintrages
 * @property {string} description Beschreibung
 * @property {string} url URL des Menüeintrages. Wie diese URL geöffnet wird, wird über {@link openIn } geregelt
 * @property {string} icon Name des anzuzeigenen Icons
 * @property {string} image URL des Anzuziegenden Bildes
 */

export const FlexMenuContext = createContext({
    menuEntries: [],
});

function FlexMenuContextProvider({ children }) {
    const componentName = FlexMenuContextProvider.name;
    const theme = useTheme();
    const isStagingServerActive = useStagingServer();

    // Einstellungen für das InfoDialog-Moduls
    const flexMenuSettings = theme?.appSettings?.modules?.flexmenu;
    // Einstellungen für die API-Provider
    const flexMenuApiSettings = flexMenuSettings?.api;
    // Soll der Staging-Provider verwendet werden?
    const flexMenuApiProviderSettings = isStagingServerActive
        // Wenn ja, werden die Staging Provider-Einstellungen geladen
        ? flexMenuApiSettings?.staging
        // Wenn nein, werden die productiven Provider-Einstellungen geladen
        : flexMenuApiSettings?.production;
    // Basis URL der API
    const flexMenuApiBaseUrl = flexMenuApiProviderSettings?.url;
    // API-Provider
    const flexMenuApiProvider = flexMenuApiProviderSettings?.provider;

    const [menuEntries, setMenuEntries] = useState(null);

    // Estellen des API-Providers bzw. erneuern wenn sich Einstellungen ändern.
    const apiProvider = useMemo(
        () => {
            switch (flexMenuApiProvider?.toLowerCase()) {
                //case AsistServerProviderName:
                //    return new AsistServerApiProvider.from(timetableApiBaseUrl, timetableApiUniversity, 'de');
                //    break;
                case CollectorVersion2ProviderName:
                    return new CollectorVersion2ApiProvider.from(flexMenuApiBaseUrl);
                    break;
                default:
                    console.log(`${componentName}: Can't build api provider: ${flexMenuApiProvider}`)
                    return null;
            }
        },
        [flexMenuApiProvider, flexMenuApiBaseUrl]
    );

    const refreshMenuEntries = useCallback(
        () =>
            apiProvider?.getMenuEntries()
                .then(setMenuEntries)
                .catch(reason => console.error(componentName, ':', 'Error while updating menu entries', ':', reason)),
        [apiProvider, setMenuEntries]
    );

    // Aktualiseren des menuEntries-States
    useEffect(
        () => {
            refreshMenuEntries();
        },
        [refreshMenuEntries]
    );

    // Speichert die geänderten Menüpunkte in den Store
    useEffect(
        () => {
            if (menuEntries) {
                AsyncStorage.setItem(MenuEntriesStoreKey, JSON.stringify(menuEntries))
                    .catch(reason => console.error(`${componentName}: Error while safing courses in store: ${reason}`));
            }
        },
        [menuEntries]
    );

    return (
        <FlexMenuContext.Provider
            value={{
                menuEntries,
                refreshMenuEntries,
            }}
        >
            {children}
        </FlexMenuContext.Provider>
    )

}

function useFlexMenuContext() {
    return useContext(FlexMenuContext);
}

function useMenuEntries() {
    const { menuEntries, refreshMenuEntries } = useFlexMenuContext();

    return [
        Array.isArray(menuEntries)
            ? menuEntries
            : [],
        refreshMenuEntries
    ];
}

function useChildMenuEntries(parentMenuId) {
    const [menuEntries, refreshMenuEntries] = useMenuEntries();

    // Alle Menüeinträge nach der parentMenuId filtern
    const childMenuEntries = menuEntries.filter(
        // Die Eltern-ID des zu filternden Menüeintrages wird in die Pfad-Segmente zerlegt und das letzte Segment zum vergleichen genommen.
        // Falls Eltern-ID im zu filternden Menüeintrages nicht vorhanden, wird null als Ersatzwert verwendet.
        menuEntry => parentMenuId === (menuEntry?.parentMenuEntry?.split?.('/')?.filter?.(urlSegment => urlSegment !== '')?.pop?.() ?? null)
    );

    return [childMenuEntries, refreshMenuEntries]
}

/**
 * Es werden alle Hauptmenüeinträge zurückgegeben, wobei Menueinträge ohne Eltern-ID sind Hauptmenüeinträge
 * @returns {[MenuEntry[], () => void]}
 * @example
 * const [mainMenuEntries, refreshMenuEntries] = useMainMenuEntries();
 */
function useMainMenuEntries() {
    // Menueinträge ohne Eltern-ID sind Hauptmenüeinträge
    return useChildMenuEntries(null);
}

export {
    FlexMenuContext as default,
    FlexMenuContextProvider,
    useFlexMenuContext,
    useMenuEntries,
    useChildMenuEntries,
    useMainMenuEntries,
}
