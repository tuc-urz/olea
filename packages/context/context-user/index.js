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

import { createContext, useState, useEffect, useContext, useMemo, useReducer, useCallback } from 'react'

import { useAutoDiscovery, makeRedirectUri, useAuthRequest, exchangeCodeAsync, refreshAsync } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import notifee, { TriggerType } from '@notifee/react-native';
import { DateTime } from 'luxon';

/**
 * @typedef {Object} OrganizationalUnit
 * @property {string} name Voller Name der Organisationseinheit/Kostenstelle/Fachbereich
 * @property {string} number Nummer der Organisationseinheit
 * @property {string} short_name Kurzbezeichner der Organisationseinheit
 */

/**
 * @typedef {Object} User
 * @property {string} sub Nutzername
 * @property {string} name Vorname und Nachname (display name) des Nutzers
 * @property {string} given_name Vorname
 * @property {string} family_name Nachname
 * @property {string} email Email
 * @property {string} phone_number Telefonnummer
 * @property {string[]} member_types Angehörigkeitsstatuse des Nutzers
 * @property {OrganizationalUnit[]} organizational_units Organisationseinheiten/Kostenstellen/Fachbereiche, die der Nutzer angehört
 */

/**
 * @typedef {Object} UserContext
 * @property {User?} user Angemeldeter Nutzer oder null, wenn nicht angemeldet
 * @property {string?} accessToken OAuth-Token
 * @property {string?} idToken Token für OpenID-Connect
 * @property {Function?} login Login-Funktion, um den Anmeldungprozzess zu starten.
 * @property {Function?} logout Logout-Funktion, um den Nutzer abzumelden.
 */

/**
 * @callback LogoutEffect
 * @param {User} user
 * @returns {void}
 */

class LoginError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

const IdTokenTokenSecureStoreKey = 'user.idToken';
const AccessTokenTokenSecureStoreKey = 'user.accessToken';
const ExpiresInTokenSecureStoreKey = 'user.expiresIn';
const IssuedAtTokenSecureStoreKey = 'user.issuedAt';
const RefreshTokenTokenSecureStoreKey = 'user.refreshToken';
const ScopeTokenSecureStoreKey = 'user.scope';

const AddLogoutEffectAction = 'add_logout_effect';
const RemoveLogoutEffectAction = 'remove_logout_effect';
const ClearLogoutEffectAction = 'clear_logout_effect';

const RefreshTokenReqiredNotificationChannelId = 'refresh_token_required';
const RefreshTokenReqiredNotificationId = 'refresh_token_required';
const RefreshTokenReqiredNotificationIcon = 'notification_icon';

const UserContext = createContext();

function useSecureStoredState(key, initialState = null, sensitiv = false) {
    const hookName = arguments.callee.name;

    const [state, setState] = useState(initialState);

    function setSecureStoredState(value) {
        SecureStore
            .setItemAsync(key, JSON.stringify(value ?? null))
            .then(() => setState(value ?? null))
            .catch(reason => console.error(hookName, ': can`t store secure state: ', reason, 'key:', key, 'value:', sensitiv ? '***sensitiv value***' : value));
    }

    function deleteSecureStoredState() {
        SecureStore
            .deleteItemAsync(key)
            .then(() => setState(null))
            .then(() => console.debug(hookName, ':', 'remove secure state', key))
            .catch((reason) => console.debug(hookName, ':', 'can`t remove secure state', key, ':', reason));
    }

    useEffect(
        () => {
            SecureStore.getItemAsync(key)
                .then(secureStateValue => {
                    if (secureStateValue !== null) {
                        setState(JSON.parse(secureStateValue));
                        console.debug(hookName, ':', 'restore secure state', key, '=', sensitiv ? '***sensitiv value***' : secureStateValue);
                    } else {
                        console.debug(hookName, ':', 'not restore for key', ':', key);
                    }
                })
                .catch(reason => console.error(hookName, ':', 'can not restore secure state', ':', reason, 'key', ':', key));
        }, []
    )

    return [state, setSecureStoredState, deleteSecureStoredState]
}

