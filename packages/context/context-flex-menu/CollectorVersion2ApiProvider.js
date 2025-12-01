import HttpApiProvider, { JsonContentType } from '@olea-bps/base-api-provider'

export default class CollectorVersion2ApiProvider extends HttpApiProvider {

    constructor(baseUrl, acceptingLanguages) {
        // ContentTypes wird auf JSON festgesetzt, da die Kollektoren nur JSON sprechen.
        super(baseUrl, acceptingLanguages, [JsonContentType]);
    }

    getMenuEntriesUrl() {
        return this.extendBaseUrl(['app-menu-entries']);
    }

    getMenuEntries() {
        const getUrl = this.getMenuEntriesUrl();

        return this.get(getUrl)
            .then(response => response.json());
    }

    /**
     * Creates a CollektorVersion2ApiProvider instance initialised to a list of standard languages, where the mainLanguage parameter specifies the mainLanguage.
     * @param {string} baseUrl URL which is used as the basis for the query URLs.
     * @param {string} mainLanguage Main language which is prioritised.
     * @returns {CollektorVersion2ApiProvider} Created CollectorVersion2ApiProvider instance.
     */
    static from(baseUrl, mainLanguage = 'de') {
        const acceptingLanguages = CollectorVersion2ApiProvider.languagesFromMainLanguages(mainLanguage);

        return new CollectorVersion2ApiProvider(baseUrl, acceptingLanguages);
    }
}