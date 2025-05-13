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
import {SafeAreaView, StyleSheet, ActivityIndicator, View} from 'react-native';
import {connect} from 'react-redux'
import {Appbar, withTheme} from "react-native-paper";
import { WebView } from 'react-native-webview';
import {withTranslation} from "react-i18next";
import merge from 'lodash/merge';

import componentStyles from "./styles";
import AppbarComponent from "@olea/component-app-bar";
import IconsOpenasist from "@olea/icons-openasist";

/**
 * Opal View
 *
 * Shows the opal site in a webview
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
class OpalView extends React.Component {
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


    render() {
        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------
        const PluginComponent = this.props.pluginComponent;
        if (PluginComponent) {
            return <PluginComponent />;
        }
        // ------------------------------------------------------------------------

        const {theme:{colors, themeStyles, customScript}, t } = this.props;

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                <View style={{zIndex: 100, position: 'relative'}}>
                    <AppbarComponent {...this.props}
                        title={t('opal:title')}
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
                    source={{uri: t('opal:url')}}
                    startInLoadingState={true}
                    injectedJavaScript={customScript}
                    renderLoading={() => <ActivityIndicator style={this.styles.activity} size="large" color={colors.loadingIndicator} />}
                    onNavigationStateChange={(navState) => { this.webView.canGoBack = navState.canGoBack; }}
                />
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.opal.component,
        pluginStyles: state.pluginReducer.opal.styles,
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(OpalView)))
