import HttpApiProvider, { JsonContentType } from '@openasist/base-api-provider';

/**
 * Provider that provides a REST interface to the ASiST server.
 * The getByCode method can be used to retrieve the lectures for a personal timetable code.
 * @extends HttpApiProvider
 */
export default class AsistServerApiProvider extends HttpApiProvider {

    /**
     * Short code of the university to be queried by the ASiST server.
     * @type {String}
     * @private
     */
    #university

    /**
     * @param {string} baseUrl - URL of the ASiST server that is extended for API requests.
     * @param {string} university - Short code of the university to be queried by the ASiST server.
     * @param {string[]} acceptingLanguages - List of languages that are queried by the ASiST server. The priority is based on the order of the languages in the array.
     */
    constructor(baseUrl, university, acceptingLanguages) {
        // ContentTypes wird auf JSON festgesetzt, da der ASiST-Server nur JSON spricht.
        super(baseUrl, acceptingLanguages, ['application/json']);

        this.#university = university;
    }

    /**
     * Returns the request URL to get all courses of a personal timetable code from the collektor.
     * @param {String} personalTimetableCode - Personal timetable code to get.
     * @returns {URL} URL that can be used to query the personal timetable.
     */
    getByCodeUrl(personalTimetableCode, startTime, endTime) {
        const timetableUrl = this.extendBaseUrl([this.#university, 'timetable', 'shortcode', personalTimetableCode]);
        timetableUrl.searchParams.append('start', startTime);
        timetableUrl.searchParams.append('end', endTime);
        return timetableUrl;
    }

    /**
     * Requests the timetable and its courses from the ASiST server using the personal code.
     * @param {string} personalTimetableCode - Personal timetable code.
     * @returns {Object[]} List of lectures that are part of your personal timetable.
     */
    getByCode(personalTimetableCode, startTime, endTime) {
        const getByCodeUrl = this.getByCodeUrl(personalTimetableCode, startTime, endTime);

        console.debug(`Fetch timetable with code ${personalTimetableCode} from ${getByCodeUrl} with parameters start=${startTime} and end=${endTime}`);

        return this.get(getByCodeUrl)
            .then(response => response.json());
    }

    /**
     * Static constructor that can be used to easily create a provider instance. English and German are set as request languages by default.
     * The main languages are used to set the priority.
     * If the main language is not German or English, this is also set as the request language.
     * @param {string} baseUrl - URL of the ASiST server that is extended for API requests.
     * @param {string} university - Short code of the university to be queried by the ASiST server.
     * @param {string} mainLanguage - Main language used to create the list of languages. The main language is prioritised highest.
     * @returns {AsistServerApiProvider} Provider instance
     */
    static from(baseUrl, university, mainLanguage = 'de') {
        const acceptingLanguages = AsistServerApiProvider.languagesFromMainLanguages(mainLanguage);

        return new AsistServerApiProvider(baseUrl, university, acceptingLanguages);
    }
}