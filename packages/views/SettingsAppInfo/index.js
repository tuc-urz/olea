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
import {SafeAreaView, View, Image, TouchableOpacity, Linking} from 'react-native';

import {List, withTheme} from 'react-native-paper';
import {withTranslation} from "react-i18next";

import * as Application from 'expo-application';

import { AppBar as AppbarComponent } from '@olea-bps/components';
import componentStyles from "./styles";

/**
 * Settings app info
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
class AppInfoSettingsView extends React.Component {
    // Styles of this component
    styles;

    constructor(props) {
        super(props);

        const {theme} = this.props;
        this.styles = componentStyles(theme);
    }

    render() {
        const { theme: { themeStyles, appSettings }, t } = this.props;

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                <AppbarComponent
                    {...this.props}
                    title={t('settings:version.title')}
                />
                <View style={themeStyles.container}>
                    <List.Section>
                        <List.Item
                            key="version"
                            title={t('settings:version.version')}
                            description={Application.nativeApplicationVersion ?? t("settings:version.unknown")}
                            titleNumberOfLines={2}
                            titleStyle={this.styles.listItemTitle}
                            descriptionStyle={this.styles.listItemDescription}
                        >
                        </List.Item>
                    </List.Section>

                  {
                    appSettings.infoBanner &&
                      <TouchableOpacity
                        onPress={() => Linking.openURL(appSettings.infoBannerUrl)}
                        activeOpacity={0.7}
                      >
                        <Image
                          style={this.styles.infoBanner}
                          source={appSettings.infoBanner}
                          resizeMode="contain" />
                      </TouchableOpacity>
                  }
                </View>
            </SafeAreaView>
        );
    }
}

export default (withTranslation()(withTheme(AppInfoSettingsView)))
