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

import { createContext, useContext, useMemo, useEffect, useState, useCallback } from 'react';

import { useTheme } from 'react-native-paper';

import { useAccessToken, useLogoutEffect } from '@olea-bps/context-user';

import TucCallManager from './TucCallManager';

const TucCallManagerProviderName = 'tuc-call-manager';

const CallManagerContext = createContext();

/**
 * Provider for telephone context
 */
function CallManagerContextProvider({ children }) {
    const componentName = CallManagerContextProvider.name;
    const theme = useTheme();

    // Einstellungen für API-Provider
    const callManagerApiSettings = theme?.appSettings?.modules?.callManager?.api;
    const callManagerApiProvider = callManagerApiSettings?.provider;
    const callManagerApiBaseUrl = callManagerApiSettings?.baseUrl;

    const accessToken = useAccessToken();

    const [parallelCalls, setParallelCalls] = useState();

    // Estellen des API-Providers bzw. erneuern wenn sich Einstellungen sich ändern.
    const apiProvider = useMemo(
        () => {
            switch (callManagerApiProvider?.toLowerCase()) {
                case TucCallManagerProviderName:
                    console.debug(componentName, ':', 'use tu chemnitz call manager');
                    return new TucCallManager.from(callManagerApiBaseUrl, 'de', accessToken);
                default:
                    console.log(`${componentName}: Can't build api provider: ${callManagerApiProvider}`)
                    return null;
            }
        },
        [callManagerApiProvider, callManagerApiBaseUrl, accessToken]
    );

    async function refreshParallelCalls() {
        return apiProvider.getParallelCalls()
            .then(
                parallelCalls => {
                    setParallelCalls(parallelCalls);
                    console.debug(componentName, ':', 'get parralel calls', ':', parallelCalls);
                }
            );
    }

    useEffect(
        () => {
            refreshParallelCalls?.()
                ?.catch?.(
                    reason => {
                        setParallelCalls([]);
                        console.debug(componentName, ':', 'can`t get parralel calls', ':', reason);
                    }
                );
        },
        [apiProvider]
    )

    function changeParallelCall(parallelCallId, parallelCall) {
        return apiProvider.setParallelCall(parallelCallId, parallelCall);
    }

    // Dieser Effekt setzt den State der Parrelelrufe zurück, wenn der Nutzer sich abmeldet.
    useLogoutEffect(
        useCallback(
            user => {
                console.debug(componentName, ':', 'remove paralel calls from', user.sub, 'in memory');
                setParallelCalls(undefined);
            },
            []
        )
    );

    return (
        <CallManagerContext.Provider
            value={{
                parallelCalls: parallelCalls,
                refreshParallelCalls: refreshParallelCalls,
                changeParallelCall: changeParallelCall,
            }}
        >
            {children}
        </CallManagerContext.Provider>
    );
}

function useCallManagerContext() {
    return useContext(CallManagerContext);
}

function useParallelCalls() {
    const callManagerContext = useCallManagerContext();

    return [
        callManagerContext?.parallelCalls,
        callManagerContext?.refreshParallelCalls,
        callManagerContext?.changeParallelCall
    ];
}

export {
    CallManagerContext as default,
    CallManagerContextProvider,
    useCallManagerContext,
    useParallelCalls,
}
