/**
 * API-Client/-Provider der die Grundlage für HTTP/REST bassierte API-Clienten/-Provider benutzt werden kann.
 */
export default class HttpApiProvider {
    /**
     * Base URL which is expanded to generate the request URLs.
     * @type {string}
     * @private
     */
    #baseUrl

    /**
     * Prioritised language of retrieved data
     * @type {string[]}
     * @private
     */
    #acceptingLanguages

    /**
     * Content types requested by the server
     * @type {string[]}
     * @private
     */
    #acceptingContentTypes

    /**
     * Access token for authentication
     * @type {string}
     * @private
     */
    #accessToken

    /**
     * Construct a REST API provder.
     * @param {string} baseUrl - URL which is used as the basis for the query URLs.
     * @param {string[]} acceptingLanguages - List of languages that are queried by the ASiST server. The priority is based on the order of the languages in the array.
     * @param {string[]} acceptingContentTypes - List of content types that are queried by the ASiST server. The priority is based on the order of the content types in the array.
     * @param {string} [accessToken=null] OIDC access token which is used for authentication against the API. Default is null
     */
    constructor(baseUrl, acceptingLanguages, acceptingContentTypes, accessToken = null) {
        this.#baseUrl = baseUrl;
        this.#acceptingLanguages = acceptingLanguages;
        this.#acceptingContentTypes = acceptingContentTypes;
        this.#accessToken = accessToken;
    }

    /**
     * Creates a new URL from the base URL and the transferred path segments.
     * @param {string[]} pathSegments - Path segments that are added to the base URL.
     * @returns Base URL extended by segments.
     */
    extendBaseUrl(pathSegments = []) {
        return new URL(pathSegments.join('/'), this.#baseUrl);
    }

    /**
     * Executes a get request to the passed URL.
     * @param {string|URL} url - URL on which a GET request is executed.
     * @param {object} headers - Headers that are appended to the HTTP request.
     * @returns {Promise<Response>} Promise with the response to the GET request from the server.
     */
    get(url, headers = {}) {
        return fetch(
            url,
            {
                headers: {
                    // Headers des Parameters 'header = {}' werden mit dem Standart-Headern zusammengeführt.
                    // Dabei haben Standart-Header höhere Priorität, da diese die Parameter-Header überschreiben.
                    ...headers,
                    ...HttpApiProvider.generateHeaders(
                        this.#acceptingLanguages,
                        this.#acceptingContentTypes,
                        this.#accessToken,
                    )
                },
            },
        );
    }

    patch(url, body, headers = null) {
        const jsonBody = JSON.stringify(body);

        console.debug(this.constructor.name, ':', 'Send PATCH to', url, 'with content', ':', jsonBody);

        return fetch(
            url,
            {
                method: 'PATCH',
                headers: {
                    // Headers des Parameters 'header = {}' werden mit dem Standart-Headern zusammengeführt.
                    // Dabei haben Standart-Header höhere Priorität, da diese die Parameter-Header überschreiben.
                    ...headers,
                    ...HttpApiProvider.generateHeaders(
                        this.#acceptingLanguages,
                        this.#acceptingContentTypes,
                        this.#accessToken,
                    ),
                    'Content-Type': JsonContentType,
                },
                body: jsonBody,
            },
        );
    }

    /**
     * Returns standart headers für asist server requests.
     * @param {string[]} acceptingLanguages - List of languages that are queried by the ASiST server. The priority is based on the order of the languages in the array.
     * @param {string[]} acceptingContentTypes - List of the MIME types to be queried by the HTTP API.
     * @param {string} [accessToken=null] OIDC access token which is used for authentication against the API. Default is null.
     * @returns {object} object, which contains the name of the header as the key and the value of the key is the value of the header.
     */
    // If available implement as private
    static generateHeaders(acceptingLanguages, acceptingContentTypes, accessToken = null) {

        const accessTokenHeader = accessToken ? HttpApiProvider.generateBearerHeader(accessToken) : null;

        return {
            'Accept': HttpApiProvider.generateHeaderValueFromList(acceptingContentTypes), // Wir wollen JSON zugesendet bekommen
            'Accept-Language': HttpApiProvider.generateHeaderValueFromList(acceptingLanguages), // Wir wollen die Hauptsprache priorisieren
            ...accessTokenHeader,
        }
    }

    static generateBearerHeader(accessToken) {
        return { 'Authorization': `Bearer ${accessToken}` };
    }

    /**
     * Converts a list of string values into a string that symbolises a list of header values.
     * @param {string[]} headerValueList - List of strings to convert.
     * @returns String expressing a header value list.
     */
    static generateHeaderValueFromList(headerValueList) {
        return headerValueList?.join(', ') ?? null;
    }

    static contentTypesFromContentType(contentTyp) {
        return [contentTyp];
    }

    /**
     * Creates an array with language codes depending on the passed main language.
     * @param {string} mainLanguage - Main language which is prioritised.
     * @returns {string[]} List of language codes, with the main language taking priority.
     */
    static languagesFromMainLanguages(mainLanguage) {
        // Erstellen der Liste an Sprachen anhand der Hauptsprache(mainLanguage)

        // Prüfen des Sprachparameters
        switch (mainLanguage) {
            case 'de':
                // Wenn Deutsch die Hauptsprache ist, wird Deutsch und nachrangig Englisch als Sprachen ausgewählt
                return ['de', 'en'];
            case 'en':
                // Wenn English die Hauptsprache ist, wird English und nachrangig Deutsch als Sprachen ausgewählt
                return ['en', 'de'];
            default:
                // Wenn Hauptsprache nicht bekannt, wird die Hauptsprache, nachrangig Deutsch und nachrangiger English als Sprachen ausgewählt
                return [mainLanguage, 'de', 'en'];
        }
    }
}

export const JsonContentType = 'application/json';

export const ContentTypes = {
    json: JsonContentType,
};