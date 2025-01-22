import { useSelector } from 'react-redux';

/**
 * Selector für Wert, der anzeigt ob die Staging-Server genutzt werden sollen.
 * @param {Object} reduxState
 * @returns {boolean} true, wenn die Staging-Server verwendet werden sollen, ansonsten false
 */
function selectUseStagingServer(reduxState) {
    return reduxState?.settingReducer?.settingsDevelop?.useStaging ?? false;
}

/**
 * Hook, welcher anzeigt ob die Staging-Server genutzt werden sollen.
 *
 * @returns {boolean} true, wenn die Staging-Server verwendet werden sollen, ansonsten false
 * @example
 * const isStagingServerActive = useStagingServer();
 *
 * console.log('isStagingServerActive' ? 'Staging server active' : 'Productiv server active');
 */
export function useStagingServer() {
    return useSelector(selectUseStagingServer);
}