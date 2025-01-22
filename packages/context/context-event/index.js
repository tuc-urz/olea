import { useContext, createContext, useMemo, useCallback, useEffect } from 'react';

import { useTheme } from 'react-native-paper';

import { useSecureStoredState } from '@openasist/stored-state';

import AsistServerClient from './AsistServerClient';

const EventCodeStoreKey = 'event.eventCode';
const EventsStoreKey = 'event.events';
const PersonalEventsStoreKey = 'event.personelEvents';

/**
 * Context for event api
 */
export const EventContext = createContext(null);

/**
 * Extendet context provider for EventAPIContext.
 * Use settings in Settings.js to generate context values and event api client.
 * currently only supports event api client for asist server rest api.
 * But can be extendet to support more event services.
 * @param {props} properties of provider
 */
export default function EventContextProvider({ children }) {
    const { appSettings } = useTheme();
    const eventAPIProvider = appSettings?.modules?.event?.api?.provider;
    const eventAPIBaseUrl = appSettings?.modules?.event?.api?.baseUrl;
    const university = appSettings?.api?.university ?? null;

    const [events, setEvents] = useSecureStoredState(EventsStoreKey);
    const [personalEventsCode, setPersonalEventsCode, deletePersonalEventsCode] = useSecureStoredState(EventCodeStoreKey, null, true);
    const [personalEvents, setPersonalEvents, deletePersonalEvents] = useSecureStoredState(PersonalEventsStoreKey,)

    const sortedEvents = useMemo(
        () => {
            if (Array.isArray(events)) {
                const sortingEvents = [...events];
                sortingEvents
                    // Berechnen der Sortierung
                    // Zuerst wird nach Startzeit sortier, ist diese gleich wird nach dem Enddatum sortiert
                    .sort(
                        (first, second) => {
                            const sortOrder = moment(first.begin) - moment(second.begin);

                            return sortOrder === 0
                                ? moment(first.end) - moment(second.end)
                                : sortOrder
                        }
                    );

                return sortingEvents;
            } else {
                return null;
            }
        },
        [events]
    )

    const eventAPIClient = useMemo(

        () => {
            switch (eventAPIProvider?.toLowerCase()) {
                case 'asist-server':
                    return new AsistServerClient(eventAPIBaseUrl, university);
                default:
                    return null;
            }
        },
        [eventAPIProvider, eventAPIBaseUrl, university]
    )

    const refreshEvents = useCallback(
        () => eventAPIClient.getAll()
            .then(setEvents),
        [eventAPIClient]
    )

    const refreshPersonalEvents = useCallback(
        () => eventAPIClient.getByPersonalCode(personalEventsCode)
            .then(setPersonalEvents),
        [eventAPIClient, personalEventsCode]
    )

    function deletePersonalEventsCodeAndPersonalEvents() {
        deletePersonalEventsCode();
        deletePersonalEvents();
    }

    useEffect(
        () => {
            refreshEvents();
        },
        [refreshEvents]
    )

    useEffect(
        () => {
            if (personalEventsCode) {
                refreshPersonalEvents();
            }
        },
        [eventAPIClient, personalEventsCode, refreshPersonalEvents]
    )

    return (
        <EventContext.Provider
            value={
                {
                    events: sortedEvents,
                    refreshEvents: refreshEvents,

                    personalEvents: personalEvents,
                    refreshPersonalEvents: refreshPersonalEvents,

                    personalEventsCode: personalEventsCode,
                    setPersonalEventsCode: setPersonalEventsCode,
                    deletePersonalEventsCode: deletePersonalEventsCodeAndPersonalEvents,

                    apiClient: eventAPIClient,
                }
            }
        >
            {children}
        </EventContext.Provider>
    )
}

/**
 * Dieser Hook stellt den EventContext bereit.
 *
 * Dieser Hook sollte grundsätlich nur von anderen Hooks verwendet werden.
 * @returns {object} Eventkontext
 */
export function useEventContext() {
    return useContext(EventContext);
}

/**
 * Über diesen Hook gelangt man an die persönlichen Veranstaltungen.
 * Dafür wird der persönliche Veranstaltungscode (siehe {@link usePersonalEventsCode }) verwendet.
 *
 * @returns {[Array, () => Promise]} Liste der persönlichen Veranstalltungen entsprechnd des persönlichen Codes
 * @example
 * const [personalEvents, refreshPersonalEvents] = usePersonalEvents();
 */
export function usePersonalEvents() {
    const eventContext = useEventContext();

    return [eventContext.personalEvents, eventContext.refreshPersonalEvents];
}

/**
 *
 * @returns {[Array, () => void]}
 * @example
 * const [events, refreshEvents] = useEvents();
 *
 * useEffect(
 *     () => {
 *         refreshEvents();
 *     },
 *     []
 * );
 *
 * return (
 *     events.map(
 *         event => JSON.stringify(event);
 *     )
 * )
 */
export function useEvents() {
    const eventContext = useEventContext();
    return [eventContext.events, eventContext.refreshEvents];
}

/**
 * Hook to get and set personal code.
 * Please use hook like: const [personalCode, setPersonalCode] = usePersonalCode();
 * currently not in use.
 * @returns {[string, () => void, () => void]} First element is the value of the personal code and the second element a update function for the personal code.
 */
export function usePersonalEventsCode() {
    const eventContext = useEventContext();
    return [eventContext.personalEventsCode, eventContext.setPersonalEventsCode, eventContext.deletePersonalEventsCode];
}

/**
 * Hook to get event api client from context.
 * @returns {Object}
 */
export function useEventApiClient() {
    return useEventContext().apiClient;
}