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
import { SafeAreaView, View, Text } from 'react-native';

import { connect } from 'react-redux'
import { Button, List, Dialog, Portal, RadioButton, withTheme } from 'react-native-paper';
import { withTranslation } from 'react-i18next';

import merge from 'lodash/merge';

import { onSettingGeneralOverride, store } from '@openasist/core';
import AppbarComponent from '@openasist/component-app-bar';

import componentStyles from './styles';

/**
 * Settings General
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
class GeneralSettingsView extends React.Component {
    // Styles of this component
    styles;

    constructor(props) {
        super(props);

        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------

        const { pluginStyles, theme } = this.props;
        this.styles = componentStyles(theme);

        if (pluginStyles) {
            this.styles = merge(this.styles, pluginStyles);
        }

        this.state = {
            language: this.props.settings.settingsGeneral.language,
        };
    }

    /**
     * update the general settings
     *
     * @private
     */
    _updateGeneralSettings = () => {
        const generalSettings = {
            language: this.state.language
        };
        this.setState({ isChangeMessageVisible: false });
        store.dispatch(onSettingGeneralOverride('generalSettings', generalSettings));
    };

    getLanguageByKey = () => {
        const { theme } = this.props;
        const languageCode = this.state.language;
        const languageObject = theme.appSettings.languages.find((language) => language.code === languageCode);
        return languageObject ? languageObject : theme.appSettings.languages[0];
    };

    _renderLanguages = () => {
        const { theme, t } = this.props;
        const { colors } = theme;
        const languages = theme.appSettings.languages.map(language =>
            <View key={'lanuage-' + language.code} >
                <RadioButton.Item
                    value={language.code}
                    color={colors.checkboxChecked}
                    label={t(language.labelKey)}
                    labelStyle={this.styles.dialogContent}
                    uncheckedColor={colors.checkboxUnchecked}
                    mode={'android'}
                />
            </View>
        );

        return (
            <RadioButton.Group
                onValueChange={value => this.setState({ language: value })}
                value={this.state.language}>
                {languages}
            </RadioButton.Group>
        );
    };

    _showDialog = () => this.setState({ visible: true });

    _hideDialog = () => this.setState({ visible: false });

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

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                <AppbarComponent {...this.props} title={t('settings:common.title')} />
                <View accessible={false} style={themeStyles.container}>
                    <List.Section>
                        <List.Item accessible={false} key='language' title={t('settings:common.language')} description={t(this.getLanguageByKey().labelKey)}
                            titleStyle={this.styles.listItemTitle} descriptionStyle={this.styles.listItemDescription}
                            right={() => <Button accessible={true} labelStyle={this.styles.buttonLabel} onPress={this._showDialog} color={colors.buttonText}>{t('common:changeLabel')}</Button>
                            }>
                        </List.Item>
                    </List.Section>
                    <Portal>
                        <Dialog visible={this.state.visible}
                            onDismiss={this._hideDialog}>
                            <Dialog.Title style={this.styles.dialogTitle}>{t('settings:common.language')}</Dialog.Title>
                            <Dialog.Content>
                                {this._renderLanguages()}
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button labelStyle={this.styles.dialogContent} onPress={() => { this.setState({ isChangeMessageVisible: true }); this._hideDialog(); }} color={colors.buttonText}>{t('common:okLabel')}</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Portal>
                        <Dialog visible={this.state.isChangeMessageVisible}
                            onDismiss={() => this.setState({ isChangeMessageVisible: false })}>
                            <Dialog.Title style={this.styles.dialogTitle}>{t('settings:common.languageChange')}</Dialog.Title>
                            <Dialog.Content>
                                <Text style={this.styles.dialogContent}>{t('settings:common.languageChangeText')}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button labelStyle={this.styles.dialogContent} onPress={this._updateGeneralSettings} color={colors.buttonText}>{t('settings:common.languageChangeOk')}</Button>
                                <Button labelStyle={this.styles.dialogContent} onPress={() => this.setState({ isChangeMessageVisible: false })} color={colors.buttonText}>{t('common:cancelLabel')}</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.settingsGeneral.component,
        pluginStyles: state.pluginReducer.settingsGeneral.styles,
        settings: state.settingReducer
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(GeneralSettingsView)))
