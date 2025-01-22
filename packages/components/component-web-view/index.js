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
import { StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux'
import { withTheme } from "react-native-paper";
import { WebView } from 'react-native-webview';
import merge from 'lodash/merge';

import componentStyles from "./styles";

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
class WebviewComponent extends React.Component {
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

    onShouldStartLoadWithRequest = (event) =>{
        const {url, constPage} = this.props;
        if(constPage){
            if(event.url === url)
                return true;
            else
                return false;
        }
        return true;
    }
    render() {
        const {colors, customScript} = this.props.theme;
        const {url} = this.props;

        const script = `function hideHead(){document.getElementById("header").style.display = 'none';}hideHead();`
        return (
                <WebView
                    injectedJavaScript={url.includes("tuc.cloud") ? script + customScript : customScript}
                    javaScriptEnabled
                    onMessage={(event) => {}}
                    source={{uri: url}}
                    ref={ref => this.webView.ref = ref}
                    startInLoadingState={true}
                    renderLoading={() => <ActivityIndicator style={this.styles.activity} size="large" color={colors.primary}/>}
                />
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, null)(withTheme(WebviewComponent))
