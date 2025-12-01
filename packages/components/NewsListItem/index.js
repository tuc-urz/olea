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

import { useMemo } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { DateTime } from 'luxon';

import { useLanguage } from '@olea-bps/core';
import IconsOpenasist from '@olea-bps/icons-openasist';

import componentStyles from './styles';

export default function NewsListItem({ news }) {
    const componentName = NewsListItem.name;
    const language = useLanguage();
    const { t } = useTranslation();
    const theme = useTheme()
    const { themeStyles, colors, fontSizes } = theme;
    const navigation = useNavigation();

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    );

    const description = news.shortDesc
        .replace(/<(?:.|\n)*?>/gm, '')
        .replace('Weiterlesen ›', '');

    console.debug(componentName, ':', `news ${news?.guid} pub date`, ':', news.pubdate);
    const publicationDate = news?.pubdate
        ? DateTime.fromISO(news.pubdate, { locale: language }).toLocaleString(DateTime.DATETIME_SHORT)
        : null;

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('NewsDetail', { news: news })}
            accessible={true}
            accessibilityLabel={t('accessibility:feedNewsItem', { news: [news.title, description].join('. '), date: publicationDate })}
            accessibilityHint={t('accessibility:feedNewsItemHint')}
        >
            <View style={themeStyles.flexRow}>
                <View style={[themeStyles.cardContent, styles.contentContainer]}>
                    {
                        news?.imageUrl
                            ? <Image
                                source={{ uri: news.imageUrl }}
                                resizeMode="cover"
                                style={styles.image}>
                            </Image>
                            : null
                    }
                    <Text style={styles.title}>{news.title}</Text>
                    <Text style={styles.description}>{description}</Text>
                    {
                        publicationDate
                            ? <View style={[themeStyles.flexRow, { alignItems: 'center', alignContent: 'center' }]}>
                                <IconsOpenasist icon={'time'} size={fontSizes.l} color={colors.iconSubtitle} />
                                <Text style={[themeStyles.cardSubTitle, styles.publicationDate]}>{publicationDate}</Text>
                            </View>
                            : null
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
}
