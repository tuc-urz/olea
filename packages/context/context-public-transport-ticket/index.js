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

import { useSecureStoredState } from '@openasist/stored-state';
import { useLanguage, useStagingServer } from '@openasist/core';
import { useAccessToken } from '@openasist/context-user';

import CollektorVersion2ApiProvider from './CollektorVersion2ApiProvider';

/**
 * @typedef Ticket
 * @property {string} barcode
 * @property {string} owner
 * @property {date} valid_from
 * @property {date} valid_to
 */

/**
 * @typedef PublicTransportTicketContext
 * @property {string} ticketBarcode
 * @property {string} ticketOwner
 * @property {string} ticketValidFrom
 * @property {string} ticketValidTo
 * @property {() => Promise<void>} refreshTicket
 */

const ticketBarcodeStoreKey = 'publictransportticket.ticketBarcode';
const ticketOwnerStoreKey = 'publictransportticket.ticketOwner';
const ticketValidFromStoreKey = 'publictransportticket.ticketValidFrom';
const ticketValidToStoreKey = 'publictransportticket.ticketValidTo';

const PublicTransportTicketContext = createContext();

/**
 * Provider for public transport ticket context
 */
function PublicTransportTicketContextProvider({ children }) {
    const componentName = PublicTransportTicketContextProvider.name;
    const theme = useTheme();
    const isStagingServerActive = useStagingServer();
    const language = useLanguage();
    const accessToken = useAccessToken();

    // Einstellungen für das ÖPNV-Ticket-Moduls
    const publicTransportTicketSettings = theme?.appSettings?.modules?.publicTransportTicket;
    // Einstellungen für die API-Provider
    const publicTransportTicketApiSettings = publicTransportTicketSettings?.api;
    // Soll der Staging-Provider verwendet werden?
    const publicTransportTicketApiProviderSettings = isStagingServerActive
        // Wenn ja, werden die Staging Provider-Einstellungen geladen
        ? publicTransportTicketApiSettings?.staging
        // Wenn nein, werden die productiven Provider-Einstellungen geladen
        : publicTransportTicketApiSettings?.production;
    // Basis URL der API
    const publicTransportTicketApiBaseUrl = publicTransportTicketApiProviderSettings?.url;

    const apiProvider = useMemo(
        () =>
            CollektorVersion2ApiProvider.from(
                publicTransportTicketApiBaseUrl,
                language,
                accessToken,
            ),
        [publicTransportTicketApiBaseUrl, language, accessToken]
    )

    const [ticketBarcode, setTicketBarcode] = useSecureStoredState(ticketBarcodeStoreKey, null);
    const [ticketOwner, setTicketOwner] = useSecureStoredState(ticketOwnerStoreKey, null);
    const [ticketValidFrom, setTicketValidFrom] = useSecureStoredState(ticketValidFromStoreKey, null);
    const [ticketValidTo, setTicketValidTo] = useSecureStoredState(ticketValidToStoreKey, null);

    const refreshTicket = useCallback(
        apiProvider && accessToken
            ? () => apiProvider.getTicket()
                .then(
                    ticket => {
                        setTicketBarcode(ticket?.barcode ?? null);
                        setTicketOwner(ticket?.owner ?? null);
                        setTicketValidFrom(ticket?.validFrom ?? null);
                        setTicketValidTo(ticket?.validTo ?? null);
                        console.debug(componentName, ':', 'Get ticket barcode', ':', ticket.barcode);
                    }
                )
            : undefined
        ,
        [apiProvider, accessToken, componentName]
    )

    useEffect(
        () => {
            refreshTicket?.();
        },
        [refreshTicket]
    );

    return (
        <PublicTransportTicketContext.Provider
            value={{
                ticketBarcode,
                ticketOwner,
                ticketValidFrom,
                ticketValidTo,
                refreshTicket,
            }}
        >
            {children}
        </PublicTransportTicketContext.Provider>
    );
}

/**
 * Liefert den PublicTransportTicketContext zurück.
 * @return {PublicTransportTicketContext} Kontext des Ticket-Modules
 * @example
 * const infoContext = usePublicTransportTicketContext();
 */
function usePublicTransportTicketContext() {
    return useContext(PublicTransportTicketContext);
}

/**
 * Liefert alle noch austehenden Infos zurück.
 * Austehende Infos sind noch nicht als angezeigt markiert.
 *
 * @returns {[barcode: string|undefined, owner: string|undefined, validForm: string|undefined, validTo: string|undefined, refreshTicket: () => Promise<void>|undefined]}
 * @example
 * const [
 *     ticketBarcode,
 *     ticketOwner,
 *     ticketValidFrom,
 *     ticketValidTo,
 *     refreshTicket,
 *     refreshTicket
 * ] = usePublicTransportTicket();
 *
 * useEffect(
 *     () => {
 *         refreshInfos?.()
 *     },
 *     [refreshInfos]
 * );
 */
function usePublicTransportTicket() {
    const publicTransportTicketContext = usePublicTransportTicketContext();

    return [
        publicTransportTicketContext?.ticketBarcode,
        publicTransportTicketContext?.ticketOwner,
        publicTransportTicketContext?.ticketValidFrom,
        publicTransportTicketContext?.ticketValidTo,
        publicTransportTicketContext?.refreshTicket
    ];
}

export {
    usePublicTransportTicketContext as default,
    PublicTransportTicketContextProvider,
    usePublicTransportTicketContext,
    usePublicTransportTicket,
}
