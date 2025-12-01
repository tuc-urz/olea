import { useSyncExternalStore } from 'react';

import * as SecureStore from 'expo-secure-store';

import { groupBy } from 'lodash';
import { DateTime, Duration } from 'luxon';

import CollectorVersion2ApiProvider from './CollectorVersion2ApiProvider';

/**
 * @typedef TimetableProvider
 * @property {(timetableCode: string, startDate: string, startDate: string) => Course[]} getByCode Ruft zu einem Stundenplancode die entsprechenden Vorlesungen in einem bestimmten Zeitraum ab
 */

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

const TimetableCodeStoreKey = 'timetable.code';
const TimetableCoursesStoreKey = 'timetable.courses';

export class ApiProviderNotInitializedError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class TimetableCodeNotInitializedError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * Eine Serviceklasse, die Zugriff auf die Daten des Stundenplan-Moduls ermöglicht.
 *
 * Der Stundenplan-Service ist Klasse für die Datenverwaltung der für das Stundenplan-Modul benötigten Daten.
 * Dieser ist außerhalb des React-Kontextes angesiedelt, damit auf die Daten zugegriffen werden kann, wenn kein React-Kontext verfügbar ist.
 * Alle Daten werden in lokalen Speichern zwischengespeichert, um beim ersten Zugriff veraltet Daten anzeigen zu können.
 *
 * Der Service sollte über {@linkcode TimetableService.fromProviderSettingsObject} initialisert werden.
 */
export default class TimetableService {

    /**
     * @type {TimetableProvider}
     */
    #provider;

    /**
     * Konstruktor des Stundenplan-Services.
     * Es muss ein Provider Übergeben werden, damit der Stundenplan-Service Daten über den Provider abrufen kann.
     * Es wird empfohlen {@linkcode TimetableService.fromProviderSettingsObject} zu verwenden.
     *
     * @param {TimetableProvider} provider Provider, welcher für den Datenabruf zuständig ist
     * @example
     * const language = 'de';
     * const providerSettings {
     *     name: 'normal-provider',
     *     url: 'https://provider.com/api/v1/'
     * };
     *
     * const timetableService = TimetableService.fromProviderSettingsObject(providerSettings, language);
     */
    constructor(provider) {
        this.#provider = provider;

        this.#code = SecureStore.getItem(TimetableCodeStoreKey);
        this.#courses = JSON.parse(SecureStore.getItem(TimetableCoursesStoreKey));
    }



    #code = undefined;
    #codeSubscribers = new Set();

    code() {
        return this.#code;
    }
    codeCallback = () => this.code();

