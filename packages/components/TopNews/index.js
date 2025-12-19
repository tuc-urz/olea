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
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';

import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';

import componentStyles from './styles';
import { withTranslation } from 'react-i18next';
import { handleHtmlEntities } from '@olea-bps/core/helper/format.helper';
import { useCallback } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';

/**
 * Top News Component
 *
 * Shows a single news item with the name and the logo of the university.
 *
 * Parameters:
 *  - animationRange: Animation Range for animation of the dashboard view
 *
 * Navigation-Parameters:
 *  - none
 */
function TopNewsComponent(props) {
    const { animationRange, topNews, feeds, t, theme, navigation } = props;

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    )

    const { isConnected, isInternetReachable } = useNetInfo();
    const hasConnection = isConnected && isInternetReachable;

    const { height } = useWindowDimensions();

    const animateHeader = {
        transform: [{
            translateY: animationRange.interpolate({
                inputRange: [0, 1],
                outputRange: [0, height / 8],
            })
        }]
    };

    const animateLogo = {
        transform: [{
            translateY: animationRange.interpolate({
                inputRange: [0, 1],
                outputRange: [30, (height / 50)],
            })
        },
        {
            scale: animationRange.interpolate({
                inputRange: [0, 1],
                outputRange: [1, .4],
            })
        }]
    };

    const animateBackground = {
        transform: [{
            translateY: animationRange.interpolate({
                inputRange: [0, 1],
                outputRange: [0, height / 7],
                extrapolate: 'clamp'
            })
        }]
    };

    const { colors, appSettings } = theme;

    if (!Array.isArray(topNews)) {
        topNews = [];
    }

    let topItem = null;
    let imageSrc = null;
    let feedTitle = null;
    if (topNews[0]) {
        topItem = topNews[0];
        if (topItem.imageUrl) {
            imageSrc = { uri: topItem.imageUrl };
        }
    }

    if (feeds && topItem && topItem.originFeedId) {
        const feed = feeds.filter(feed => feed.feedid === topItem.originFeedId)[0];

        if (feed && feed.title) {
            feedTitle = feed.title.toUpperCase();
        }
    }

    if (!imageSrc)
        imageSrc = appSettings.header;

    const _handlePressNews = useCallback(
        () => {
            if (topItem) {
                navigation.navigate(
                    'TopNewsDetail',
                    {
                        news: { ...topItem, 'feedId': 0 },
                        newsType: 'Default'
                    });
            }
        },
        [topItem, navigation]
    );

    return (
        <View style={{ overflow: 'hidden' }}>
            <View stlyle={styles.backgroundImageWrapper}>
                <TouchableOpacity
                    onPress={
                        topItem?.link ?? null
                            ? () => _handlePressNews(topItem)
                            : null
                    }
                >
                    <Animated.Image
                        source={imageSrc}
                        resizeMode='cover'
                        fadeDuration={0}
                        style={[styles.newsImage, animateBackground]}
                        accessible={true}
                        accessibilityLabel={
                            !topItem && !hasConnection
                                ? t('home:noConnectionTitle')
                                : (!topItem ? t('home:noItemTitle') : handleHtmlEntities(topItem.title))
                        }
                        accessibilityHint={!topItem ? '' : t('accessibility:topNewsHint')}
                    />
                </TouchableOpacity>
            </View>

            {
                (!topItem && !hasConnection) ? (
                    <Animated.View style={[styles.newsItem]}
                        accessible={true}
                        accessibilityLabel={t('home:noConnectionTitle')}>
                        <Text
                            style={styles.newsItemCategory}>{t('home:noConnectionSubtitle').toUpperCase()}</Text>
                        <Text style={styles.newsItemTitle}>{t('home:noConnectionTitle')}</Text>
                        <Text style={styles.newsItemText}>{t('home:noConnectionText')}</Text>
                        <View style={styles.newsItemActionbar}>
                            <Text style={styles.newsItemDate}></Text>
                        </View>
                    </Animated.View>
                ) : ((!topItem) ? (
                    <Animated.View style={[styles.newsItem]}
                        accessible={true}
                        accessibilityLabel={t('home:noItemTitle')}>
                        <Text style={styles.newsItemCategory}>{t('home:noItemSubtitle').toUpperCase()}</Text>
                        <Text style={styles.newsItemTitle}>{t('home:noItemTitle')}</Text>
                        <Text style={styles.newsItemText}>{t('home:noItemText')}</Text>
                        <View style={styles.newsItemActionbar}>
                            <Text style={styles.newsItemDate} />
                        </View>
                    </Animated.View>
                ) : (topItem?.shortDesc
                    ? <TouchableOpacity
                        style={styles.newsItem}
                        onPress={() => _handlePressNews(topItem)}
                        accessible={true}
                        accessibilityLabel={handleHtmlEntities(topItem.title)}
                        accessibilityHint={t('accessibility:topNewsHint')}>
                        <View>
                            {feedTitle && <Text style={styles.newsItemCategory}>{feedTitle}</Text>}
                            <Text style={styles.newsItemTitle}>{handleHtmlEntities(topItem.title)}</Text>
                            <Text style={styles.newsItemText}>{handleHtmlEntities(topItem.shortDesc)} ... <Text style={styles.newsItemReadMore}>{t('home:readMore')}</Text></Text>
                            <View style={styles.newsItemActionbar}>
                                {topItem?.author != null
                                    ? <Text style={styles.newsItemAuthor}>{handleHtmlEntities(topItem.author)}</Text>
                                    : null
                                }
                            </View>
                        </View>
                    </TouchableOpacity>
                    : null
                ))
            }
        </View>
    );
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.topNews.component,
        pluginStyles: state.pluginReducer.topNews.styles,
        topNews: state.apiReducer.topNews,
        feeds: state.apiReducer.feeds,
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(TopNewsComponent)));
