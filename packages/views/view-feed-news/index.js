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
import {
    ActivityIndicator,
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity, Image, Linking
} from 'react-native';
import {connect} from 'react-redux'
import {withTheme} from "react-native-paper";
import {withTranslation} from "react-i18next";

import merge from 'lodash/merge';
import moment from "moment";

import {feedApi, onUpdateRefreshing} from "@olea/core";
import AppbarComponent from "@olea/component-app-bar";
import IconsOpenasist from "@olea/icons-openasist";

import componentStyles from "./styles";
import { handleHtmlEntities } from '@olea/core/helper/format.helper';


/**
 * Feed News View
 *
 * Shows a list of news of the provided feed
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - feedId: Id of the feed to load the news from
 *  - feedTitle: Name/Title of the feed for view header
 */
class FeedNewsView extends React.Component {
    static navigationOptions = {
        header: null
    };

    // Styles of this component
    styles;

    feedNews = null;

    constructor(props) {
        super(props);

        this.state = {
            inProgress: true,
            hasNoNewsAvailable: false,
            hasError: false
        };

        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------

        const {pluginStyles,theme} = this.props;
        this.styles = componentStyles(theme);

        if (pluginStyles) {
            this.styles = merge(this.styles, pluginStyles);
        }

        this.styles = StyleSheet.create(this.styles);

        // ------------------------------------------------------------------------
    }

    /**
     * User pressed a card to read this news
     *
     * @param news
     *
     * @private
     */
    _onCardPress(news) {
        this.props.navigation.navigate('NewsDetail', {news: news});
    }


    /**
     * Render a single news item with title, description and image
     *
     * @param item
     * @returns {*}
     * @private
     */
    _renderNewsItem = ({item}) => {
        const { theme: { themeStyles, colors}, t } = this.props;

        var description = item.shortDesc
            .replace(/<(?:.|\n)*?>/gm, '')
            .replace('Weiterlesen ›', '');

        let date = moment(item.pubdate);

        let pubDate = item.pubdate;
        if(date) {
            pubDate = date.format('DD.MM.YYYY - HH:mm');
        }

        return (
            <TouchableOpacity style={themeStyles.cardWithImage} onPress={() => this._onCardPress(item)}>
                <View style={themeStyles.cartHeaderSplit}>
                    {item.imageUrl && <Image source={{uri: item.imageUrl }} style={themeStyles.cartHeaderSplitImage} resizeMode="contain"/>}
                    <View style={item.imageUrl ? themeStyles.cartHeaderSplitDetails : themeStyles.cartHeaderDetails}>
                        <Text style={[themeStyles.cardTitle, this.styles.newsTitle]}>{item.title}</Text>
                        <View style={[themeStyles.flexRow, {alignItems: 'center', alignContent: 'center'}]}>
                            <IconsOpenasist icon={'time'} size={20} color={colors.accent}/>
                            <Text style={[themeStyles.cardSubTitle, this.styles.newsDate]}>{pubDate}</Text>
                        </View>
                    </View>
                </View>
                <View style={themeStyles.flexRow}>
                    <View style={[themeStyles.cardContent, this.styles.newsContent]}>
                        <Text style={themeStyles.cardText}>{handleHtmlEntities(description)}</Text>
                    </View>
                    <View style={[themeStyles.cardRightIcon, this.styles.newsIcon]}>
                        <IconsOpenasist icon={"forward"} size={25} color={colors.messages.icon} />
                    </View>
                </View>
                {item.link ? (
                    <TouchableOpacity style={themeStyles.cardLinkExternal} onPress={() => {Linking.openURL(item.link)}}>
                        <Text style={themeStyles.cardLinkTextExternal}>{t('common:openInBrowser')}</Text>
                        <IconsOpenasist icon={"open-external"} size={18} color={colors.subtitle} />
                    </TouchableOpacity>
                ) : null}
            </TouchableOpacity>
        );
    };

    /**
     * Key Extractor for unique item key
     *
     * @param item
     * @param index
     * @returns {*}
     * @private
     */
    _keyExtractor = (item, index) => {
        return ((item.guid) ? item.guid : ((item.title) ? item.title : index));
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


        const {route, t}  = this.props;
        const {colors, paddings, themeStyles} = this.props.theme;
        const {inProgress, hasNoNewsAvailable, hasError} = this.state;

        const feedId = route.params && route.params.feedId || null;
        const feedTitle = route.params && route.params.feedTitle || 'News';

        if(!this.feedNews && feedId) {
            feedApi.getFeedById(feedId, (feed) => {
                if(typeof feed === 'number') {
                    this.feedNews = [];
                    this.setState({
                        inProgress: false,
                        hasNoNewsAvailable: feed === 0,
                        hasError: feed === -1
                    });
                } else {
                    this.feedNews = feed;
                    this.setState({
                        inProgress: false,
                        hasNoNewsAvailable: false,
                        hasError: false
                    });
                }
            });
        }

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                <AppbarComponent {...this.props} title={feedTitle}/>
                <View style={themeStyles.container}>
                    { !inProgress && hasNoNewsAvailable &&
                        <View style={themeStyles.noticeTextContainer}>
                            <Text style={themeStyles.noticeText}>{t('news:noResult')}</Text>
                        </View>
                    }
                    { !inProgress && hasError &&
                        <View style={themeStyles.noticeTextContainer}>
                            <Text style={themeStyles.noticeText}>{t('news:couldNotLoadNews')}</Text>
                        </View>
                    }
                    { inProgress && <ActivityIndicator style={this.styles.activity} size="large" color={colors.loadingIndicator} /> }
                    { !inProgress && <FlatList
                        data={this.feedNews}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderNewsItem}
                        initialNumToRender={6}
                        getItemLayout={(data, index) => (
                            {length: 50, offset: 50 * index, index}
                        )}
                        contentContainerStyle={{paddingBottom: paddings.default}}
                        style={this.styles.innerContainer}
                    /> }

                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.feedNews.component,
        pluginStyles: state.pluginReducer.feedNews.styles,
    };
};


export default connect(mapStateToProps, {onUpdateRefreshing})(withTranslation()(withTheme(FeedNewsView)))