    #setCode(code) {
        this.#code = code;
        this.#codeSubscribers.forEach(subscriber => subscriber(code));
    }
    async setCode(code) {
        await SecureStore.setItemAsync(TimetableCodeStoreKey, code);
        this.#setCode(code);
    }
    setCodeCallback = async (code) => this.setCode(code);

    async deleteCode() {

        await Promise.all([
            SecureStore.deleteItemAsync(TimetableCodeStoreKey),
            SecureStore.deleteItemAsync(TimetableCoursesStoreKey),
        ]);

        this.#setCode(null);
        this.#setCourses(null);
    }
    deleteCodeCallback = () => this.deleteCode();

    codeSubscribe(subscriber) {
        this.#codeSubscribers.add(subscriber);

        return () => this.codeUnsubscribe(subscriber);
    }
    codeSubscribeCallback = (subscriber) => this.codeSubscribe(subscriber);

    codeUnsubscribe(subscriber) {
        return this.#codeSubscribers.delete(subscriber);
    }



    /**
     * @type {Object.<string, Course[]>}
     */
    #courses = undefined;
    #coursesSubscribers = new Set();

    /**
     * Liefert die Vorlesungen, die von dem Service respeichert werden zurück.
     * Dabei werden die Vorlesungen nach Vorlesungstagen gruppiert.
     * Somit wird ein Object zurückgegeben, bei dem die Schlüssel ISO-Datums der Vorlesungstage sind und die Werte sind Listen mit Vorlesungen
     *
     * @returns {Object.<string, Course[]>} Vorlesungen gruppiert nach Vorlesungstagen
     */
    courses() {
        return this.#courses;
    }

    #setCourses(courses) {
        // Neue Vorlesungsdaten im Service hinterlegen
        this.#courses = courses;

        // Jedem Subscriber werden die neuen Vorlesungstage bekannt gemacht
        this.#coursesSubscribers.forEach(subscriber => subscriber(this.#courses));
    }

    coursesCallback = () => this.courses();

    async refreshCourses(startDate, endDate) {

        if (this.#provider === null) {
            throw new ApiProviderNotInitializedError('Api Provider is not initilized');
        }

        if (this.#code === null) {
            throw new TimetableCodeNotInitializedError('Timetable code is not initilized');
        }

        const courses = await this.#provider.getByCode(this.#code, startDate, endDate);
        const transformedCourses = courses.map(
            course => {
                // Erstes Time-Element aus dem times-Array nehmen, da im neuen Format nur noch eine Zeit enthalten ist
                const courseTime = course?.times?.[0];
                if (courseTime) {
                    const courseDate = DateTime.fromISO(courseTime?.date);
                    // Startzeit und Endzeit der Vorlesung in ein DateTime umwandeln
                    const courseStartTime = Duration.fromISOTime(courseTime.start);
                    const courseStartDateTime = courseDate.plus(courseStartTime);
                    const courseEndTime = Duration.fromISOTime(courseTime.end);
                    const courseEndDateTime = courseDate.plus(courseEndTime);

                    return {
                        ...course,
                        startDateTime: courseStartDateTime.toISO(),
                        endDateTime: courseEndDateTime.toISO(),
                    }
                } else {
                    return course;
                }
            }
        )

        // Gruppieren der vom Provider abgeholten Vorlesungen
        // Es wird nach dem Datum der Vorlesungen gruppiert
        // Vorlesungen, die keinem Tag zugeordnet werden können, werden untder dem Schlüssel `undefined` zusammengefasst
        const addingCourses = groupBy(
            transformedCourses,
            course => {
                // Datum der Vorlesung aus der Vorlesung holen
                const courseDate = course?.times?.[0]?.date;

                // Prüfen ob die Vorlesung einen Wert als Datum vorweist
                return courseDate
                    // Ist ein Wert vorhanden, wird dieser für die Gruppierung verwendet
                    ? courseDate
                    // Ansonsten wird undefined zurückgeben (lerrer String, null, undefined, ...)
                    : undefined;
            }
        );

        //Entfernen der Vorlesungstage zwischen Startdatum und Enddatum
        const rangeRemovedCourses = Object.fromEntries(
            Object.entries(this.#courses ?? {})
                .filter(([coursesDate,]) => startDate >= coursesDate && coursesDate <= endDate)
        );

        // Zusammenführen der neuen Vorlesungstagen der Vorlesungen des Providers und der schon vorhandenen Vorlesungstagen
        const newCourses = {
            ...rangeRemovedCourses,
            ...addingCourses,
        };

        // Neue Vorlesungsdaten in den Cache ablegen
        SecureStore.setItem(TimetableCoursesStoreKey, JSON.stringify(newCourses));

        // Neue Vorlesungen hin Service hinterlegen und Äanderun bekannt geben
        this.#setCourses(newCourses);
    }
    refreshCoursesCallback = (startDate, endDate) => this.refreshCourses(startDate, endDate);

    coursesSubscribe(subscriber) {
        this.#coursesSubscribers.add(subscriber);

        return () => this.coursesUnsubscribe(subscriber);
    }
    coursesSubscribeCallback = (subscriber) => this.coursesSubscribe(subscriber);

    coursesUnsubscribe(subscriber) {
        return this.#coursesSubscribers.delete(subscriber);
    }



    /**
     * Erstellen eines Stundenplanservices mit Hilfe der Provider-Einstellungen und Sprache
     *
     * @param {ProviderSetting} providerSettingsObject
     * @param {string} language
     * @returns
     */
    static fromProviderSettingsObject(providerSettingsObject, language) {
        const provider = TimetableService.#createProvider(providerSettingsObject, language);

        return new TimetableService(provider);
    }

    /**
     * Erstellen des Providers mit Hilfe eines Provider-Einstellungen-Objektes und einer Sprache
     *
     * @param {ProviderSetting} providerSettingsObject Einstellungen welche zum auswählen und Initialisieren des Provider verwendet werden
     * @param {string} language Sprachcode welcher für den Datenabruf verwendet werden soll
     */
    static #createProvider(providerSettingsObject, language) {
        const { provider } = providerSettingsObject;

        switch (provider) {
            case CollectorVersion2ApiProvider.name:
                return CollectorVersion2ApiProvider.fromSettingsObject(providerSettingsObject, language);
            default:
                return null;
        }
    }
}

/**
 * Ein React-Hook, um den Stundenplancode des Stundenplan-Services in den React-Kontext einzubinden.
 *
 * @param {TimetableService} timetableService Der Stundenplan-Service welche den Stundenplancode bereitstellen soll
 * @returns {[string|null, (code: string) => Promise<void>, () => void]}
 * @example
 * const timetableService = TimetableService.fromProviderSettingsObject(
 *     {
 *         provider: 'hs-collector-v2',
 *         url: 'https://hsc-production.hrz.tu-chemnitz.de/hs_collector/api/v1/',
 *     },
 *     'de',
 * );
 *
 * const [timetableCode, saveTimetableCode, deleteTimetableCode] = useSyncTimetableCode(timetableService);
 *
 * saveTimetableCode('testcode');
 *
 * return (
 *     <Text>
 *         {timetableCode}
 *     </Text>
 * );
 */
export function useSyncTimetableCode(timetableService) {
    const timetableCode = useSyncExternalStore(
        timetableService.codeSubscribeCallback,
        timetableService.codeCallback,
    );

    return [timetableCode, timetableService.setCodeCallback, timetableService.deleteCodeCallback];
}

/**
 * React-Hook, welcher die Vorlesungen nach Vorlesungtagen gruppoert für React zur verfügung stellt.
 * Zusätzlich wird eine Funktion zurückgegeben, welche für die Aktualisierung der Daten in einem bestimmten Zeitraum verwendet werden kann.
 *
 * @param {TimetableService} timetableService
 * @returns {[Object.<string, Course[]>, (startDate: string, endDate: string)=> Promise<void>]}
 * @example
 * const timetableService = TimetableService.fromProviderSettingsObject(
 *     {
 *         provider: 'hs-collector-v2',
 *         url: 'https://hsc-production.hrz.tu-chemnitz.de/hs_collector/api/v1/',
 *     },
 *     'de',
 * );
 *
 * const [courses, refreshCourses] = useSyncCourses(timetableService);
 *
 * useEffect(
 *     () => {
 *         refreshCourses('2025-01-01', '2026-01-01');
 *     },
 *     []
 * );
 *
 * return (
 * );
 */
export function useSyncCourses(timetableService) {
    const courses = useSyncExternalStore(
        timetableService.coursesSubscribeCallback,
        timetableService.coursesCallback,
    );

    return [courses, timetableService.refreshCoursesCallback];
}
