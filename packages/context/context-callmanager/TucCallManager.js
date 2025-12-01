import HttpApiProvider, { JsonContentType } from '@olea-bps/base-api-provider';

/**
 * API-Client for Kollektor
 */
export default class TucCallManager extends HttpApiProvider {

    static #standardPathSegments = ['services', 'nutzer', 'parallelruf']

    setParallelCall(parallelCallId, parallelCall) {
        const parallelCallRessourceUrl = this.parallelCallUrl(parallelCallId);

        return this.patch(
            parallelCallRessourceUrl,
            parallelCall,
        ).then(
            response => {
                console.debug(response.status);
                return response.json();
            }
        ).then(
            jsonResponse => {
                console.debug(jsonResponse);
                return jsonResponse;
            }
        );
    }

    getParallelCalls() {
        const parallelCallRessourceUrl = this.getParallelCallsUrl();

        return this.get(
            parallelCallRessourceUrl,
            {
                'Content-Type': JsonContentType,
            }
        ).then(
            response => response.json()
        ).then(
            jsonResponse => {
                console.debug(this.constructor.name, ':', 'get parallel calls', ':', jsonResponse);
                return jsonResponse?.map(
                    parallelCall => ({
                        ...parallelCall,
                        enableMobileConnect: parallelCall?.enableMobileConnect === 'true',
                        isMobilePhone: parallelCall?.isMobilePhone === 'true',
                    })
                );
            }
        );
    }

    getParallelCallsUrl() {
        return this.extendBaseUrl(TucCallManager.#standardPathSegments);
    }

    parallelCallUrl(parallelCallId) {
        return this.extendBaseUrl([...TucCallManager.#standardPathSegments, parallelCallId]);
    }

    /**
     * Erstellt eine TucCallManager-Instanz
     * @param {string} baseUrl URL, welche als Basis für die Anfragen verwendet werden soll
     * @param {string} mainLanguage Die zu prioriserende Hauptsprache
     * @param {string} accessToken Zugriffstoken, welches der Provider für den Nutzerzugriff verwendet.
     * @returns {TucCallManager} Erstellelte TucCallManager-Instanz
     */
    static from(baseUrl, mainLanguage = 'de', accessToken) {
        const acceptingLanguages = HttpApiProvider.languagesFromMainLanguages(mainLanguage);
        const acceptingContentTypes = HttpApiProvider.contentTypesFromContentType(JsonContentType);

        return new TucCallManager(baseUrl, acceptingLanguages, acceptingContentTypes, accessToken);
    }
}