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

import { createContext, useEffect, useContext, useMemo, useCallback } from 'react'

import { useTheme } from 'react-native-paper';

import { useSecureStoredReducer, useSecureStoredState } from '@openasist/stored-state';
import { useLanguage, useStagingServer } from '@openasist/core';

import CollektorVersion2ApiProvider from './CollektorVersion2ApiProvider';

/**
 * @typedef Info
 * @property {string} id
 * @property {string} title
 * @property {string} message
 * @property {date} expiry
 */

/**
 * @typedef InfoContext
 * @property {Info[]} pendingInfos
 * @property {(infoId: string) => Promise<void> } setInfoDisplayed
 */

const InfoDialogInfosStoreKey = 'infodisplay.infos';
const InfoDialogDisplayedInfosStoreKey = 'infodisplay.displayedInfos';

function displayedInfosReducer(state, addingInfo) {
    return [
        ...(state ?? []),
        addingInfo,
    ]
}

const InfoContext = createContext();

/**
 * Provider for info dialog context
 */
export default function InfoContextProvider({ children }) {
    const componentName = arguments.callee.name;
    const theme = useTheme();
    const isStagingServerActive = useStagingServer();
    const language = useLanguage();

    // Einstellungen für das InfoDialog-Moduls
    const infoDialogSettings = theme?.appSettings?.modules?.infodialog;
    // Einstellungen für die API-Provider
    const infoDialogApiSettings = infoDialogSettings?.api;
    // Soll der Staging-Provider verwendet werden?
    const infoDialogApiProviderSettings = isStagingServerActive
        // Wenn ja, werden die Staging Provider-Einstellungen geladen
        ? infoDialogApiSettings?.staging
        // Wenn nein, werden die productiven Provider-Einstellungen geladen
        : infoDialogApiSettings?.production;
    // Basis URL der API
    const infoDialogApiBaseUrl = infoDialogApiProviderSettings?.url;

    const apiProvider = useMemo(
        () =>
            CollektorVersion2ApiProvider.from(
                infoDialogApiBaseUrl,
                language
            ),
        [infoDialogApiBaseUrl, language]
    )

    const [infos, setInfos] = useSecureStoredState(InfoDialogInfosStoreKey, []);
    const [displayedInfos, addDisplayedInfos] = useSecureStoredReducer(InfoDialogDisplayedInfosStoreKey, displayedInfosReducer, []);

    const pendingInfos = useMemo(
        () => {
            return infos?.filter?.(info => !displayedInfos.includes(info?.id));
        },
        [infos, displayedInfos]
    )

    console.debug(componentName, ':', 'infos', ':', infos);
    console.debug(componentName, ':', 'pending infos', ':', pendingInfos);

    //// Estellen des API-Providers bzw. erneuern wenn sich Einstellungen sich ändern.
    //const apiProvider = useMemo(
    //    () => {
    //        switch (timetableApiProvider?.toLowerCase()) {
    //            case AsistServerProviderName:
    //                console.debug(componentName, ': use asist server api');
    //                return new AsistServerApiProvider.from(timetableApiBaseUrl, timetableApiUniversity, 'de');
    //                break;
    //            case CollectorVersion2ProviderName:
    //                console.debug(componentName, ': use collector v2 api');
    //                return new CollektorVersion2ApiProvider.from(timetableApiBaseUrl);
    //                break;
    //            default:
    //                console.log(`${componentName}: Can't build api provider: ${timetableApiProvider}`)
    //                return null;
    //        }
    //    },
    //    [timetableApiProvider, timetableApiBaseUrl, timetableApiUniversity]
    //);

    /**
     * Makiert eine Info als angezeigt.
     * @param {string} infoID ID der Info, welche als angezeigt makiert werden soll
     */
    const setInfoDisplayed = useCallback(
        async (infoID) => {
            addDisplayedInfos(infoID);
        },
        [addDisplayedInfos]
    );

    const refreshInfos = useCallback(
        () => {
            apiProvider.getInfos()
                .then(
                    infos => {
                        setInfos(infos);
                        console.debug(componentName, ':', 'Get infos', ':', infos);
                    }
                );
        },
        [apiProvider, setInfos, componentName]
    )

    // Aktualiseren Infos beim Starten der App
    useEffect(
        () => {
            refreshInfos();
        },
        [refreshInfos]
    );

    return (
        <InfoContext.Provider
            value={{
                pendingInfos,
                setInfoDisplayed,
                refreshInfos,
            }}
        >
            {children}
        </InfoContext.Provider>
    );
}

/**
 * Liefert den InfoContext zurück.
 * @return {InfoContext} Kontext des Info-Modules
 * @example
 * const infoContext = useInfoContext();
 */
export function useInfoContext() {
    return useContext(InfoContext);
}

/**
 * Liefert alle noch austehenden Infos zurück.
 * Austehende Infos sind noch nicht als angezeigt markiert.
 *
 * @returns {[Info[], (displayedInfoId: string) => Promise<void>, () => void]}
 * @example
 * const [pendingInfos, setInfoDisplayed, refreshInfos] = usePendingInfos();
 *
 * setInfoDisplayed('1d3514da-37b1-49df-9bc1-7432a777c498');
 *
 * useEffect(
 *     () => {
 *         refreshInfos()
 *     },
 *     [refreshInfos]
 * );
 */
export function usePendingInfos() {
    const { pendingInfos, setInfoDisplayed, refreshInfos } = useInfoContext();

    return [pendingInfos, setInfoDisplayed, refreshInfos];
}