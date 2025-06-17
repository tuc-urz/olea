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

/**
 * Redux-Selector für die in den Einstellungen eingestellte Sprache.
 * @param {Object} reduxState Der State im Redux
 * @returns {string|undefined} Spracheinstellung
 */
export function selectLanguage(reduxState) {
    return reduxState?.settingReducer?.settingsGeneral?.language;
}

/**
 * Hook, welcher die vom Nutzer eingestellte Sprache zurückliefert.
 * Die Sprache wird als Zweizeichencode, also `de` für Deutsch und `en` für Englisch, zurückgeliefert.
 * Konnte die Spracheinstellung nicht abgerufen werden oder ist diese nicht gesetzt, wird `undefined` zurückgeben.
 *
 * @returns {string|undefined} Die Sprache als Zweizeichencode. `undefined`, falls keine Sprache eingestellt ist.
 * @example
 * const language = useLanguage();
 *
 * console.log('Selected language', language);
 */
export function useLanguage() {
    return useSelector(selectLanguage);
}

export function selectIncreaseFontSize(reduxState) {
    return reduxState?.settingReducer?.settingsAccessibility?.increaseFontSize ?? false;
}


export function useIncreaseFontSize() {
    return useSelector(selectIncreaseFontSize);
}

/**
 * Redux-Selector für die Subscriber ID
 * @param {Object} reduxState Der State im Redux
 * @returns {string|undefined}
 */
export function selectSubscriberId(reduxState) {
    return reduxState?.notificationsReducer?.subscriberId;
}

/**
 * Hook, welcher die Subscriber ID vom zurückliefert.
 * Konnte die Subscriber ID nicht abgerufen werden oder ist diese nicht gesetzt, wird `undefined` zurückgeben.
 *
 * @returns {string|undefined} Die Subscriber ID oder `undefined`, falls nicht vorhanden.
 * @example
 * const subscriberId = useSubscriberId();
 *
 * console.log('Subscriber ID:', subscriberId);
 */
export function useSubscriberId() {
    return useSelector(selectSubscriberId);
}

/**
 * Redux-Selector für die Einstellung ob Deeplink-Alarme angezeigt werden sollen.
 * @param {Object} reduxState Der State im Redux
 * @returns {boolean}
 */
export function selectshowDeeplinkAlert(reduxState) {
    return reduxState?.settingReducer?.settingsDevelop?.showDeeplinkAlert ?? false;
}

/**
 * Hook, welcher die Einstellung, ob Deeplink-Alarme angezeigt werden sollen, zurückliefert.
 *
 * @returns {boolean} Sollen Deeplink-Alarme angezeigt werden?
 * @example
 * const showDeeplinkAlert = useShowDeeplinkAlert();
 *
 * console.log('Show deeplink alarms:', showDeeplinkAlert);
 */
export function useShowDeeplinkAlert() {
    return useSelector(selectshowDeeplinkAlert);
}

/**
 * Redux-Selector für die IDs der aktiv geschalteten Menüeinträge, die sonst deaktivert sind.
 * @param {Object} reduxState Der State im Redux
 * @returns {string[]}
 */
export function selectActiveStagingMenuItems(reduxState) {
    return reduxState?.settingReducer?.settingsDevelop?.activeStagingMenuItems ?? [];
}

/**
 * Hook, welcher die IDs der aktiv geschalteten Menüeinträge, die sonst deaktivert sind, zurückliefert.
 *
 * @returns {string[]} Sollen Deeplink-Alarme angezeigt werden?
 * @example
 * const activeStagingMenuItems = useActiveStagingMenuItems();
 *
 * console.log('Keys of active menu entries:', activeStagingMenuItems);
 */
export function useActiveStagingMenuItems() {
    return useSelector(selectActiveStagingMenuItems);
}
