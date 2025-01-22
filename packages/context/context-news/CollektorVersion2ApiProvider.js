import HttpApiProvider from '@openasist/base-api-provider';

/**
 * API-Client for Collector
 */
export default class CollektorVersion2ApiProvider extends HttpApiProvider {

    /**
     * @param {string} baseUrl URL which is used as the basis for the query URLs.
     * @param {string[]} acceptingLanguages List of languages that are queried by the ASiST server. The priority is based on the order of the languages in the array.
     */
    constructor(baseUrl, acceptingLanguages) {
        // ContentTypes wird auf JSON festgesetzt, da der ASiST-Server nur JSON spricht.
        super(baseUrl, acceptingLanguages, ['application/json']);
    }

    /**
     * Returns the request URL to get all news channels from the collector.
     * @returns {URL}
     */
    getNewsChannelsUrl() {
        return this.extendBaseUrl(['feed']);
    }

    /**
     * Returns a list of all news channels.
     * @returns {Array} Array of all news channels.
     */
    getNewsChannels() {
        const getNewsChannelsUrl = this.getNewsChannelsUrl();

        return this.get(getNewsChannelsUrl)
            .then(response => response.json());
    }

    /**
     * Returns the request URL to get the news of a news channel from the collector.
     * @param {String} newsChannelId Id of news channel.
     * @returns {URL} URL of the news from the given news channel.
     */
    getNewsUrl(newsChannelId) {
        return this.extendBaseUrl(['feed', newsChannelId]);
    }

    /**
     * Returns a list of all news from the queried news channel.
     * @param {String} newsChannelId Id of news channel.
     * @returns {Array} Array of all news of the news channel.
     */
    getNews(newsChannelId) {
        const getNewsUrl = this.getNewsUrl(newsChannelId);

        return this.get(getNewsUrl)
            .then(response => response.json());
    }

    /**
     * Creates a CollektorVersion2ApiProvider instance initialised to a list of standard languages, where the mainLanguage parameter specifies the mainLanguage.
     * @param {string} baseUrl URL which is used as the basis for the query URLs.
     * @param {string} mainLanguage Main language which is prioritised.
     * @returns {CollektorVersion2ApiProvider} Created CollectorVersion2ApiProvider instance.
     */
    static from(baseUrl, mainLanguage = 'de') {
        const acceptingLanguages = CollektorVersion2ApiProvider.languagesFromMainLanguages(mainLanguage);

        return new CollektorVersion2ApiProvider(baseUrl, acceptingLanguages);
    }
}