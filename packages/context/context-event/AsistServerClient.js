/**
 * Client to get Events from ASiST server
 */
export default class AsistServerClient {
    /**
     * Base URL which is expanded to generate the request URLs.
     * @private
     */
    #baseUrl

    /**
     * University code which is communicated to the ASiST server via the request URL in order to retrieve the events of the correct university.
     * @private
     */
    #university

    /**
     * Returns the request URL to get all events from the ASiST server.
     * @returns {URL}
     */
    // If available implement as private get property
    getAllUrl() {
        return new URL(`${this.#baseUrl}/${this.#university}/events`);
    }

    /**
     * Construct a ASiST server rest api client.
     * @param {String} baseUrl URL which is used as the basis for the query URLs.
     * @param {String} university University code of the university to be queried.
     */
    constructor(baseUrl, university) {
        this.#baseUrl = baseUrl;
        this.#university = university;
    }

    /**
     * Returns a list of all events from the queried university.
     * @returns {Array} Array of all event objects
     */
    getAll() {
        const getAllEventsURL = this.getAllUrl();

        console.debug(`Get all events: ${getAllEventsURL}`)

        return fetch(
            getAllEventsURL,
            {
                'headers': AsistServerClient.generateHeaders(),
            }
        ).then(allEventResponse => allEventResponse.json())
    }

    /**
     * Return list of events for the personal code.
     * @param {String} personalCode Personal code for market events
     * @returns {Array}
     */
    getByPersonalCode(personalCode) {
        // If available implement query parameter with 'searchParams.set': personalEventsURL.searchParams.set('code', personalCode);
        const personalEventsURL = `${this.getAllUrl()}?code=${personalCode}`;

        console.debug(`Get personal events: ${personalEventsURL}`)

        return fetch(
            personalEventsURL,
            {
                'headers': AsistServerClient.generateHeaders(),
            }
        ).then(personalEventResponse => personalEventResponse.json())
    }

    /**
     * Returns standart headers für asist server requests.
     * @returns {object}
     */
    // If available implement as private
    static generateHeaders() {
        return {
            'Accept': 'application/json',
        }
    }
}
