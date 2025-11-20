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

import { createContext, use, useMemo, useEffect } from 'react';
import { AppState } from 'react-native';

import { useTheme } from 'react-native-paper';

import { useLanguage, useStagingServer } from '@openasist/core';
import { useAccessToken } from '@openasist/context-user';

import MailService, { useUnreadEmailCount as syncUnreadEmailCount } from './MailService';

/**
 * @typedef MailsContext
 * @property {number} unreadEmailCount
 * @property {() => Promise<void>} refreshUnreadEmailCount
 */

const MailsContext = createContext();

/**
 * Provider for mails context
 */
function MailsContextProvider({ children }) {
    const theme = useTheme();
    const isStagingServerActive = useStagingServer();
    const language = useLanguage();
    const accessToken = useAccessToken();

    // Einstellungen für das ÖPNV-Ticket-Moduls
    const mailsSettings = theme?.appSettings?.modules?.mails;
    // Einstellungen für die API-Provider
    const mailsApiSettings = mailsSettings?.api;
    // Soll der Staging-Provider verwendet werden?
    const mailsApiProviderSettings = isStagingServerActive
        // Wenn ja, werden die Staging Provider-Einstellungen geladen
        ? mailsApiSettings?.staging
        // Wenn nein, werden die productiven Provider-Einstellungen geladen
        : mailsApiSettings?.production;

    const mailService = useMemo(
        () =>
            accessToken
                ? MailService.fromProviderSettingsObject(
                    mailsApiProviderSettings,
                    language,
                    accessToken,
                )
                : null,
        [mailsApiProviderSettings, language, accessToken]
    )

    const [unreadEmailCount, refreshUnreadEmailCount] = syncUnreadEmailCount(mailService);

    useEffect(
        () => {
            const subscription = AppState.addEventListener(
                'change',
                nextAppState => {
                    if (nextAppState === 'active') {
                        refreshUnreadEmailCount?.();
                    }
                }
            );

            return () => {
                subscription.remove();
            };
        },
        [refreshUnreadEmailCount]
    );

    return (
        <MailsContext
            value={{
                unreadEmailCount,
                refreshUnreadEmailCount,
            }}
        >
            {children}
        </MailsContext>
    );
}

/**
 * Liefert den MailsContext zurück.
 * @return {MailsContext} Kontext des Mails-Modules
 * @example
 * const mailsContext = useMailsContext();
 */
function useMailsContext() {
    return use(MailsContext);
}

/**
 * Hook, der die Anzahl ungelesender Mails und eine Aktuallierungsfunktion zur Verfüfung stellt. 
 * 
 * @returns {[unreadEmailCount: number|undefined, refreshUnreadEmailCount: () => Promise<void>|undefined]}
 * @example
 * const [unreadEmailCount, refreshUnreadEmailCount] = useUrefreshUnreadEmailCount();
 *
 * useEffect(
 *     () => {
 *         refreshUnreadEmailCount?.()
 *     },
 *     [refreshUnreadEmailCount]
 * );
 */
function useUnreadEmailCount() {
    const mailsContext = useMailsContext();

    return [mailsContext?.unreadEmailCount, mailsContext?.refreshUnreadEmailCount];
}

export {
    useMailsContext as default,
    MailsContextProvider,
    useUnreadEmailCount,
}