/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import {
    AppState,
    ActivityIndicator,
    Text,
    StyleSheet,
    View,
    FlatList,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

import NewsListItem from '@openasist/component-news-list-item'
import { useApiProvider } from '@openasist/context-news';

import componentStyles from './styles';

export default function NewsList(props) {
    const theme = useTheme();
    const { t } = useTranslation()
    const apiProvider = useApiProvider();

    const { navigation, active, newsChannelId } = props;
    const { themeStyles, colors, paddings } = theme;

    const [news, setNews] = useState(null);

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    );

    const fetchNewsByNewsChannel = useCallback(
        () => {
            if (apiProvider && newsChannelId) {
                // News von API abrufen
                apiProvider.getNews(newsChannelId)
                    // An jede News wird die originale NewsChannel-ID angefügt
                    .then(newsItems => newsItems.map(news => ({ ...news, newsChannelId })))
                    // Aktualisieren des States für News
                    .then(setNews);
            }
        },
        [newsChannelId, apiProvider]
    )

    // Aktualisieren der News, wenn das Modul gewechselt wurde und wieder zurück ins News-Modul gewechselt wird bzw. generell die Komponente im Fokus der App ist
    useFocusEffect(
        fetchNewsByNewsChannel
    );

    // Aktualisieren der News, wenn die NewsList in einer TabView ist und gerade als Tab aktiv ist
    useEffect(
        () => {
            if (active) {
                fetchNewsByNewsChannel();
            }
        },
        [active, fetchNewsByNewsChannel]
    )

    // Aktualisieren der News, wenn App im Hintergrund war und wieder vorgeholt wird
    useEffect(
        () => {
            const subscription = AppState.addEventListener(
                'change',
                nextAppState => {
                    if (nextAppState === 'active') {
                        fetchNewsByNewsChannel();
                    }
                });

            return () => {
                subscription.remove();
            };
        },
        [fetchNewsByNewsChannel]
    );

    return (
        <View style={themeStyles.container}>
            {
                Array.isArray(news)
                    ? <FlatList
                        data={news}
                        keyExtractor={(news, index) => news?.guid ?? news?.title ?? index}
                        renderItem={({ item }) => <NewsListItem news={item} navigation={navigation} />}
                        ItemSeparatorComponent={(props) => {
                            return (<View style={styles.listSeperator} />);
                        }}
                        initialNumToRender={6}
                        contentContainerStyle={{ paddingBottom: paddings.default }}
                        style={styles.innerContainer}
                        ListEmptyComponent={
                            <View style={themeStyles.noticeTextContainer}>
                                <Text style={themeStyles.noticeText}>{t('news:noResult')}</Text>
                            </View>
                        }
                    />
                    : <ActivityIndicator style={styles.activity} size="large" color={colors.loadingIndicator} />

            }
        </View>
    );
}
