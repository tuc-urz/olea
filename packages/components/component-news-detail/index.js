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

import React from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Share,
    Dimensions,
    Animated,
    Platform,
    Linking,
    PixelRatio
} from 'react-native';
import {Appbar, Headline, withTheme} from "react-native-paper";
import { WebView } from 'react-native-webview';
import {withTranslation} from "react-i18next";
import { connect } from 'react-redux'
import merge from 'lodash/merge';
import moment from "moment";

import WebViewAutoHeight from '@olea/react-native-webview-autoheight';


import componentStyles from "./styles"
import AppbarComponent from "@olea/component-app-bar";
import {selectFeedById} from "@olea/core/redux/reducers/api";


/**
 * News Detail Component
 *
 * Shows the image and the text of a single news. Provides a share functionality.
 *
 * Parameters:
 *  - news: News object with all informations of it (for use in modal)
 *
 * Navigation-Parameters:
 *  - news: News object with all informations of it (for use as standalone view)
 */
class NewsDetailComponent extends React.Component {
    static propTypes = {
        news: PropTypes.object,
    };

    /**
     * Constant to store news types. These types are used to change the view accordingly.
     */
    static newsTypes = Object.freeze({
        topNews: 'TopNews',
    })

    // Styles of this component
    styles;

    news = null;

    currentURL = null;

    urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    maxHeaderHeight = Dimensions.get('window').height / 2.8;
    minHeaderHeight = 120;
    headerScrollDistance = this.maxHeaderHeight - this.minHeaderHeight;

    fontScaling = PixelRatio.getFontScale();

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

        this._onScroll = this._onScroll.bind(this);

