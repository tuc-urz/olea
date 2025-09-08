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

import { createContext, useState, useReducer, useEffect, useContext, useMemo, useCallback, startTransition } from 'react'

import * as SecureStore from 'expo-secure-store';

import { useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DateTime, Duration } from 'luxon';
import { isEqual } from 'lodash'

import CollektorVersion2ApiProvider from './CollektorVersion2ApiProvider';
import { TimetableNotFoundError } from './ProviderErrors';

/**
 * @typedef CourseDataField
 * @property {string} data
 * @property {string} displayname
 */

/**
 * @typedef CourseDataField
 * @property {string} data
 * @property {string} displayname
 */

/**
 * @typedef CourseTime
 * @property {number} dayOfWeek
 * @property {string} date ISO Datum
 * @property {string} start ISO Uhrzeit
 * @property {string} end ISO Uhrzeit
 * @property {string} displayname
 * @property {string} weekmode
 * @property {string} mode
 */

/**
 * @typedef Course
 * @property {CourseDataField} title
 * @property {CourseDataField} room
 * @property {CourseDataField} type
 * @property {CourseDataField[]} lecturer
 * @property {CourseTime[]} times
 */

const TimetableCodeSecureStoreKey = 'timetable.code';
const TimetableCoursesStoreKey = 'timetable.courses';

const AsistServerProviderName = 'asist-server';
const CollectorVersion2ProviderName = 'hs-collector-v2';

const CourseWeekModeWeekly = 'weekly';
const CourseWeekModeOdd = 'odd';
const CourseWeekModeEven = 'even';

class ApiProviderNotInitializedError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class TimetableCodeNotInitializedError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

const CourseWeekModes = {
    weekly: CourseWeekModeWeekly,
    odd: CourseWeekModeOdd,
    even: CourseWeekModeEven,
}

const TimetableContext = createContext({
    code: null,
    courses: {},
});

const SetCoursesDate = 'set_day_courses';
const RemoveUnusedCoursesDate = 'remove_unused_courses_day';
const RestoreCourses = 'restore_courses';
const ResetCourses = 'reset_courses';

/**
 *
 * @param {Object.<string, Course[]>} state
 * @param {object} action
 * @param {SetCoursesDate|RemoveUnusedCoursesDate|RestoreCourses} action.type
 * @param {Course[]|Object.<string, Course[]>} [action.courses]
 * @returns {Object.<string, Course[]>}
 */
