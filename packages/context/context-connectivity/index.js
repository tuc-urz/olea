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

import React, { createContext, useState, useEffect, useContext } from "react";
import NetInfo from "@react-native-community/netinfo";

export const ConnectivityContext = createContext();

export function ConnectivityContextProvider({ children }) {
  let [networkState, setNetworkState] = useState({
    isConnected: true,
    isInternetReachable: true,
  });

  useEffect(() => {
    const fetchInitialState = async () => {
      const state = await NetInfo.fetch();
      setNetworkState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
      });
    };

    fetchInitialState();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <ConnectivityContext.Provider value={networkState}>
      {children}
    </ConnectivityContext.Provider>
  );
}

/**
 * Hook, der den Connectivity-Kontext verwendet.
 * @returns {ConnectivityContext} Der Connectivity-Kontext.
 * @returns {boolean} Der Connectivity-Kontext.isConnected.
 * @returns {boolean} Der Connectivity-Kontext.isInternetReachable.
 * @example
 * import { useConnectivityContext } from '@openasist/context-connectivity';
 *
 * function MyComponent() {
 *    const { isConnected, isInternetReachable } = useConnectivityContext();
 * }
 */
export function useConnectivityContext() {
  return useContext(ConnectivityContext);
}

/**
 * Hook, der die Netzwerkstatuswerte in einem Array bereitstellt.
 * @returns {Array} Ein Array mit den Netzwerkstatuswerten.
 * @returns {boolean} return[0] - Gibt an, ob das Gerät mit dem Netzwerk verbunden ist.
 * @returns {boolean} return[1] - Gibt an, ob das Internet erreichbar ist.
 * @example
 * import { useNetInfo } from '@openasist/context-connectivity';
 *
 * function MyComponent() {
 *    const [isConnected, isInternetReachable] = useNetInfo();
 * }
 */
export function useNetInfo() {
  const { isConnected, isInternetReachable } = useContext(ConnectivityContext);
  return [isConnected, isInternetReachable];
}
