import HttpApiProvider from '@olea-bps/base-api-provider';

/**
 * Infos-API-Client für Kollektor
 */
export default class CollektorVersion2ApiProvider extends HttpApiProvider {

    /**
     * @param {string} baseUrl URL des Kollektors
     * @param {string[]} acceptingLanguages Liste der akzeptierten Sprachen die dem Kollektor mitgesendet werden, dabei ist die Priorität die Reihenfolge.
     */
    constructor(baseUrl, acceptingLanguages) {
        // ContentTypes wird auf JSON festgesetzt, da der Kollektor nur JSON spricht.
        super(baseUrl, acceptingLanguages, ['application/json']);
    }

    /**
     * Erstellt und gibt die abzufragende URL für die Abfrage aller Infos zurück.
     *
     * @returns {URL} URL für die Abfrage aller Infos-Objekte.
     */
    getInfosUrl() {
        const getInfoUrl = this.extendBaseUrl(['infos']);

        return getInfoUrl
    }

    /**
     * Gibt die Liste aller Info-Objekte zurück.
     *
     * @returns {Array} Liste aller Info-Objekte.
     */
    getInfos() {
        const getInfosUrl = this.getInfosUrl();

        return this.get(getInfosUrl)
            .then(response => response.json());
    }

    /**
     * Erstellt eine CollektorVersion2ApiProvider-Instanz, welche Englisch und Deutsch initialisiert wird.
     * Die priorisierte Hauptsprache kann als Paramter übergeben werden.
     *
     * @param {string} baseUrl URL des Kollektors
     * @param {string} [mainLanguage='de'] Hauptsprache, welche priorisiert wird.
     * @returns {CollektorVersion2ApiProvider} Erstellte CollektorVersion2ApiProvider-Instanz
     */
    static from(baseUrl, mainLanguage = 'de') {
        const acceptingLanguages = CollektorVersion2ApiProvider.languagesFromMainLanguages(mainLanguage);

        return new CollektorVersion2ApiProvider(baseUrl, acceptingLanguages);
    }
}