import HttpApiProvider from '@openasist/base-api-provider';

export class NotModifiedResponse {

}

/**
 * API-Client for Kollektor
 */
export default class CollektorVersion2ApiProvider extends HttpApiProvider {
    /**
     * ETag cache.
     * The key is a string that identifies the URL, whereby the associated value stores the ETag of the URL.
     * @type {Object.<string, string>}
     */
    #menusETags = {}

    /**
     * @param {string} baseUrl - URL which is used as the basis for the query URLs.
     * @param {string[]} acceptingLanguages - List of languages that are queried by the ASiST server. The priority is based on the order of the languages in the array.
     */
    constructor(baseUrl, acceptingLanguages) {
        // ContentTypes wird auf JSON festgesetzt, da der ASiST-Server nur JSON spricht.
        super(baseUrl, acceptingLanguages, ['application/json']);
    }

    /**
     * Returns the request URL to get all canteens from the collektor.
     * @returns {URL}
     */
    getCanteensUrl() {
        return this.extendBaseUrl(['canteens']);
    }

    /**
     * Returns a list of all canteens.
     * @returns {Array} Array of all courses of the timetable.
     */
    getCanteens() {
        const getCanteensUrl = this.getCanteensUrl();

        return this.get(getCanteensUrl)
            .then(response => response.json());
    }

    /**
     * Returns the request URL to get the menu of a day from the collector.
     * @param {String} canteenId Canteen.
     * @param {String} date ISO-8601 date of day to get.
     * @returns {URL} URL of the menu from the given day.
     */
    getMenuUrl(canteenId, date) {
        return this.extendBaseUrl(['canteens', canteenId, 'menus', date]);
    }

    /**
     * Returns a list of all meals from the queried day.
     * @param {String} canteenId Canteen.
     * @param {String} date ISO-8601 date of day to get.
     * @returns {Array} Array of all meals of the day.
     */
    getMenu(canteenId, date) {
        const getMenuUrl = this.getMenuUrl(canteenId, date);

        const menuETag = this.#menusETags?.[`${canteenId}-${date}`];

        const ifNoneMatchHeader = menuETag
            ? { 'If-None-Match': menuETag }
            : null;

        const headers = {
            ...ifNoneMatchHeader,
        }

        return this.get(getMenuUrl, headers)
            .then(
                response => {
                    if (response.status === 304) {
                        throw new NotModifiedResponse();
                    } else {
                        const responseETag = response?.headers.get('ETag');
                        this.#menusETags[`${canteenId}-${date}`] = responseETag
                        return response.json();
                    }
                }
            );
    }

    /**
     * Creates a CollektorVersion2ApiProvider instance initialised to a list of standard languages, where the mainLanguage parameter specifies the mainLanguage.
     * @param {string} baseUrl - URL which is used as the basis for the query URLs.
     * @param {string} mainLanguage - Main language which is prioritised.
     * @returns {CollektorVersion2ApiProvider} Created CollectorVersion2ApiProvider instance.
     */
    static from(baseUrl, mainLanguage = 'de') {
        const acceptingLanguages = CollektorVersion2ApiProvider.languagesFromMainLanguages(mainLanguage);

        return new CollektorVersion2ApiProvider(baseUrl, acceptingLanguages);
    }
}