import HttpApiProvider, { JsonContentType } from '@openasist/base-api-provider';

/**
 * Infos-API-Client für Kollektor
 */
export default class TucUnseenApiProvider extends HttpApiProvider {

    /**
     * @type {string} Name des Providers
     */
    static name = 'tuc-unseen';

    /**
     * Erstellt und gibt die abzufragende URL für ein ÖPNV-Ticket zurück.
     *
     * @returns {URL} URL für die Abfrage eines ÖPNV-Tickets.
     */
    getUnreadEmailCountUrl() {
        const getUnreadEmailCountUrl = this.extendBaseUrl(['unseen']);

        return getUnreadEmailCountUrl
    }

    /**
     * Gibt die Anzahl der ungelesenen Mails.
     *
     * @returns {number} Anzahl der ungelesenen Mails.
     */
    getUnreadEmailCount() {
        const getUnreadEmailCountUrl = this.getUnreadEmailCountUrl();

        return this.get(getUnreadEmailCountUrl)
            .then(response => response.json())
            .then(jsonResponse => jsonResponse?.data?.unseen);
    }

    /**
     * Erstellt eine CollektorVersion2ApiProvider-Instanz, welche Englisch und Deutsch initialisiert wird.
     * Die priorisierte Hauptsprache kann als Paramter übergeben werden.
     *
     * @param {string} baseUrl URL des Kollektors
     * @param {string} [mainLanguage='de'] Hauptsprache, welche priorisiert wird.
     * @returns {TucUnseenApiProvider} Erstellte CollektorVersion2ApiProvider-Instanz
     */
    static from(baseUrl, mainLanguage = 'de', accessToken) {
        const acceptingLanguages = TucUnseenApiProvider.languagesFromMainLanguages(mainLanguage);
        const acceptingContentTypes = HttpApiProvider.contentTypesFromContentType(JsonContentType);

        return new TucUnseenApiProvider(baseUrl, acceptingLanguages, acceptingContentTypes, accessToken);
    }

    /**
     * Erstellt eine CollektorVersion2ApiProvider-Instanz, welche Englisch und Deutsch initialisiert wird.
     * Die priorisierte Hauptsprache kann als Paramter übergeben werden.
     *
     * @param {object} settingsObject Objekt mit Providereinstellungen
     * @param {string} [mainLanguage='de'] Hauptsprache, welche priorisiert wird.
     * @returns {TucUnseenApiProvider} Erstellte CollektorVersion2ApiProvider-Instanz
     */
    static fromSettingsObject(settingsObject, mainLanguage = 'de', accessToken) {
        const { url } = settingsObject;

        return TucUnseenApiProvider.from(url, mainLanguage, accessToken);
    }
}