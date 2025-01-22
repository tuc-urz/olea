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
import {SafeAreaView, View, Alert} from 'react-native';
import { reloadAppAsync } from 'expo'

import {connect} from 'react-redux'
import { withTheme, Checkbox} from "react-native-paper";
import {withTranslation} from "react-i18next";

import merge from 'lodash/merge';

import { onSettingAccessibilityOverride, store } from "@openasist/core";
import AppbarComponent from "@openasist/component-app-bar";
import componentStyles from "./styles";

/**
 * Settings Accessibility
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
class AccessibilitySettingsView extends React.Component {
    // Styles of this component
    styles;

    constructor(props) {
        super(props);

        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------

        const {pluginStyles, theme, settings} = this.props;
        this.styles = componentStyles(theme);

        if (pluginStyles) {
            this.styles = merge(this.styles, pluginStyles);
        }

        const {highContrast, increaseFontSize} = settings.settingsAccessibility;

        this.state = {
            highContrast:  highContrast ? highContrast : false,
            increaseFontSize: increaseFontSize ? increaseFontSize : false
        };
    }


    /**
     * update the settings
     *
     * @private
     */
    _handleChange(key) {
        const {t} = this.props;
        if(key in this.state){
            const settings = Object.assign({}, this.state, {[key]: !this.state[key]});
            Alert.alert(
                t('settings:accessibility.restartRequired'),
                t('settings:accessibility.restartRequiredDesc'),
                [
                    {
                        text: t('settings:accessibility.cancelRestart'),
                        style: 'cancel',
                        onPress: () => {}
                    },
                    {
                        text: t('settings:accessibility.doRestart'),
                        onPress: async () => {
                            this.setState(settings)
                            store.dispatch(onSettingAccessibilityOverride('accessibilitySettings',  settings));
                            setTimeout(async () => {
                                await reloadAppAsync();
                            }, 500);
                        },
                    },
                ]
            );
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

        const { theme: { themeStyles, colors }, t } = this.props;
        const { highContrast, increaseFontSize } = this.state;
        const accessibilitySettings = [
            {key: 'highContrast',       checked: highContrast,      title: t('settings:accessibility.highContrast')     },
            {key: 'increaseFontSize',   checked: increaseFontSize,  title: t('settings:accessibility.increaseFontSize') }
        ].map(({key, checked, title}) =>
            <Checkbox.Item
                key={key}
                status={checked ? 'checked' : 'unchecked'}
                label={title}
                labelStyle={this.styles.labelStyle}
                onPress={() => this._handleChange(key)}
                color={colors.checkboxChecked}
                uncheckedColor={colors.checkboxUnchecked}
                mode={'android'}
            />
        );



        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                <AppbarComponent {...this.props} title={t('settings:accessibility.title')}/>
                <View style={themeStyles.container}>
                    {accessibilitySettings}
                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.settingsAccessibility.component,
        pluginStyles: state.pluginReducer.settingsAccessibility.styles,
        settings: state.settingReducer
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(AccessibilitySettingsView)))