function CoursesStateReducer(state, action) {
    switch (action.type) {

        // Hinzufügen eines Tages/Datums mit ensprechenden Vorlesungen
        case SetCoursesDate:
            const courses = action.courses;
            const date = action.date
            // Wir transformieren die Zeiten der Kurse in ein DateTime
            const transformedCourses = courses.map(
                course => {
                    // Erstes Time-Element aus dem times-Array nehmen, da im neuen Format nur noch eine Zeit enthalten ist
                    const courseTime = course?.times?.[0];
                    if (courseTime) {
                        const courseDate = DateTime.fromISO(courseTime?.date, { zone: 'utc' });
                        // Startzeit und Endzeit der Vorlesung in ein DateTime umwandeln
                        const courseStartTime = Duration.fromISOTime(courseTime.start);
                        const courseStartDateTime = courseDate.plus(courseStartTime).toISO({ includeOffset: false });
                        const courseEndTime = Duration.fromISOTime(courseTime.end);
                        const courseEndDateTime = courseDate.plus(courseEndTime).toISO({ includeOffset: false });

                        return {
                            ...course,
                            startDateTime: new Date(courseStartDateTime),
                            endDateTime: new Date(courseEndDateTime),
                        }
                    } else {
                        return course;
                    }
                }
            )
            // Vorlesungstag mit entsprechenden Vorlesungen hinzufügen, falls Daten nicht schon vorhanden
            return (

                // Sind Daten schon vorhanden und unterschedlich?
                !isEqual(state?.[date], transformedCourses)
                    // Wenn unterschiedlich, State mit neuen Vorlesungen am Vorlesungstag erstellen
                    ? {
                        // Kopieren der vorherigen Tage und derren Vorlesungen
                        ...state,
                        // Hinzufügen bzw. überschreiben der Vorlesungen für einen Datum
                        [date]: transformedCourses,
                    }
                    // Wenn nicht unterschiedlich, alten State beibehalten
                    : state
            )

        // Entfernt in einem Bereich zwischen startDate und endDate alle Vorlesungstage ohne Vorlesungen
        // Dafür werden die Vorlesungstage, welche Vorlesung besitzen als aktive Vorlesungstage übergeben
        case RemoveUnusedCoursesDate:
            const startDate = action?.startDate;
            const endDate = action?.endDate;
            const activeDates = action?.activeDates;

            // Wenn Vorlesungen vorliegen, werden inaktive Vorlesungstage aussortiert, falls nicht wird ein lerres Objekt zurückgegeben
            return state
                // Aussortieren, indem jeder State-Objekt zerlegt, gefiltert und wieder zusammengesetzt wird.
                ? Object.fromEntries(
                    // Zerlegen des State-Objektes in einzelne Tage und ihren Vorlesungen
                    Object.entries(state)
                        // Filtern der Vorlesungstage anhand des Bereiches und der aktiven Vorlesungstagen
                        .filter(
                            ([coursesDate, courses]) =>
                                // Ist der Vorlesungstag im zu prüfenden Bereich?
                                startDate >= coursesDate && coursesDate <= endDate
                                    // Wenn ja, prüfen ob der Vorlesungstag Teil der aktiven Vorlesungstage ist
                                    ? activeDates.includes(coursesDate)
                                    // Wenn nein, Vorlesungstag ohne Prüfung in Filterergebniss übernehemen
                                    : true
                        )
                )
                // Lerres Objekt zurückgeben
                : {};

        // Vorlesungstage und zugehörige Vorlesungen aus dem Cache wiederherstellen
        // Wenn Daten schon im State-Objekt zu finden sind, werden diese behalten und die Cache-Daten verworfen
        case RestoreCourses:
            const restoredCourses = action.courses;

            // Sind Daten schon im State?
            return state
                ? { ...state }
                : restoredCourses;
        case ResetCourses:
            return null;
    }
}

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
    const componentName = arguments.callee.name;
    const theme = useTheme();
    const useStagingServers = useSelector(selectUseStagingServer);

    // Einstellungen für das Stundenplan-Modul
    const timetableSettings = theme?.appSettings?.modules?.timetable

    // Einstellungen für Vorladen der Stundenplandaten
    const timetablePrefetchSettings = timetableSettings?.prefetch;
    const beginPrefetchDistance = timetablePrefetchSettings?.beginDistance ?? defaultPrefetchDistance;
    const endPrefetchDistance = timetablePrefetchSettings?.beginDistance ?? defaultPrefetchDistance;

    // Einstellungen für Fallback API-Provider
    const fallbackApiSettings = theme?.appSettings?.api;
    const fallbackApiProvider = AsistServerProviderName;
    const fallbackApiBaseUrl = (useStagingServers ? fallbackApiSettings.rootStgUrl : fallbackApiSettings.rootUrl) + 'app/';
    const fallbbackApiUniversity = fallbackApiSettings?.university;

    // Einstellungen für API-Provider
    const timetableApiSettings = theme?.appSettings?.modules?.timetable?.api
    // Soll der Staging-Provider verwendet werden?
    const timetableApiProviderSettings = useStagingServers
        // Wenn ja, werden die Staging Provider-Einstellungen geladen
        ? timetableApiSettings?.staging
        // Wenn nein, werden die productiven Provider-Einstellungen geladen
        : timetableApiSettings?.production;
    const timetableApiProvider = timetableApiProviderSettings?.provider ?? fallbackApiProvider;
    const timetableApiBaseUrl = timetableApiProviderSettings?.url ?? fallbackApiBaseUrl;
    const timetableApiUniversity = timetableApiProviderSettings?.university ?? fallbbackApiUniversity;

    [timetableCode, setTimetableCode] = useState(null);
    [courses, dispatchCourses] = useReducer(CoursesStateReducer, null);
    [synchronizationCompleted, setSynchronizationCompleted] = useState(false);

    // Laden des persönlichen Stundenplancodes und speichern in timetableCode-State
    useEffect(
        () => {
            SecureStore.getItemAsync(TimetableCodeSecureStoreKey)
                .then(setTimetableCode);
        }, []
    );

    // Laden der Vorlesungen aus dem AsyncStorage und speichern in courses-State, wenn course-State leer.
    useEffect(
        () => {
            AsyncStorage.getItem(TimetableCoursesStoreKey)
                .then(
                    storedCourses => {
                        if (!Array.isArray) {
                            dispatchEvent({ type: RestoreCourses, courses: storedCourses });
                        } else {
                            AsyncStorage.removeItem(TimetableCoursesStoreKey);
                        }
                    }
                );
        },
        []
    );

    // Estellen des API-Providers bzw. erneuern wenn sich Einstellungen sich ändern.
    const apiProvider = useMemo(
        () => {
            switch (timetableApiProvider?.toLowerCase()) {
                case AsistServerProviderName:
                    console.debug(componentName, ': use asist server api');
                    return new AsistServerApiProvider.from(timetableApiBaseUrl, timetableApiUniversity, 'de');
                case CollectorVersion2ProviderName:
                    console.debug(componentName, ': use collector v2 api');
                    return new CollektorVersion2ApiProvider.from(timetableApiBaseUrl);
                default:
                    console.log(`${componentName}: Can't build api provider: ${timetableApiProvider}`)
                    return null;
            }
        },
        [timetableApiProvider, timetableApiBaseUrl, timetableApiUniversity]
    );

    // Speichert die geänderten Courses in den Secure-Store
    useEffect(
        () => {
            courses
                ? AsyncStorage.setItem(TimetableCoursesStoreKey, JSON.stringify(courses))
                    .catch(reason => console.error(componentName, ':', 'Error while safing courses in store', ':', reason))
                : AsyncStorage.removeItem(TimetableCoursesStoreKey)
                    .catch(reason => console.error(componentName, ':', 'Error while removing courses in store', ':', reason));
        },
        [courses]
    );

    // Speichert den neuen Stundenplan-Code im Secure-Store und dann im State
    /**
     * Macht den neuen Stundenplancode dem Stundenplan-Kontext bekannt.
     * Dabei wird der alte Stundenplan-Code überschrieben.
     * Der Stundenplancode wird zum Abrufen der Vorlesungen benutzt.
     * @param {string} savingTimetableCode - Stundenplan-Code welcher an dem Stundenplan-Kontext übergeben werden soll.
     */
    async function saveTimetableCode(savingTimetableCode) {
        await SecureStore?.setItemAsync(TimetableCodeSecureStoreKey, savingTimetableCode);
        setTimetableCode?.(savingTimetableCode);
    }

    /**
     * Diese Funktion erneuert den Vorlesung-Status im Stundenplan-Context.
     * Dabei muss ein Datumsbereich festgelegt werden, welcher über ein Startdatum und ein Enddatum festgelegt wird.
     * Es werden nur Vorlesungen in diesem Bereich aktualisert.
     *
     * Um zu Prüfen, ob der Refresh ausgeführt wurde, kann man sich an dem zurückgebenen Promise anhängen.
     * Fehler können über eine catch-Anweisung erkannt werden.
     *
     * Wir für den Stundenplan-Code kein Stundenplan gefunden, wird eine {@link TimetableNotFoundError}-Ausnahme ausgelöst.
     * Dafür muss der Provider die Erkennung ungültiger Stundenplan-Codes unterstützen.
     *
     * @function
     * @param {string} startDate Startdatum des abzurufenden Bereiches
     * @param {string} endDate Enddatum des abzurufenden Bereiches
     * @returns {Promise<void>} Promise, an die angeschlossen werden kann, um zu prüfen, ob der Refresh ausgeführt wurde.
     */
    const refreshCourses = useCallback(

        async (startDate, endDate) => {
            console.debug(componentName, ': refresh courses');

            if (apiProvider === null) {
                throw new ApiProviderNotInitializedError('Api Provider is not initilized');
            }

            if (timetableCode === null) {
                throw new TimetableCodeNotInitializedError('Timetable code is not initilized');
            }

            return apiProvider?.getByCode(timetableCode, startDate, endDate)
                .then(
                    courses => {
                        // Auslesen aller Vorlesungstage und Duplikate entfernen
                        // Es wird das erste Time-Element aus dem times-Array genommen, da im neuen Format nur noch eine Zeit enthalten ist
                        const coursesDates = new Set(courses.map(course => course?.times?.[0]?.date));

                        // Für jeden Vorlesungstag werden die Vorlesungen in den Courses-State geschrieben
                        startTransition(() => coursesDates.forEach(
                            coursesDate =>
                                dispatchCourses(
                                    {
                                        type: SetCoursesDate,
                                        date: coursesDate,
                                        // Es werden Vorlesungen, die am Vorlesungstag statfinden, zusammengesucht
                                        courses: courses.filter(course => course?.times?.[0].date === coursesDate)
                                    }
                                )
                        ));

                        // Es werden alle Vorlesungstage entfernt, die nicht in der Antwort vom Kollektor zu finden sind.
                        dispatchCourses(
                            {
                                type: RemoveUnusedCoursesDate,
                                activeDates: [...coursesDates],
                            }
                        );
                    }
                );
        },
        [apiProvider, dispatchCourses, timetableCode]
    );

    // Funktion zum Löschen des Timetable-Codes
    /**
     * Setzt den Stundenplancode und die zugehörigen Vorlesungen zurück.
     */
    async function deleteTimetableCode() {
        await SecureStore.deleteItemAsync(TimetableCodeSecureStoreKey);
        await AsyncStorage.removeItem(TimetableCoursesStoreKey);
        setTimetableCode(null);
        dispatchCourses({ action: ResetCourses });
    }

    // Aktualiseren des course-States, wenn Provider oder Stundenplan-Code sich ändern.
    useEffect(
        () => {
            // Stundenplan wird nur einmal geholt, wenn der Stundenplancode geladen ist
            if ((timetableCode ?? false) && !synchronizationCompleted) {
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
        }, [apiProvider, beginPrefetchDistance, endPrefetchDistance, timetableCode, synchronizationCompleted]
    );

    return (
        <TimetableContext.Provider
            value={{
                timetableCode: timetableCode,
                saveTimetableCode: saveTimetableCode,
                deleteTimetableCode: deleteTimetableCode,
                provider: apiProvider,
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
    ApiProviderNotInitializedError,
    TimetableCodeNotInitializedError,
    TimetableNotFoundError,
}