        this.state = {
            imageHeight: Dimensions.get('window').height / 2.8,
            scrollY: new Animated.Value(Platform.OS === 'ios' ? -this.maxHeaderHeight :0)
        };
    };

    /**
     * Share function for contact
     *
     * @returns {Promise<void>}
     * @private
     */
    async _onShare() {
        try {
            let message = this.news.title + '\n\n' + this.news.link;
            const result = await Share.share({
                message: message
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
                alert(error.message);
        }
    };


    _onScroll = event => {
        let scrollPosY = event.nativeEvent.contentOffset.y;
        let imageHeight =  Dimensions.get('window').height / 2.8;


        let calculatedHeight = imageHeight - scrollPosY;
        let limit = 80;
        this.setState({imageHeight: calculatedHeight > limit ? calculatedHeight : limit});
    };

    /**
     * get the news content
     *
     * @param news
     * @param css
     *
     * @returns {{html: string}}
     * @private
     */
    _getNewsContent = (news, css) => {
        const newsContent =  {html: css + "<div class='content'><meta http-equiv='Content-Type' content='text/html; charset=utf-8' />" + news.desc + "</div>"};
        if (Platform.OS === 'android') {
            newsContent.baseUrl = '';
        }
        return newsContent;
    };

   /**
    * checks if the url is a valid one -> if so, it will open the URL in the browser
    * otherwise it stops the request
    *
    * @param url
    * @returns {boolean}
    */
    startLoadingRequest = ({url}) => {
        if (!url.match(this.urlRegex)) {
            return true;
        } else if (url.match(this.urlRegex) && Linking.canOpenURL(url)){
            //Android does not support the stopLoading method
            if (Platform.OS === 'android') {
                this.webView && this.webView.goBack();
                Linking.openURL(url);
            } else {
                this.webView.stopLoading();
                Linking.openURL(url);
            }
        }
    };

    _renderTopNewsContent = (news) => {
      const {customScript} = this.props.theme;
      return (
        <View style={this.styles.container}>
          <WebView
              injectedJavaScript={customScript}
              source={{ uri: news.link }}
          />
        </View>
      );
    }


    /**
     * Render news contact details content
     *
     * @returns {*}
     * @private
     */
    _renderContent = (news) => {
        const {appSettings, css, themeStyles} = this.props.theme;
        this.currentURL = news.link;



        let imageSrc = null;
        if(news?.contentImageUrl) {
            imageSrc = {uri: news.contentImageUrl}
        }
        const scrollY = Animated.add(
            this.state.scrollY,
            Platform.OS === 'ios' ? this.maxHeaderHeight : 0,
        );

        const headerTranslate = scrollY.interpolate({
            inputRange: [0, this.headerScrollDistance],
            outputRange: [0, -this.headerScrollDistance],
            extrapolate: 'clamp',
        });
        const imageTranslate = scrollY.interpolate({
            inputRange: [0, this.headerScrollDistance],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        const titleOpacity = scrollY.interpolate({
            inputRange: [0, this.headerScrollDistance / 2, this.headerScrollDistance],
            outputRange: [0, 1, 1],
            extrapolate: 'clamp',
        });

        const titleScale = scrollY.interpolate({
            inputRange: [0, this.headerScrollDistance / 2, this.headerScrollDistance],
            outputRange: [1, 1, 0.8],
            extrapolate: 'clamp',
        });
        let titleTranslate = scrollY.interpolate({
            inputRange: [0, this.headerScrollDistance / 2, this.headerScrollDistance],
            outputRange: [0, 0, -8],
            extrapolate: 'clamp',
        });

        // No image
        if(imageSrc == null) {
            imageSrc = appSettings.header;
        }


        let barTitle = news.title.replace(/<(?:.|\n)*?>/gm, '');
        let barTitleFontSize = 22;
        let barTitleLineHeight = 22;
        let barTitleHeight = 120;
        if(barTitle.length > 80)
            barTitleFontSize = 18;

        if(barTitle.length > 120)
            barTitleFontSize = 16;

        if(this.fontScaling > 2) {
            barTitleFontSize = 15;
            barTitleLineHeight = 14;
            barTitleHeight = 140;
        }
        if(this.fontScaling > 2.3) {
            barTitleFontSize = 12;
            barTitleLineHeight = 14;
            barTitleHeight = 160;
            titleTranslate = scrollY.interpolate({
                inputRange: [0, this.headerScrollDistance / 2, this.headerScrollDistance],
                outputRange: [0, 0, -25],
                extrapolate: 'clamp',
            });
        }
        barTitleFontSize = Math.round(barTitleFontSize * 10000) / 10000;

        let pubDate = news ? news.pubdate : null ;
        let date = news ? moment(news.pubdate) : moment();
        if(date)
            pubDate = date.format('DD.MM.YYYY HH:mm');

        return (
          <View style={this.styles.container}>
            <Animated.ScrollView style={[this.styles.containerInner]}>
                <Animated.View
                    pointerEvents="none"
                    style={[this.styles.header, { height: this.maxHeaderHeight }]}>
                    {imageSrc != null &&
                        <Animated.Image
                            source={imageSrc}
                            style={[
                                this.styles.image,
                                {
                                    height: this.maxHeaderHeight,

                                }
                            ]}/>}
                </Animated.View>
                {news.contentImageDesc ? (<Text style={this.styles.imageDesc}>{news.contentImageDesc}</Text>) : null}
                <View style={[this.styles.containerContent, Platform.OS === 'android' && {paddingBottom: this.maxHeaderHeight + this.styles.containerContent.paddingVertical}]}>
                    <Headline style={this.styles.title}>{news.title}</Headline>
                    <WebViewAutoHeight source={this._getNewsContent(news, css)}
                                       style={{...themeStyles.webview, ...this.styles.newsContent}}
                                       scrollEnabled={false}
                                       contentInset={{top: 0, left: 0, right: 0, bottom: 0}}
                                       onNavigationStateChange={this.startLoadingRequest}
                                       ref={el => {this.webView = el}}/>
                   <Text style={[this.styles.newsContent, this.styles.newsContentText]}>{pubDate}</Text>
                </View>
            </Animated.ScrollView>
          </View>
        );
    };

    render() {
        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------
        const PluginComponent = this.props.pluginComponent;
        if (PluginComponent) {
            return <PluginComponent />;
        }
        // ------------------------------------------------------------------------

        const {themeStyles} = this.props.theme;
        let { news, route, t, feed } = this.props;
        let { newsType } = route.params;

        if(!news){
            return (
                <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                    <AppbarComponent {...this.props}
                                     title={t('news:title')}/>
                    <View style={this.styles.container}>
                        <Text>{t('news:couldNotLoad')}</Text>
                    </View>
                </SafeAreaView>
            );
        }

        this.news = news;
        const title = feed ? feed.title : t('news:feeds');

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                <AppbarComponent {...this.props}
                                 title={title}
                                 rightAction={newsType ? null : <Appbar.Action icon="share-variant" onPress={this._onShare.bind(this)}/>}/>
                {newsType === NewsDetailComponent.newsTypes.topNews ? this._renderTopNewsContent(news) : this._renderContent(news)}
            </SafeAreaView>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    let {news, route} = ownProps;
    if (!news) {
        news = route.params && route.params.news || null;
    }

    return {
        pluginComponent: state.pluginReducer.newsDetail.component,
        pluginStyles: state.pluginReducer.newsDetail.styles,
        feed: selectFeedById(state, news.feedId),
        news: news
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(NewsDetailComponent)))
