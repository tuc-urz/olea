import { useState, useContext, createContext, useMemo } from 'react';

import { useTheme } from "react-native-paper";

import AsistServerClient from './AsistServerClient'

/**
 * Context for event api
 */
export const EventAPIContext = createContext(null);

/**
 * Hook to get and set personal code.
 * Please use hook like: const [personalCode, setPersonalCode] = usePersonalCode();
 * currently not in use.
 * @returns {Array} First element is the value of the personal code and the second element a update function for the personal code.
 */
export function usePersonalCode() {
    const eventAPIContext = useContext(EventAPIContext);
    return [eventAPIContext.personalCode, eventAPIContext.setPersonalCode];
}

/**
 * Hook to get event api client from context.
 * @returns {Object}
 */
export function useEventApiClient() {
    return useContext(EventAPIContext).apiClient;
}

/**
 * Extendet context provider for EventAPIContext.
 * Use settings in Settings.js to generate context values and event api client.
 * currently only supports event api client for asist server rest api.
 * But can be extendet to support more event services.
 * @param {props} properties of provider
 * @returns {EventAPIProvider}
 */
export default function EventAPIProvider({ children }) {
    const { appSettings } = useTheme();
    const eventAPIProvider = appSettings?.modules?.event?.api?.provider;
    const eventAPIBaseUrl = appSettings?.modules?.event?.api?.baseUrl;
    const university = appSettings?.api?.university ?? null;

    const [eventCode, setEventCode] = useState();

    const eventAPIClient = useMemo(

        () => {
            switch (eventAPIProvider?.toLowerCase()) {
                case 'asist-server':
                    return new AsistServerClient(eventAPIBaseUrl, university);
                    break;
                default:
                    return null;
            }
        },
        [eventAPIProvider, eventAPIBaseUrl, university]
    )

    const contextValue = useMemo(
        () => ({
            personalCode: eventCode,
            setPersonalCode: setEventCode,
            apiClient: eventAPIClient,
        }),
        [eventCode, eventAPIClient]
    );

    return (
        <EventAPIContext.Provider value={contextValue}>
            {children}
        </EventAPIContext.Provider>
    )
}
