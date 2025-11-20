import HttpApiProvider, { JsonContentType } from '@openasist/base-api-provider';

/**
 * Infos-API-Client für Kollektor
 */
export default class CollektorVersion2ApiProvider extends HttpApiProvider {

    /**
     * Erstellt und gibt die abzufragende URL für ein ÖPNV-Ticket zurück.
     *
     * @returns {URL} URL für die Abfrage eines ÖPNV-Tickets.
     */
    getTicketUrl() {
        const getTicketUrl = this.extendBaseUrl(['ticket']);

        return getTicketUrl
    }

    /**
     * Gibt ein ÖPNV-Ticket zurück.
     *
     * @returns {object} Ein ÖPNV-Ticket.
     */
    getTicket() {
        const getTicketUrl = this.getTicketUrl();

        return this.get(getTicketUrl)
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
    static from(baseUrl, mainLanguage = 'de', accessToken) {
        const acceptingLanguages = CollektorVersion2ApiProvider.languagesFromMainLanguages(mainLanguage);
        const acceptingContentTypes = HttpApiProvider.contentTypesFromContentType(JsonContentType);

        return new CollektorVersion2ApiProvider(baseUrl, acceptingLanguages, acceptingContentTypes, accessToken);
    }
}