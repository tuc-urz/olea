import { useContext, createContext, useMemo, useState, useCallback, useEffect } from 'react';

import { useTheme } from 'react-native-paper';

import { useLanguage, useStagingServer } from '@olea-bps/core';

import CollektorVersion2ApiProvider from './CollektorVersion2ApiProvider';

/**
 * @typedef News
 * @property {string} title
 * @property {string} link
 * @property {string} author
 * @property {string} guid
 * @property {string} pubdate
 * @property {string} desc
 * @property {string} descImageUrl
 * @property {string} contentImageDesc
 * @property {string} contentImageUrl
 * @property {string} shortDesc
 * @property {string} imageUrl
 */

/**
 * @typedef Newschannel
 * @property {Number} feedid
 * @property {string} title
 * @property {string} url
 * @property {string} description
 * @property {string} language
 * @property {News[]} news
 */

export const NewsContext = createContext();

const CollectorVersion2ProviderName = 'hs-collector-v2';

/**
 * Provider for news context
 */
function NewsContextProvider({ children }) {
    const theme = useTheme();
    const language = useLanguage();
    const isStagingServerActive = useStagingServer();

    const componentName = NewsContextProvider.name;
    const availableLanguages = theme?.appSettings.languages;

    const [newsChannels, setNewsChannels] = useState();

    // Einstellungen für das Stundenplan-Modul
    const newsSettings = theme?.appSettings?.modules?.news;

    //
    const newsChannelsSettings = newsSettings?.channels;
    const filterNewsChannelsByLanguages = !(newsChannelsSettings?.allLanguages ?? false);

    // Einstellungen für API-Provider
    const newsApiSettings = newsSettings?.api
    // Soll der Staging-Provider verwendet werden?
    const newsApiProviderSettings = isStagingServerActive
        // Wenn ja, werden die Staging Provider-Einstellungen geladen
        ? newsApiSettings?.staging
        // Wenn nein, werden die productiven Provider-Einstellungen geladen
        : newsApiSettings?.production;
    const newsApiProvider = newsApiProviderSettings?.provider;
    const newsApiBaseUrl = newsApiProviderSettings?.url;

    // Erstellen des API-Providers bzw. erneuern wenn sich Einstellungen ändern.
    const apiProvider = useMemo(
        () => {
            switch (newsApiProvider?.toLowerCase()) {
                case CollectorVersion2ProviderName:
                    console.debug(componentName, ': use collector v2 api');
                    return new CollektorVersion2ApiProvider.from(newsApiBaseUrl, language);
                default:
                    console.log(`${componentName}: Can't build api provider: ${newsApiProvider}`)
                    return null;
            }
        },
        [newsApiProvider, newsApiBaseUrl, language]
    );

    const refreshNewsChannels = useCallback(
        () => {
            // Nachrichtenkanäle nutzen drei stelligen Sprachcode
            // Es wird der 2-stellige Sprachcode in den 3-stelligen konvertiert.
            const newsChannelsFilterLanguageCode = availableLanguages
                .find(avaiableLanguage => avaiableLanguage.code === language)
                .extCode;

            let newsChannelsPromise = apiProvider
                ?.getNewsChannels();

            if (filterNewsChannelsByLanguages) {
                // Solange die Kollektoren nicht die Sprache über die API-Filtern, müssen wir im Clienten filtern.
                // Es werden nur Nachrichtenkanäle übernommen, die der aktuellen Sprache entsprechen.
                newsChannelsPromise = newsChannelsPromise
                    ?.then(
                        newsChannels =>
                            newsChannels.filter(
                                // Die Spracheinstellung wird mit der Sprache des Newschannels auf Gleichheit verglichen, dabei wird die Groß- bzw. Kleinschreibung ignoriert.
                                newsChannel => newsChannelsFilterLanguageCode?.localeCompare?.(newsChannel?.language, undefined, { sensitivity: 'accent' }) == 0
                            )
                    )
            }

            return newsChannelsPromise
                ?.then(setNewsChannels);
        },
        [apiProvider, availableLanguages, language, filterNewsChannelsByLanguages]
    )

    useEffect(
        () => {
            refreshNewsChannels();
        },
        [refreshNewsChannels]
    )

    return (
        <NewsContext
            value={{
                apiProvider: apiProvider,
                newsChannels,
                refreshNewsChannels,
            }}
        >
            {children}
        </NewsContext>
    );
}

function useNewsContext() {
    return use(NewsContext);
}

function useApiProvider() {
    const newsContext = useNewsContext();

    return newsContext?.apiProvider;
}

function useNewsChannels() {
    const newsContext = useNewsContext();

    return [newsContext?.newsChannels, newsContext?.refreshNewsChannels];
}
export {
    NewsContext as default,
    NewsContextProvider,
    useNewsContext,
    useApiProvider,
    useNewsChannels,
}
