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
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper';
import { withTranslation } from 'react-i18next';

import moment from 'moment';

import IconsOpenasist from '@openasist/icons-openasist';

import componentStyles from './styles';

function NewsListItem({ theme, theme: { themeStyles, colors, fontSizes }, t, news, language, navigation }) {

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    );

    const description = news.shortDesc
        .replace(/<(?:.|\n)*?>/gm, '')
        .replace('Weiterlesen ›', '');

    const publicationDate = news?.pubdate
        ? moment(news.pubdate).locale(language).format('L')
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
                        news.imageUrl
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
};

const mapStateToProps = state => {
    return {
        language: state.settingReducer.settingsGeneral.language,
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(NewsListItem)))