/**
 * Reducer für den logoutEffects-State.
 * @param {LogoutEffect[]} state
 * @param {Object} action
 * @param {string} action.type
 * @param {LogoutEffect} action.logoutEffect
 * @returns {LogoutEffect[]}
 */
function LogoutEffectsReducer(state, action) {
    const logoutEffect = action?.logoutEffect;

    switch (action.type) {

        // Hinzufügen eines Effektes für den Logout
        case AddLogoutEffectAction: {
            if (logoutEffect) {
                return [...state, logoutEffect];
            } else {
                return state;
            }
        }

        // Entfernen eines Effektes
        case RemoveLogoutEffectAction: {
            return state?.filter(filteringLogout => filteringLogout !== logoutEffect);
        }

        // Alle Effekte löschen
        case ClearLogoutEffectAction: {
            return [];
        }
    }
}

function selectLanguage(reduxState) {
    return reduxState?.settingReducer?.settings?.settingsGeneral?.language ?? 'de';
}

/**
 * Provider für den Nutzer-Kontext, welcher für die Anmeldung/Abmeldung des Nutzer zuständig ist.
 */
function UserContextProvider({ children }) {
    WebBrowser.maybeCompleteAuthSession();

    const componentName = arguments.callee.name;

    const { t } = useTranslation();
    const language = useSelector(selectLanguage);
    const theme = useTheme();
    const appSettings = theme?.appSettings;
    const authSettings = appSettings?.auth;
    const authRedirectUriScheme = authSettings?.scheme;
    const clientId = authSettings?.clientId;
    const issuer = authSettings?.issuer;
    const refreshTokenAtPercentage = 0.90;
    const scopes = [
        'openid',
        ...(authSettings?.scopes),
    ]

    const discovery = useAutoDiscovery(issuer);
    const [idToken, setIdToken, deleteIdToken] = useSecureStoredState(IdTokenTokenSecureStoreKey, null, true);
    const [accessToken, setAccessToken, deleteAccessToken] = useSecureStoredState(AccessTokenTokenSecureStoreKey, null, true);
    const [refreshToken, setRefreshToken, deleteRefreshToken] = useSecureStoredState(RefreshTokenTokenSecureStoreKey, null, true);
    const [expiresIn, setExpiresIn, deleteExpiresIn] = useSecureStoredState(ExpiresInTokenSecureStoreKey, null);
    const [issuedAt, setIssuedAt, deleteIssuedAt] = useSecureStoredState(IssuedAtTokenSecureStoreKey, null);
    const [user, setUser] = useState(null);
    const [logoutEffects, dispatchLogoutEffects] = useReducer(LogoutEffectsReducer, []);

    // Errechnen des Zeitpunktes, ab wann der Refresh-Token verfällt
    const refreshTokenExpiresAt = issuedAt && expiresIn
        ? issuedAt + expiresIn
        : null;

    // Errechnen des Zeitpunktes, ab wann das Token erneuert werden soll (Sekunden ab UNIX-Time)
    const refreshTokenAt = issuedAt && expiresIn && refreshTokenAtPercentage
        // Zeitpunkt(Zeitstempel), wann der jetzige Token erstellt wurde + (Zeit bis der Token verfallen ist * Prozentualler Anteil, in welchen der Token vor seinem Verfall erneuert werden soll)
        ? issuedAt + (expiresIn * refreshTokenAtPercentage)
        : null;

    const redirectUri = useMemo(
        () => makeRedirectUri({ scheme: authRedirectUriScheme, path: 'login' }),
        [authRedirectUriScheme]
    )

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: clientId,
            redirectUri: redirectUri,
            scopes: scopes,
        },
        discovery
    );

    function statesFromTokenResponse(tokenResponse) {
        setIdToken(tokenResponse?.idToken);
        setAccessToken(tokenResponse?.accessToken);
        setExpiresIn(tokenResponse?.expiresIn);
        setIssuedAt(tokenResponse?.issuedAt);
        setRefreshToken(tokenResponse?.refreshToken);
    }

    useEffect(
        () => {
            if (accessToken && discovery?.userInfoEndpoint) {
                fetch(
                    discovery.userInfoEndpoint,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + accessToken,
                        }
                    }
                ).then(
                    response => response.json()
                ).then(
                    userInfoJsonResponse => {
                        console.debug(componentName, ':', 'fetch user', ':', userInfoJsonResponse);

                        const userInfos = {
                            ...userInfoJsonResponse,
                            organizational_units: userInfoJsonResponse?.ou?.map(
                                (organizational_unit_name, index) => ({
                                    name: organizational_unit_name,
                                    number: userInfoJsonResponse?.ounumber?.[index],
                                    short_name: userInfoJsonResponse?.oushort?.[index],
                                })
                            ) ?? [],
                            member_types: [
                                ...(userInfoJsonResponse?.employeetype?.includes?.('Student') ? ['student'] : null),
                                ...(userInfoJsonResponse?.employeetype?.includes?.('Mitarbeiter') ? ['employee'] : null),
                            ]
                        };

                        console.debug(componentName, ':', 'convert response to user', ':', userInfos);

                        setUser(userInfos);
                    }
                ).catch(
                    reason => console.warn(componentName, ':', 'can`t fetch user infos', ':', reason)
                );
            }
        },
        [accessToken, discovery]
    );

    // Wenn das Format vom Server stimmt wird kann der oberer Hook mit diesem ersetzt werden
    //useEffect(
    //    () => {
    //        if (accessToken && discovery) {
    //            fetchUserInfoAsync(
    //                {
    //                    accessToken: accessToken
    //                },
    //                discovery,
    //            ).then(
    //                userInfo => console.warn(userInfo)
    //            ).then(
    //                response => response.json()
    //            ).then(
    //                jsonResponse => {
    //                    console.debug(componentName, ':', 'fetch user ', jsonResponse);
    //                    setUser(jsonResponse);
    //                }
    //            ).catch(
    //                reason => console.warn(componentName, ':', 'can`t fetch user infos', ':', reason)
    //            );
    //        }
    //    },
    // [accessToken, discovery]
    //);

    useEffect(
        () => {
            if (refreshToken && refreshTokenAt && discovery) {
                const refreshTokenAtMillisecond = refreshTokenAt * 1000;
                const now = Date.now()
                const timeout = setTimeout(
                    () =>
                        refreshAsync(
                            {
                                clientId, clientId,
                                refreshToken: refreshToken,
                            },
                            discovery,
                        ).then(
                            statesFromTokenResponse
                        ).catch(
                            reason => console.warn(componentName, ':', 'cant`t refresh tokens', ':', reason)
                        ),
                    refreshTokenAtMillisecond - now
                );
                return () => clearTimeout(timeout);
            }
        },
        [refreshToken, refreshTokenAt, discovery]
    );

    useEffect(
        () => {
            if (refreshToken && refreshTokenAt && refreshTokenExpiresAt) {
                notifee.requestPermission()
                    .then(
                        notificationSettings =>
                            notifee.createChannel({
                                id: RefreshTokenReqiredNotificationChannelId,
                                name: t('authentication:notificationChannelName'),
                                description: t('authentication:notificationChannelDescription'),
                                lights: true,
                                sound: 'default',
                            })
                    ).then(
                        channelId => {
                            const refreshTokenExpiresAtMillisecond = refreshTokenAt * 1000;
                            const refreshTokenExpiresAtDateTime = DateTime.fromMillis(refreshTokenExpiresAtMillisecond, { locale: language });
                            const refreshTokenExpiresAtDateLocaleString = refreshTokenExpiresAtDateTime.toLocaleString(DateTime.DATE_SHORT);
                            const refreshTokenExpiresAtTimeLocaleString = refreshTokenExpiresAtDateTime.toLocaleString(DateTime.TIME_SIMPLE);
                            return notifee.createTriggerNotification(
                                {
                                    id: RefreshTokenReqiredNotificationId,
                                    title: t(
                                        'authentication:tokenInvalidNotification',
                                        {
                                            refreshTokenExpiresAtDate: refreshTokenExpiresAtDateLocaleString,
                                            refreshTokenExpiresAtTime: refreshTokenExpiresAtTimeLocaleString

                                        }
                                    ),
                                    android: {
                                        channelId: channelId,
                                        showChronometer: true,
                                        chronometerDirection: 'down',
                                        timestamp: refreshTokenExpiresAt * 1000,
                                        smallIcon: RefreshTokenReqiredNotificationIcon,
                                    },
                                },
                                {
                                    type: TriggerType.TIMESTAMP,
                                    timestamp: refreshTokenExpiresAtMillisecond,
                                }
                            );
                        }
                    )
            } else {
                notifee.cancelDisplayedNotification(RefreshTokenReqiredNotificationId);
                notifee.cancelTriggerNotification(RefreshTokenReqiredNotificationId);
            }
        },
        [refreshToken && refreshTokenAt, language, t]
    )

    function login() {
        return promptAsync()
            .then(
                codeResponse => {
                    if (codeResponse?.type === 'success') {
                        return exchangeCodeAsync(
                            {
                                clientId,
                                code: codeResponse.params.code,
                                extraParams:
                                    request.codeVerifier
                                        ? { code_verifier: request.codeVerifier }
                                        : undefined,
                                redirectUri,
                            },
                            discovery
                        ).then(
                            statesFromTokenResponse
                        ).catch(
                            reason => console.log(componentName, ': tokenResponse: Fehler', ':', reason)
                        );
                    } else {
                        // TODO: Prüfen warum der Login nicht klappte und für die einzeilnen Gründe, genauere Fehlerinfos zurückgeben.
                        throw new LoginError(`Login Failed: ${codeResponse?.type}`);
                    }
                }
            );
    }

    /**
     * Fügt einen Effekt hinzu, welcher nach dem Logout ausgeführt wird.
     * Diese Funktion sollte nicht verwendet werden, stattdessen ist useLogoutEffect zu benutzen.
     * @function
     * @param {LogoutEffect} effect Callback welche noch dem Logout ausgeführt werden soll
     */
    const addLogoutListener = useCallback(
        /**
         * @param {LogoutEffect} effect Callback welche noch dem Logout ausgeführt werden soll
         */
        (effect) =>
            dispatchLogoutEffects(
                {
                    type: AddLogoutEffectAction,
                    logoutEffect: effect,
                }
            ),
        [dispatchLogoutEffects, AddLogoutEffectAction]
    );

    /**
     * Entfernt einen Effekt aus der Liste der Effekts, welche nach dem Logout ausgeführt werden.
     * Diese Funktion sollte nicht verwendet werden, stattdessen ist useLogoutEffect zu benutzen.
     * @function
     * @param {LogoutEffect} effect Callback, welche entfernt werden soll.
     */
    const removeLogoutListener = useCallback(
        /**
         * @param {LogoutEffect} effect
         */
        (effect) =>
            dispatchLogoutEffects(
                {
                    type: RemoveLogoutEffectAction,
                    logoutEffect: effect,
                }
            ),
        [dispatchLogoutEffects, RemoveLogoutEffectAction]
    );

    function logout() {
        deleteIdToken();
        deleteAccessToken();
        deleteExpiresIn();
        deleteIssuedAt();
        deleteRefreshToken();
        setUser(null);

        // Nachdem alles aufgeräumt ist, lösen wir die Effekte/Callbacks für den Logout aus
        logoutEffects?.forEach(effect => effect(user));
    }

    return (
        <UserContext.Provider
            value={{
                user: user,
                login: request ? login : null,
                logout: idToken !== null || accessToken !== null ? logout : null,
                accessToken: accessToken,
                idToken: idToken,
                addLogoutListener,
                removeLogoutListener,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

/**
 * Gib den Nutzercontext zurück
 * @returns {UserContext}
 */
function useUserContext() {
    return useContext(UserContext);
}

/**
 * Gibt den derzeitigen Access-Token des Nutzers zurück. Ist der Nutzer nicht angemeldet wird null zurückgeben.
 * @returns {string?} Access-Token oder null, wenn Nutzer nicht angemeldet.
 */
function useAccessToken() {
    return useUserContext()?.accessToken;
}

/**
 * Gibt den derzeitigen ID-Token des Nutzers zurück. Ist der Nutzer nicht angemeldet wird null zurückgeben.
 * @returns {string?} ID-Token oder null, wenn Nutzer nicht angemeldet.
 */
function useIdToken() {
    return useUserContext()?.idToken;
}

/**
 * Liefert den Nutzer, die Login-Funktion und die Logout-Funktion zurück.
 *
 * Dieser Hook kann von Modulen genutzt werden, um die Nutzerinformationen zu verwalten.
 * Dabei wird ein Array mit 3 Elementen zurückgegeben.
 *
 * Das erste Element ist der aktuelle eingelogte Nutzer oder null, wenn kein Nutzer eingeloogt ist.
 * Als Zweites wird eine Funktion für den Login zur Verfügung gestellt, welche parameterlos ausgeführt werden kann, um den Login-Prozess zu starten.
 * Das dritte Element ist eine Funktion für die Abmeldung des Nutzers, welche keinen Paremter entgegennimmt.
 *
 * @example
 * const [user, login, logout] = useUser();
 * if(!user) {
 *     login()
 *         .then(() => console.debug('Nutzer ist angemeldet'))
 *         .catch((reason) => console.debug('Nutzer konnte nicht angemeldet werden:', reason));
 * }
 *
 * return (
 *     <Text>
 *         {user?.diplayName ?? 'Kein Nutzer verfügbar'}
 *     </Text>
 * );
 * @return {[user: User?, login: () => Promise<void>, logout: () => Promise<void>]}
 * @return {User} user - Das Nutzerobjekt oder null wenn kein Nutzer angemeldet ist
 * @return {() => Promise<void>} login - Login-Funktion, die den Login-Prozess startet
 * @return {() => Promise<void>} logout - Logout-Funtion, welche den Nutzer abmeldet
 */
function useUser() {
    const userContext = useUserContext();

    return [userContext?.user, userContext?.login, userContext?.logout]
}

/**
 * Führt einen Effekt aus, wenn der Nutzer abgemeldet wird.
 * Der effect-Parameter ist eine Callback-Funktion.
 * @param {LogoutEffect} effect
 * @see LogoutEffect
 * @example
 * import { useCallback } from 'react';
 * import { useLogoutEffect } from '@olea/context-user';
 *
 * function MyComponent() {
 *
 *     useLogoutEffect(
 *         useCallback(
 *             user => {
 *                 console.log('Nutzer', user.sub, 'erfolgreich abgemeldet.');
 *             },
 *             []
 *         )
 *     );
 *
 * }
 */
function useLogoutEffect(effect) {
    // Holen der Logout-Listener-Funktionen aus dem Kontext
    const { addLogoutListener, removeLogoutListener } = useUserContext();

    // Dieser Effekt fügt die Callback-Funktion im effect-Paramter als Listener hinzu.
    // Wird das Modul/der Kontext, der den useLogoutEffect benutzt, nicht mehr benutzt, wird die Callback wieder als Listener entfernt.
    // Auch wenn die Callback-Funktion geändert wird, wird davor die alte Variante als Listner entfernt.
    useEffect(
        () => {
            // Regestrireen der Callback-Funktion als Logout-Effekt beim User-Kontext
            addLogoutListener(effect);

            // Deregestriern der Callback-Funktion beim User-Kontext
            return () => removeLogoutListener(effect);
        },
        [
            // Falls sich die Callback-Funktion ändert, soll die alte Variante deregestriert werden
            effect,
            // Ändert sich etwas im User-Kontext, wodurch sich addLogoutListener/removeLogoutListener ändert, soll die Callback als der alten Struktur entfernt werden und in der neuen Strucktur initialisert werden.
            addLogoutListener,
            removeLogoutListener
        ]
    );
}

export {
    UserContext as default,
    UserContextProvider,
    useUserContext,
    useAccessToken,
    useIdToken,
    useUser,
    useLogoutEffect,
}