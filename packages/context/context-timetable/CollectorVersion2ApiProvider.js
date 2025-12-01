import HttpApiProvider from '@olea-bps/base-api-provider';
import { TimetableNotFoundError } from './ProviderErrors';

/**
 * API-Client for Kollektor
 */
export default class CollectorVersion2ApiProvider extends HttpApiProvider {

    /**
     * Name des Providers
     * @type {string}
     */
    static name = 'hs-collector-v2';

    /**
     * @param {string} baseUrl - URL which is used as the basis for the query URLs.
     * @param {string[]} acceptingLanguages - List of languages that are queried by the ASiST server. The priority is based on the order of the languages in the array.
     */
    constructor(baseUrl, acceptingLanguages) {
        // ContentTypes wird auf JSON festgesetzt, da der ASiST-Server nur JSON spricht.
        super(baseUrl, acceptingLanguages, ['application/json']);
    }

    /**
     * Returns the request URL to get all courses of a personal timetable code from the collektor.
     *
     * If the start date and end date are passed, query filter parameters are added to the URL.
     * These parameters restrict the events that are sent.
     * Only events that take place between the start date and end date are sent back.
     *
     * @param {string} personalTimetableCode Personal timetable code to get.
     * @param {string} [startDate] Start date in ISO 8601 format.
     * @param {string} [endDate] End date in ISO 8601 format.
     * @returns {URL} URL to get courses of timetable code with optional query parameter.
     */
    getByCodeUrl(personalTimetableCode, startDate, endDate) {
        const getByCodeUrl = this.extendBaseUrl(['courses', 'shortcode', personalTimetableCode]);

        if (startDate) {
            getByCodeUrl.searchParams.set('start', startDate)
        }

        if (endDate) {
            getByCodeUrl.searchParams.set('end', endDate)
        }

        return getByCodeUrl
    }

    /**
     * Returns a list of all courses from the queried personal timetable code.
     *
     * The list can be restricted by the startDate and endDate, which means that only lectures that take place between the start date and end date are requested.
     *
     * If the collector could not find a timetable for the timetable code, a {@link TimetableNotFoundError} exception is triggered.
     *
     * @param {String} personalTimetableCode Personal code of the timetable.
     * @param {string} [startDate] Start date in ISO 8601 format.
     * @param {string} [endDate] End date in ISO 8601 format.
     * @returns {Array} Array of all courses of the timetable.
     */
    getByCode(personalTimetableCode, startDate, endDate) {
        const getByCodeUrl = this.getByCodeUrl(personalTimetableCode, startDate, endDate);

        return this.get(getByCodeUrl)
            .then(
                response => {
                    if (response.status === 404) {
                        throw new TimetableNotFoundError(personalTimetableCode);
                    } else {
                        return response.json();
                    }
                }
            );
    }

    /**
     * Creates a CollektorVersion2ApiProvider instance initialised to a list of standard languages, where the mainLanguage parameter specifies the mainLanguage.
     * @param {string} baseUrl - URL which is used as the basis for the query URLs.
     * @param {string} mainLanguage - Main language which is prioritised.
     * @returns {CollectorVersion2ApiProvider} Created CollectorVersion2ApiProvider instance.
     */
    static from(baseUrl, mainLanguage = 'de') {
        const acceptingLanguages = CollectorVersion2ApiProvider.languagesFromMainLanguages(mainLanguage);

        return new CollectorVersion2ApiProvider(baseUrl, acceptingLanguages);
    }

    /**
     * Erstellt eine CollektorVersion2ApiProvider-Instanz, welche Englisch und Deutsch initialisiert wird.
     * Die priorisierte Hauptsprache kann als Paramter übergeben werden.
     *
     * @param {object} settingsObject Objekt mit Providereinstellungen
     * @param {string} [mainLanguage='de'] Hauptsprache, welche priorisiert wird.
     * @returns {CollectorVersion2ApiProvider} Erstellte CollektorVersion2ApiProvider-Instanz
     */
    static fromSettingsObject(settingsObject, mainLanguage = 'de') {
        const { url } = settingsObject;

        return CollectorVersion2ApiProvider.from(url, mainLanguage);
    }
}
