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
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {connect} from 'react-redux'
import {withTheme} from "react-native-paper";
import {withTranslation} from "react-i18next";

import merge from 'lodash/merge';

import {onUpdateRefreshing} from "@olea/core";


import componentStyles from "./styles";
import AppbarComponent from "@olea/component-app-bar";
import IconsOLEA from "@olea/icons-olea";

/**
 * Feed List View
 *
 * Shows a list of news feeds
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
class FeedListView extends React.Component {
    static navigationOptions = {
        header: null
    };

    // Styles of this component
    styles;

    constructor(props) {
        super(props);

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
     * Render a feed
     *
     * @returns {Array}
     *
     * @private
     */
    _renderFeed = ({item}) => {
        const {themeStyles, colors} = this.props.theme;

        return (
            <TouchableOpacity style={themeStyles.card} onPress={() => {this.props.navigation.navigate('FeedNews', {feedId: item.feedid, feedTitle: item.title})}}>
                <View style={[themeStyles.cardContent, this.styles.cardContent]}>
                    <Text style={[themeStyles.cardTitle, this.styles.cardTitle]}>{item.title}</Text>
                    <Text style={[themeStyles.cardSubTitle, this.styles.cardSubTitle]}>{item.desc}</Text>
                </View>
                <View style={themeStyles.cardRightIcon}>
                    <IconsOLEA icon={"forward"} size={25} color={colors.messages.icon} />
                </View>
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
        return 'feed_' + ((item.feedid) ? item.feedid : ((item.title) ? item.title : index));
    };


    render() {
        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------
        const PluginComponent = this.props.pluginComponent;
        if (PluginComponent) {
            return <PluginComponent/>;
        }
        // ------------------------------------------------------------------------

        const {feeds, theme: {colors, paddings, themeStyles}, t} = this.props;

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                <AppbarComponent {...this.props} title={t('news:feeds')}/>
                <View style={themeStyles.container}>
                    {!feeds ?
                        <ActivityIndicator style={this.styles.activity} size="large" color={colors.loadingIndicator} /> :
                        <FlatList
                        data={feeds.sort((a,b) => {
                            if(a.feedid < b.feedid){
                                return -1;
                            } else if (a.feedid > b.feedid) {
                                return 1;
                            }
                            return 0;
                        })}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderFeed}
                        initialNumToRender={6}
                        getItemLayout={(data, index) => (
                            {length: 50, offset: 50 * index, index}
                        )}
                        contentContainerStyle={{paddingBottom: paddings.default}}
                        style={this.styles.innerContainer}
                    />}
                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.feedList.component,
        pluginStyles: state.pluginReducer.feedList.styles,
        feeds: state.apiReducer.feeds
    };
};


export default connect(mapStateToProps, {onUpdateRefreshing})(withTranslation()(withTheme(FeedListView)))
