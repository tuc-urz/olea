import HttpApiProvider, { JsonContentType } from '@olea/base-api-provider';

const EnableMobileConnectFormDataName = 'enableMobileConnect';

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
     * Creates a CollektorVersion2ApiProvider instance initialised to a list of standard languages, where the mainLanguage parameter specifies the mainLanguage.
     * @param {string} baseUrl - URL which is used as the basis for the query URLs.
     * @param {string} mainLanguage - Main language which is prioritised.
     * @returns {CollektorVersion2ApiProvider} Created CollectorVersion2ApiProvider instance.
     */
    static from(baseUrl, mainLanguage = 'de', accessToken) {
        const acceptingLanguages = HttpApiProvider.languagesFromMainLanguages(mainLanguage);
        const acceptingContentTypes = HttpApiProvider.contentTypesFromContentType(JsonContentType);

        return new TucCallManager(baseUrl, acceptingLanguages, acceptingContentTypes, accessToken);
    }
}