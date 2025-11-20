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

import React                from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import {connect}            from 'react-redux';
import {withTheme}          from "react-native-paper";

import merge                from 'lodash/merge';
import NetInfo              from '@react-native-community/netinfo';

import componentStyles      from "./styles";
import PropTypes            from "prop-types";
import {withTranslation}     from "react-i18next";
import {handleHtmlEntities} from "@openasist/core/helper/format.helper";



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
class TopNewsComponent extends React.Component {

    static propTypes = {
        animationRange: PropTypes.any
    };

    // Styles of this component
    styles;

    animateHeader = null;
    animateBackground = null;
    topNews = null;
    hasConnection = true;
    netInfoUnsubscribe = null;

    constructor(props) {
        super(props);

        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------

        const { pluginStyles,theme } = this.props;
        this.styles = componentStyles(theme);

        if(pluginStyles) {
            this.styles = merge(this.styles, pluginStyles);
        }

        this.styles = StyleSheet.create(this.styles);
        // ------------------------------------------------------------------------

        const height = Dimensions.get('window').height;

        this.animateHeader = {
            transform: [{
                translateY: this.props.animationRange.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, height / 8],
                })
            }]
        };

        this.animateLogo = {
            transform: [{
                translateY: this.props.animationRange.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, (height / 50)],
                })
            },
            {
                scale: this.props.animationRange.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, .4],
                })
            }]
        };

        this.animateBackground = {
            transform: [{
                translateY: this.props.animationRange.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, height / 7],
                    extrapolate: 'clamp'
                })
            }]
        };

        this.netInfoUnsubscribe = NetInfo.addEventListener(state => {
             this.hasConnection = state.isInternetReachable && state.isConnected;
        });
    }

    componentWillUnmount() {
        if(this.netInfoUnsubscribe) {
            this.netInfoUnsubscribe();
        }
    }

    render() {

        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------
        const PluginComponent = this.props.pluginComponent;
        if (PluginComponent) {
            return <PluginComponent />;
        }
        // ------------------------------------------------------------------------


        const {feeds, t} = this.props;
        const {colors, appSettings} = this.props.theme;
        let topNews = this.props.topNews;

        if(!Array.isArray(topNews)) {
            topNews = [];
        }

        let topItem = null;
        let imageSrc = null;
        let feedTitle = null;
        if(topNews[0]) {
            topItem = topNews[0];
            if(topItem.imageUrl) {
                imageSrc = {uri: topItem.imageUrl};
            }
        }

        if(feeds && topItem && topItem.originFeedId) {
            const feed = feeds.filter(feed => feed.feedid === topItem.originFeedId)[0];

            if(feed && feed.title) {
                feedTitle = feed.title.toUpperCase();
            }
        }

        if(!imageSrc)
            imageSrc = appSettings.header;


        // Top News available
        this.topNews = topItem;

        // Notice about "." in accessibilityLabels: This will set a short break in the sound output, like in a normal sentence.

        return (
            <View style={{overflow:'hidden'}}>
                <View stlyle={this.styles.backgroundImageWrapper}>
                    <TouchableOpacity
                        onPress={
                            topItem?.link ?? null
                                ? () => { this._handlePressNews(topItem) }
                                : null
                        }
                    >
                        <Animated.Image
                            source={imageSrc}
                            resizeMode="cover"
                            fadeDuration={0}
                            style={[this.styles.newsImage, this.animateBackground]}
                            accessible={true}
                            accessibilityLabel={
                                !topItem && !this.hasConnection
                                    ? t('home:noConnectionTitle')
                                    : (!topItem ? t('home:noItemTitle') : handleHtmlEntities(topItem.title))
                            }
                            accessibilityHint={!topItem ? '' : t('accessibility:topNewsHint')}
                        />
                    </TouchableOpacity>
                </View>

                {
                    (!topItem && !this.hasConnection) ? (
                        <Animated.View style={[this.styles.newsItem]}
                                       accessible={true}
                                       accessibilityLabel={t('home:noConnectionTitle')}>
                            <Text
                                style={this.styles.newsItemCategory}>{t('home:noConnectionSubtitle').toUpperCase()}</Text>
                            <Text style={this.styles.newsItemTitle}>{t('home:noConnectionTitle')}</Text>
                            <Text style={this.styles.newsItemText}>{t('home:noConnectionText')}</Text>
                            <View style={this.styles.newsItemActionbar}>
                                <Text style={this.styles.newsItemDate}></Text>
                            </View>
                        </Animated.View>
                    ) : ((!topItem) ? (
                        <Animated.View style={[this.styles.newsItem]}
                                       accessible={true}
                                       accessibilityLabel={t('home:noItemTitle')}>
                            <Text style={this.styles.newsItemCategory}>{t('home:noItemSubtitle').toUpperCase()}</Text>
                            <Text style={this.styles.newsItemTitle}>{t('home:noItemTitle')}</Text>
                            <Text style={this.styles.newsItemText}>{t('home:noItemText')}</Text>
                            <View style={this.styles.newsItemActionbar}>
                                <Text style={this.styles.newsItemDate}/>
                            </View>
                        </Animated.View>
                    ) : (topItem?.shortDesc
                            ? <TouchableOpacity
                                style={this.styles.newsItem}
                                onPress={() => {this._handlePressNews(topItem)}}
                                accessible={true}
                                accessibilityLabel={handleHtmlEntities(topItem.title)}
                                accessibilityHint={t('accessibility:topNewsHint')}>
                                <View>
                                    {feedTitle && <Text style={this.styles.newsItemCategory}>{feedTitle}</Text>}
                                    <Text style={this.styles.newsItemTitle}>{handleHtmlEntities(topItem.title)}</Text>
                                    <Text style={this.styles.newsItemText}>{handleHtmlEntities(topItem.shortDesc)} ... <Text style={this.styles.newsItemReadMore}>{t('home:readMore')}</Text></Text>
                                    <View style={this.styles.newsItemActionbar}>
                                        {topItem?.author != null
                                            ? <Text style={this.styles.newsItemAuthor}>{handleHtmlEntities(topItem.author)}</Text>
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


    /**
     * User has pressed the news item card.
     * Shows the news details in a modal window.
     *
     * @param news
     *
     * @private
     */
    _handlePressNews = (news) => {
        if (news) {
            this.props.navigation.navigate(
                'TopNewsDetail',
                {
                    news: {...news, 'feedId': 0},
                    newsType: "Default"
                });
        }
    }
}


const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.topNews.component,
        pluginStyles: state.pluginReducer.topNews.styles,
        topNews: state.apiReducer.topNews,
        feeds: state.apiReducer.feeds
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(TopNewsComponent)))
