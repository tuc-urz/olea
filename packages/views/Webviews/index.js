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
import {SafeAreaView, StyleSheet, ActivityIndicator, View, Linking} from 'react-native';
import {connect} from 'react-redux'
import {Appbar, withTheme} from "react-native-paper";
import { WebView } from 'react-native-webview';
import merge from 'lodash/merge';

import componentStyles from "./styles";
import { AppBar as AppbarComponent } from '@olea-bps/components';
import IconsOpenasist from "@olea-bps/icons-openasist";


/**
 * Webview View
 *
 * Use this víew to show a webpage (via url).
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - title: Header title
 *  - url: Webpage Url
 */
class WebviewsView extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        refreshing: false,
    };

    // Styles of this component
    styles;



    webView =  {
        canGoBack: false,
        ref: null,
    };

    jsScript = `
        const meta = document.createElement('meta');
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');
        meta.setAttribute('name', 'viewport');
        document.head.appendChild(meta);
        `;

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
     * Intercept URL loading in the WebView.
     * If the base URL of the event is different from the initial base URL, open it in the external browser.
     * Still allows url navigation with # values in the URL by comparing the base URL of the event with the base URL of the initial URL.
     */
    onShouldStartLoadWithRequest = (event) => {
        const {url} = this.props.route.params;
        const baseUrl = url.split('#')[0];
        const eventBaseUrl = event.url.split('#')[0];

        if (eventBaseUrl !== baseUrl) {
            Linking.openURL(event.url);
            return false;
        }
        return true;
    }

    render() {
        const {route} = this.props;
        const {colors, themeStyles, customScript} = this.props.theme;
        // The language is necessary because it is needed in the header in the source-prop of the webview elemnent
        // to display the website in the selected system-language
        const {language} = this.props.settings.settingsGeneral

        // Get the current title of the element, that should be displayed e.g. Imprint, data policy, etc.
        const title = route.params && route.params.title || null;
        // Get the url for the current element defined in the settings
        const url = route.params && route.params.url || null;

        // The returned View contains a Appbar followed by the webview that calls the websites provided in the URL
        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                <View style={{zIndex: 100, position: 'relative'}}>
                    <AppbarComponent {...this.props}
                                     title={title}
                                     leftAction={
                                         <Appbar.Action
                                             icon={props => <IconsOpenasist {...props} icon={'back'} color={colors.primaryText} /> }
                                             onPress={() => {
                                                 if (this.webView.canGoBack) {
                                                     this.webView.ref.goBack();
                                                 } else {
                                                     this.props.navigation.goBack(null);
                                                 }
                                             }} />
                                     }
                                     rightAction={<Appbar.Action  icon="refresh"  onPress={() => this.webView.ref.reload()}/>}/>
                </View>
                <WebView
                    ref={ref => this.webView.ref = ref}
                    // In addition to only providing the url as a source, headers can be defined that will contain additional information
                    // In this case the header provides information about the current system-language in order to display a given translation of the website
                    source={{ uri: url, headers: {
                        "Accept-Language": `${language}`,
                      } }}
                    startInLoadingState={true}
                    renderLoading={() => <ActivityIndicator style={this.styles.activity} size="large" color={colors.loadingIndicator} />}
                    onNavigationStateChange={(navState) => { this.webView.canGoBack = navState.canGoBack; }}
                    injectedJavaScript={this.jsScript + customScript}
                    onMessage={() => {}}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                />
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        // The settings are necessary to determine the current system-language so that the websites in the webview can be
        // translated in the selected language
        settings: state.settingReducer
    };
};

export default connect(mapStateToProps, null)(withTheme(WebviewsView))
