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
    SafeAreaView,
    StyleSheet,
    View,
    Share,
    TouchableOpacity, ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux'
import {Appbar, Headline, List, withTheme} from "react-native-paper";
import {withTranslation} from "react-i18next";
import merge from 'lodash/merge';


import { AppBar as AppbarComponent } from '@olea-bps/components';
import IconsOpenasist from "@olea-bps/icons-openasist";

import componentStyles from "./styles";
import {WebView} from "react-native-webview";

/**
 * Room Detail Component
 *
 * Shows the webview for the room directory.
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
class RoomDetailComponent extends React.Component {
    static navigationOptions = {
        header: null
    };


    state = {
        refreshing: false,
        webview: {
            url: '',
            title: ''
        }
    };

    // Styles of this component
    styles;

    webView =  {
        canGoBack: false,
        ref: null,
    };

    constructor(props) {
        super(props);

        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------

        const {pluginStyles, theme} = this.props;
        this.styles = componentStyles(theme);

        if (pluginStyles) {
            this.styles = merge(this.styles, pluginStyles);
        }

        this.styles = StyleSheet.create(this.styles);

        // ------------------------------------------------------------------------
    }

    /**
     * Share function for room
     *
     * @returns {Promise<void>}
     * @private
     */
    async _onShare() {
        try {
            const { room, theme, t } = this.props;
            let roomTitle = room.code2017 || room.title;
            roomTitle += room.codeDez1 ? ' (' + t('room:old') + ': ' + room.codeDez1 + ')' : '' ;

            let message = t('room:title') + ' - ' + roomTitle +
                ((room.building.name)           ? "\n" + t('room:building') + ": " + room.building.name : '') +
                ((room.building.postaladdress)  ? "\n" + t('room:address') + ": " + room.building.postaladdress + ", " + (room.building.postalcode ? "\n" + room.building.postalcode + ' ' + theme.appSettings.defaultCity : '') : '') +
                ((room.codeDez1)                ? "\n" + t('room:campusFinderLink') + ": " + room.url : '') +
                ((room.codeDez1)                ? "\n" + t('room:googleMapsLink') + ": " + theme.appSettings.googleMapsUrl + room.building.coordinates.replace(/\s/g,'') : '');

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


    /**
     * Render room details content
     *
     * @returns a view that includes the full name of the room, its building plus address, one button for opening the campus-navigator and one for opening google-maps
     * @private
     */
    _renderContent = () => {
        const { room, t, theme } = this.props;
        const { themeStyles } = theme;
        const { colors } = theme;

        let roomTitle = room.code2017 || room.title;
        roomTitle += room.codeDez1 ? ' (' + t('room:old') + ': ' + room.codeDez1 + ')' : '';

        return (
            <View style={this.styles.containerInner}>
                <Headline style={this.styles.titleHeadline}>{roomTitle}</Headline>
                {
                    room?.building ?? null
                      ? <>
                            <List.Item
                                key="building"
                                title={t('room:building')}
                                description={room.building.name}
                                descriptionStyle={themeStyles.textLighter}
                                titleStyle={themeStyles.searchDetailTitle}
                            />
                            <List.Item
                                key="address"
                                title={t('room:address')}
                                description={
                                    room.building.postaladdress + (
                                        room?.building?.postalcode ?? false
                                            ? "\n" + room.building.postalcode + ' ' + theme.appSettings.defaultCity
                                            : ''
                                    )
                                }
                                descriptionStyle={themeStyles.textLighter} titleStyle={themeStyles.searchDetailTitle}
                            />
                        </>
                        : null
                }
                <View style={this.styles.buttonContainer} key={'buttonContainer'}>
                    {
                        room?.url ?? null
                          ? <TouchableOpacity
                                style={{ ...this.styles.button, ...this.styles.campusFinderUrl }}
                                key={'campusFinderUrl'}
                                onPress={() => {
                                    this.setState({
                                        webview: {
                                            url: room.url,
                                            title: t('room:campusFinder')
                                        }
                                    })
                                }}
                            >
                                <IconsOpenasist
                                    icon={'map-search'}
                                    size={25}
                                    color={colors.messages.noticeText}
                                />
                                <Headline
                                    style={this.styles.buttonText}
                                >
                                    {t('room:campusFinderLink')}
                                </Headline>
                            </TouchableOpacity>
                            : null
                    }
                    {
                        room?.building?.coordinates ?? null
                          ? <TouchableOpacity
                                style={this.styles.button}
                                key={'googleMapsUrl'}
                                onPress={() => {
                                    this.setState({
                                        webview: {
                                            url: theme.appSettings.googleMapsUrl + room.building.coordinates,
                                            title: t('room:googleMaps')
                                        }
                                    })
                                }}
                            >
                                <IconsOpenasist
                                    icon={'location'}
                                    size={25}
                                    color={colors.messages.noticeText}
                                />
                                <Headline
                                    style={this.styles.buttonText}
                                >
                                    {t('room:googleMapsLink')}
                                </Headline>
                            </TouchableOpacity>
                            : null
                    }
                </View>
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

        const {themeStyles, customScript} = this.props.theme;
        const {t} = this.props;
        const {title, url} = this.state.webview;
        const {colors} = this.props.theme;

        if(title && url) {
            return (
                <SafeAreaView style={[this.styles.container, themeStyles.safeAreaContainer]}>
                    <AppbarComponent {...this.props}
                                    title={title}
                                    leftAction={<Appbar.Action
                                        icon={props => <IconsOpenasist {...props} icon={'back'} color={colors.primaryText} /> }
                                        onPress={() => this.setState({webview: {title: '', url: ''}})} />}/>
                    <WebView
                        ref={ref => this.webView.ref = ref}
                        source={{uri: url}}
                        injectedJavaScript={customScript}
                        startInLoadingState={true}
                        renderLoading={() => <ActivityIndicator style={this.styles.activity} size="large" color={colors.loadingIndicator}/>}
                        onNavigationStateChange={(navState) => { this.webView.canGoBack = navState.canGoBack; }}
                    />
                </SafeAreaView>
            );
        }


        return (
            <SafeAreaView style={[this.styles.container, themeStyles.safeAreaContainer]}>
                <AppbarComponent {...this.props}
                             title={t('room:directory')}
                             rightAction={<Appbar.Action icon="share-variant" onPress={this._onShare.bind(this)}/>}/>
                {this._renderContent()}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.roomDirectory.component,
        pluginStyles: state.pluginReducer.roomDirectory.styles,
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(RoomDetailComponent)))
