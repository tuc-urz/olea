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

import { useState, useReducer, useEffect, useCallback } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Erstellt einen State, der über async-storage persistiert wird und eine Update- bzw. Reset-Funktion.
 * Dieser Hook kann wie der useState-Hook von React benutzt werden.
 * Der Inhalt wird nicht verschlüsselt abgelegt.
 * Falls eine Verschlüsselung gewünscht wird, ist {@link useSecureStoredState} zu nutzen.
 * @param {string} key Schlüssel, unter welcher der Wert des States persistiert wird.
 * @param {any | (() => any)} initialState Initialer Wert des States
 * @return {[]} Array, welches den Wert des States, eine Update-Funktion und eine Reset-Funktion beinhaltet
 */
export function asyncStoredState(key, initialState) {
    const [value, setValue] = useState(initialState);

    const clearValue = useCallback(
        () => {
            AsyncStorage.removeItem(key)
                .then(() => setValue(initialState))

        },
        [setValue, AsyncStorage.removeItem]
    )

    useEffect(
        () => {
            AsyncStorage.getItem(key)
                .then(JSON.parse)
                .then(setValue);
        },
        []
    )

    useEffect(
        () => {
            AsyncStorage.setItem(key, JSON.stringify(value));
        },
        [value]
    )

    return [value, setValue, clearValue];
}

/**
 * Dieser Hook stellt einen State zur Verfügung, welcher automatisch in dem lokalen Speicher persistiert wird.
 * Der State kann als sinsitiv makiert werden, wodurch der enthaltende Wert nicht in Logausgeben geschrieben wird.
 * Standartmäßig sind die SecureStoredStates nicht sensitiv markiert.
 *
 * @param {string} key Schlüssel unter welchem der Wert des State geladen und gespeichert wird.
 * @param {*} initialState Initialer Wert des States.
 * @param {boolean} [sensitiv=true] Ist der gespeicherte Wert nicht in den Logs auszugeben?
 * @returns {[state, (newState) => void], () => void}
 */
export function useSecureStoredState(key, initialState = null, sensitiv = false) {
    const hookName = arguments.callee.name;

    const [state, setState] = useState(
        () => {
            const stringValue = SecureStore.getItem(key);
            if (stringValue) {
                return JSON.parse(stringValue);
            } else {
                return undefined;
            }
        }
    );

    const setSecureStoredState = useCallback(
        value => {
            SecureStore
                .setItemAsync(key, JSON.stringify(value))
                .then(() => setState(value))
                .catch(reason => console.error(hookName, ': can`t store secure state: ', reason, 'key:', key, 'value:', sensitiv ? '***sensitiv value***' : value));
        },
        [key, setState, SecureStore]
    )

    function deleteSecureStoredState() {
        SecureStore
            .deleteItemAsync(key)
            .then(() => setState(undefined))
            .then(() => console.debug(hookName, ':', 'remove secure state', key))
            .catch((reason) => console.debug(hookName, ':', 'can`t remove secure state', key, ':', reason));
    }

    return [
        state !== undefined
            ? state
            : initialState,
        setSecureStoredState,
        deleteSecureStoredState,
    ];
}

/**
 * Dieser Hook stellt einen State zur Verfügung, welcher automatisch in dem lokalen Speicher persistiert wird.
 * Der State kann als sinsitiv makiert werden, wodurch der enthaltende Wert nicht in Logausgeben geschrieben wird.
 * Standartmäßig sind die SecureStoredStates nicht sensitiv markiert.
 *
 * @param {string} key Schlüssel unter welchem der Wert des State geladen und gespeichert wird.
 * @param {(prevState: any) => any} reducer The reducer function that specifies how the state gets updated. It must be pure, should take the state and action as arguments, and should return the next state. State and action can be of any types.
 * @param {*} initialState Initialer Wert des States.
 * @param {boolean} [sensitiv=true] Ist der gespeicherte Wert nicht in den Logs auszugeben?
 * @returns {[state, (newState) => void]}
 */
export function useSecureStoredReducer(key, reducer, initialState = null, sensitiv = false) {
    const hookName = arguments.callee.name;

    const [state, dispatch] = useReducer(
        reducer,
        undefined,
        () => {
            const stringValue = SecureStore.getItem(key);
            if (stringValue) {
                return JSON.parse(stringValue);
            } else {
                return undefined;
            }
        },
    );

    useEffect(
        () => {
            if (state !== undefined) {
                SecureStore
                    .setItemAsync(key, JSON.stringify(state))
                    .catch(reason => console.error(hookName, ': can`t store secure state: ', reason, 'key:', key, 'value:', sensitiv ? '***sensitiv value***' : state));
            }
        },
        [state]
    )

    return [
        state !== undefined
            ? state
            : initialState,
        dispatch,
    ];
}