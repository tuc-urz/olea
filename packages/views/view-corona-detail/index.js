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
    StyleSheet,
    SafeAreaView, View, ActivityIndicator, Platform
} from 'react-native';
import {connect} from 'react-redux'
import { Appbar, withTheme } from "react-native-paper";
import {withTranslation} from "react-i18next";

import merge from 'lodash/merge';

import AppbarComponent from "@olea/component-app-bar";
import WebviewComponent from "@olea/component-web-view";

import componentStyles from "./styles";
import IconsOpenasist from '@olea/icons-openasist';
import { WebView } from 'react-native-webview';


/**
 * Corona Info View
 *
 * The home screen of the app. Shows different informations like the top news, weather,
 * current mensa menus and informations of the next course (if the student has imported his timtetable)
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
class CoronaDetailView extends React.Component {
    static navigationOptions = {
        header: null
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

        const { pluginStyles,theme } = this.props;
        this.styles = componentStyles(theme);

        if(pluginStyles) {
            this.styles = merge(this.styles, pluginStyles);
        }

        this.styles = StyleSheet.create(this.styles);

        // ------------------------------------------------------------------------

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
        const {route} = this.props;
        const {
            theme:{colors, themeStyles, customScript},
            t,
            useBackButton = false
        } = this.props;
        let url = route.params && route.params.url || this.props.url || null;
        let item = route.params && route.params.item || this.props.item || null;

        if(!useBackButton) {
            return (
                <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                    <AppbarComponent {...this.props} title={t(item.title)}/>
                    <WebviewComponent url={url} constPage={true}/>
                </SafeAreaView>
            );
        }

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                <View style={{zIndex: 100, position: 'relative'}}>
                    <AppbarComponent {...this.props}
                                     title={t(item.title)}
                                     leftAction={
                                         <Appbar.Action
                                             icon={props => <IconsOpenasist {...props} icon={'back'} color={colors.primaryText} /> }
                                             onPress={() => {
                                                 if (this.webView.canGoBack) {
                                                     this.webView.ref.goBack();
                                                 } else {
                                                     this.props.navigation.goBack(null);
                                                 }
                                             }}
                                             accessible={true}
                                             accessibilityLabel={(this.webView.canGoBack) ? t('accessibility:appbar.navigateBack') : t('accessibility:appbar.back')}
                                         />
                                     }
                                     rightAction={
                                         <Appbar.Action
                                             icon="refresh"
                                             onPress={() => this.webView.ref.reload()}
                                             accessible={true}
                                             accessibilityLabel={t('accessibility:appbar.reload')}
                                         />
                                     }/>
                </View>
                <WebView
                    ref={ref => this.webView.ref = ref}
                    source={{uri: url}}
                    startInLoadingState={true}
                    allowsFullscreenVideo={true}
                    allowsInlineMediaPlayback={true}
                    setSupportMultipleWindows={false}
                    injectedJavaScript={customScript}
                    renderLoading={() => <ActivityIndicator style={this.styles.activity} size="large" color={colors.loadingIndicator} />}
                    onNavigationStateChange={(navState) => {
                        if(Platform.OS !== 'android') {
                            this.webView.canGoBack = navState.canGoBack; /* iOS only */
                        }
                    }}
                    onLoadProgress={({nativeEvent}) => {
                        if(Platform.OS === 'android') {
                            this.webView.canGoBack = nativeEvent.canGoBack; /* Android only */
                        }
                    }}
                    onContentProcessDidTerminate={(syntheticEvent) => {
                        // this should prevent white screen issues on ios
                        const { nativeEvent } = syntheticEvent;
                        console.warn('Content process terminated, reloading', nativeEvent);
                        this.refs.webview.reload();
                    }}
                />
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {

    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(CoronaDetailView)))
