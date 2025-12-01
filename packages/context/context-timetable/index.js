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

import { createContext, useEffect, useContext, useMemo } from 'react'

import { useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';

import { DateTime, Duration } from 'luxon';

import { TimetableNotFoundError } from './ProviderErrors';
import TimetableService, {
    ApiProviderNotInitializedError,
    TimetableCodeNotInitializedError,
    useSyncCourses,
    useSyncTimetableCode
} from './TimetableService';

const CourseWeekModeWeekly = 'weekly';
const CourseWeekModeOdd = 'odd';
const CourseWeekModeEven = 'even';

const CourseWeekModes = {
    weekly: CourseWeekModeWeekly,
    odd: CourseWeekModeOdd,
    even: CourseWeekModeEven,
}

const TimetableContext = createContext({
    code: null,
    courses: {},
});

/**
 * Ein Monat ist die standart Zeispanne für das Vorladen der Stundenplandaten
 *
 * @constant
 * @type {string} Zeitspanne im ISO Format(https://de.wikipedia.org/wiki/ISO_8601#Zeitspannen)
 */
const defaultPrefetchDistance = 'P1M';

/**
 * Selector für Wert, der anzeigt ob die Staging-Server genutzt werden sollen.
 * @param {Object} reduxState
 * @returns {boolean} true, wenn die Staging-Server verwendet werden sollen, ansonsten false
 */
function selectUseStagingServer(reduxState) {
    return reduxState?.settingReducer?.settingsDevelop?.useStaging ?? false;
}

/**
 * Provider for timetable context
 */
function TimetableContextProvider({ children }) {
    const componentName = TimetableContextProvider.name;
    const theme = useTheme();
    const useStagingServers = useSelector(selectUseStagingServer);
    const language = 'de';

    // Einstellungen für das Stundenplan-Modul
    const timetableSettings = theme?.appSettings?.modules?.timetable

    // Einstellungen für Vorladen der Stundenplandaten
    const timetablePrefetchSettings = timetableSettings?.prefetch;
    const beginPrefetchDistance = timetablePrefetchSettings?.beginDistance ?? defaultPrefetchDistance;
    const endPrefetchDistance = timetablePrefetchSettings?.beginDistance ?? defaultPrefetchDistance;

    // Einstellungen für API-Provider
    const timetableApiSettings = theme?.appSettings?.modules?.timetable?.api
    // Soll der Staging-Provider verwendet werden?
    const timetableApiProviderSettings = useStagingServers
        // Wenn ja, werden die Staging Provider-Einstellungen geladen
        ? timetableApiSettings?.staging
        // Wenn nein, werden die productiven Provider-Einstellungen geladen
        : timetableApiSettings?.production;

    // Erstellen des Stundenplan-Services
    const timetableService = useMemo(
        () => TimetableService.fromProviderSettingsObject(
            timetableApiProviderSettings,
            language,
        ),
        [timetableApiProviderSettings, language]
    );

    // Stundenplan-Code aus dem Stundenplan-Service holen
    // Es werden noch 2 Funktionen aus dem Stundenplan-Service geladen, um den Code zu speichern und zu löschen
    const [timetableCode, saveTimetableCode, deleteTimetableCode] = useSyncTimetableCode(timetableService);

    // Vorlesungen gruppiert nach Vorlesungstagen werden aus dem Stundenplan-Service geholt
    // Es wird zusätzlich eine Funktion zum aktuallisieren der Vorlesungen mit geladen
    const [courses, refreshCourses] = useSyncCourses(timetableService);

    // Aktualiseren des course-States, wenn Provider oder Stundenplan-Code sich ändern.
    useEffect(
        () => {
            // Stundenplan wird nur einmal geholt, wenn der Stundenplancode geladen ist
            if ((timetableCode ?? false)) {
                // Berechnen des Vorladezeitraumes
                // ISO Zeitspannen(string) werden in Luxon Zeitspannen umgewandelt
                const beginPrefetchDuration = Duration.fromISO(beginPrefetchDistance);
                const endPrefetchDuration = Duration.fromISO(endPrefetchDistance);
                // Jetztige Zeit ermitteln
                const today = DateTime.now();
                // Für den Anfang des Vorladezeitraumes das Datum berechnen
                const prefetchStartDate = today.minus(beginPrefetchDuration).toISODate();
                // Für das Ende des Vorlesungszeitraumes das Datum berechnen
                const prefetchEndDate = today.plus(endPrefetchDuration).toISODate();

                console.debug(componentName, 'prefetch timetable courses from', prefetchStartDate, 'to', prefetchEndDate);

                refreshCourses(prefetchStartDate, prefetchEndDate)
                    .then(() => setSynchronizationCompleted(true))
                    .catch(
                        reason => {
                            if (!reason instanceof ApiProviderNotInitializedError || !reason instanceof TimetableCodeNotInitializedError) {
                                console.error(componentName, ': Error while update courses by timetable code: ', reason, 'base url: ', timetableApiBaseUrl);
                            }
                        }
                    );
            }
        }, [timetableService, beginPrefetchDistance, endPrefetchDistance, timetableCode]
    );

    return (
        <TimetableContext.Provider
            value={{
                timetableCode: timetableCode,
                saveTimetableCode: saveTimetableCode,
                deleteTimetableCode: deleteTimetableCode,
                courses: courses,
                refreshCourses: refreshCourses,
            }}
        >
            {children}
        </TimetableContext.Provider>
    );
}

/**
 * Liefert den derzeitigen Stundenplan-Code und eine Funktion zum Speichern eines neues Stundenplan-Codes.
 * @function
 * @returns {[string, (timetableCode: string) => Promise<void>, () => Promise<void>]} Array mit 3 Elementen. Das erste Element ist der derzeitige gespeicherte Stundenplan-Code.
 * Das zweite Element ist eine Funktion, welche das Speichern eines neuen Stundenplan-Codes ermlöglicht.
 * Das dritte Element ist eine Funktion, die das Löschen des derzeitigen Stundenplan-Codes und der Courses ermöglicht.
 * @example
 * [timetableCode, saveTimetableCode, deleteTimetableCode] = useTimetableCode();
 * saveTimetableCode(newTimetableCode);
 * deleteTimetableCode();
 */
function useTimetableCode() {
    const { timetableCode, saveTimetableCode, deleteTimetableCode } = useContext(TimetableContext);

    return [timetableCode, saveTimetableCode, deleteTimetableCode];
}

/**
 * Dieser Hook stellt die Vorlesungen aus dem Stundenplan-Kontext zur Verfügung.
 * Es werden 2 Rückgabewerte in einem Array zurückgegeben.
 * Der erste Parameter ist eine Map der Vorlesungen für den derzeitigen Stundenplan-Code im Stundenplan-Kontext.
 * Die Schlüsel sind die Vorlesungstage und die Werte sind Listen der entsprechenden Vorlesungen zu dem im Schlüssel enthaltenen Datum.
 * Der zweite Parameter ist eine parameterlose Funktion, welche die Vorlesungen im Stundenplan-Kontext aktuallisiert.
 * @returns {[Object.<string, Course[]>, (startDate: string, endDate: string) => Promise<void>]} Array, welches aus 2 Elementen besteht.
 * @example
 * const [courses, refreshCourses] = useCourses();
 *
 * refreshCourses('2025-01-01', '2025-02-01');
 *
 * const coursesOfDay = courses['2025-01-01'];
 */
function useCourses() {
    const { courses, refreshCourses } = useContext(TimetableContext);

    return [courses, refreshCourses];
}

/**
 *
 *
 * @param {string} date ISO Datum der Vorlesungen
 * @returns {[Course[], (date : string) => Promise<void>]}
 * @example
 * const [dateCourses, refreshDateCourses] = useDateCourses('2025-01-01');
 *
 * refreshDateCourses();
 */
function useDateCourses(date) {
    const [courses, refreshCourses] = useCourses();

    const dateCourses = courses?.[date] ?? [];


    return [dateCourses, refreshCourses]
}

export {
    TimetableContext as default,
    TimetableContextProvider,
    CourseWeekModes as weekModes,
    useTimetableCode,
    useCourses,
    useDateCourses,
    TimetableNotFoundError,
}
