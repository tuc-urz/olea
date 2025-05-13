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
import { Alert, SafeAreaView, View } from 'react-native';

import {connect} from 'react-redux'
import { withTheme, Checkbox, Text, Switch } from "react-native-paper";
import {withTranslation} from "react-i18next";

import merge from 'lodash/merge';

import { onSettingNotificationsOverride, store } from "@olea/core"
import AppbarComponent from "@olea/component-app-bar";
import componentStyles from "./styles";

/**
 * Settings Notifications
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
class NotificationsSettingsView extends React.Component {
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

        const {enablePushNotifications, enableAllNotifications, enabledFeedNotifications} = settings.settingsNotifications;
        this.state = {
            enablePushNotifications:  enablePushNotifications ? enablePushNotifications : false,
            enableAllNotifications: enableAllNotifications ? enableAllNotifications : false,
            enabledFeedNotifications: enabledFeedNotifications ? enabledFeedNotifications : []
        };
    }


    /**
     * Save new settings to the store
     */
    _saveSettings(newSettings) {
        store.dispatch(onSettingNotificationsOverride('notificationSettings', {...this.state, ...newSettings}));
        this.setState(newSettings);
    }

    /**
     * update the settings
     *
     * @private
     */
    _handleChange(type, id) {
        const { enablePushNotifications, enabledFeedNotifications, enableAllNotifications } = this.state;
        const { feeds, t } = this.props;

        let newSettings = {};
        if(type === 'feed') {
            let isEnabled = enabledFeedNotifications.indexOf(id) !== -1;
            newSettings['enabledFeedNotifications'] = isEnabled
                ? enabledFeedNotifications.filter(feedid => feedid !== id)
                : [...enabledFeedNotifications, id];

            // Enable AllNotifications if all feeds are enabled, otherwise disable it
            newSettings['enableAllNotifications'] = newSettings['enabledFeedNotifications'].length === feeds.length;

        } else {
            newSettings[type] = !this.state[type];
        }

        // Enable all notifications
        if(type === 'enableAllNotifications') {
            newSettings['enabledFeedNotifications'] = enableAllNotifications ? [] : feeds.map(feed => feed.feedid);
        }

        // Inform user about the use of google services for notifications
        if(type === 'enablePushNotifications' && !enablePushNotifications) {
            Alert.alert(
                t('settings:notifications.activationMessageTitle'),
                t('settings:notifications.activationMessageDesc'),
                [{
                    text: t('settings:notifications.activationMessageCancel'),
                    style: 'cancel',
                    onPress: () => {
                    }
                },
                    {
                        text: t('settings:notifications.activationMessageOk'),
                        onPress: async () => {
                            this._saveSettings(newSettings, true);
                        },
                    },
                ]
            );
        } else {
            this._saveSettings(newSettings);
        }
    }

    feedSettings() {
        const { theme: { colors }, t, feeds } = this.props;
        const { enablePushNotifications, enabledFeedNotifications } = this.state;

        let feedItems = [];
        feedItems.push(
            <Text key="enabledFeedNotifications" style={this.styles.labelStyleBold}>{t('settings:notifications.feeds')}</Text>
        );
        feeds.forEach(feed => {
            feedItems.push(
                <Checkbox.Item
                    disabled={!enablePushNotifications}
                    key={feed.feedid}
                    label={feed.title}
                    labelStyle={this.styles.labelStyle}
                    status={enabledFeedNotifications.indexOf(feed.feedid) > -1 ? 'checked' : 'unchecked'}
                    onPress={() => this._handleChange('feed', feed.feedid)}
                    color={colors.checkboxChecked}
                    uncheckedColor={colors.checkboxUnchecked}
                    mode="android"
                />
            )
        });
        return <View style={this.styles.innerContainer} key={'feedSettings'}>{feedItems}</View>;
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

        const { theme: { themeStyles, colors }, t, feeds } = this.props;
        const { enablePushNotifications, enableAllNotifications } = this.state;
        const items = [];
        [
            {key: 'enablePushNotifications',    checked: enablePushNotifications,   disabled: false,                    title: t('settings:notifications.enablePushNotifications')  },
            {key: 'enableAllNotifications',     checked: enableAllNotifications,    disabled: !enablePushNotifications, title: t('settings:notifications.enableAllNotifications')   }
        ].forEach(item => {
            items.push(
                <View style={this.styles.setting} key={item.key}>
                    <Text style={this.styles.labelStyleBold}>{item.title}</Text>
                    <Switch value={item.checked} disabled={item.disabled} onValueChange={() => this._handleChange(item.key)} color={colors.checkboxChecked} />
                </View>

            );
        });

        // List all enabledFeedNotifications with checkboxes to enable/disable notifications
        if (feeds.length > 0) {
            items.push(<View style={this.styles.horizontalSeparator} key={'separator'}/>);
            items.push(this.feedSettings())
        }


        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                <AppbarComponent {...this.props} title={t('settings:notifications.title')}/>
                <View style={themeStyles.container}>
                    {items}
                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.settingsNotifications.component,
        pluginStyles: state.pluginReducer.settingsNotifications.styles,
        settings: state.settingReducer,
        feeds: state.apiReducer.feeds
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(NotificationsSettingsView)))
