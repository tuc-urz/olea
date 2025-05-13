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
    ScrollView,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from 'react-native';

import {connect} from 'react-redux'
import {withTheme, Appbar, Portal, Dialog, Checkbox, Button} from "react-native-paper";
import {TabView, TabBar} from 'react-native-tab-view';

import merge from 'lodash/merge';
import {withTranslation}     from "react-i18next";

import { onSettingDevelopOverride, onSettingGeneralOverride, onUpdateRefreshing, store } from "@olea/core";

import componentStyles from "./styles"
import IconsOpenasist from "@olea/icons-openasist";
import AppbarComponent from "@olea/component-app-bar";
import MainMenuEntry from '@olea/component-main-menu-entry';

/**
 * Main Menu View
 *
 * Show a menu of views which are not available in
 * the bottom tab bar. The menu split in categories.
 * Each category has its own tab.
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
class MainMenuView extends React.Component {
    static navigationOptions = {
        header: null
    };

    // Styles of this component
    styles;

    state = {
        index: 0,
        routes: null,
        developCounter: 0,
        isDevelopMenuVisible: false,
        devUseStaging: store.getState().settingReducer.settingsDevelop.devUseStaging,
        showDeeplinkAlert: store.getState().settingReducer.settingsDevelop.showDeeplinkAlert,
        activeStagingMenuItems: store?.getState()?.settingReducer?.settingsDevelop?.activeStagingMenuItems ?? [],
    };


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

        const {appSettings} = this.props.theme;
        const menuRoutes = appSettings.mainMenu.routes;
        if(menuRoutes) {
            this.state.routes = menuRoutes;
        }

        this.state.devUseStaging = this.props.settings.settingsDevelop.useStaging;
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.setState({developCounter: 0});
        });
    }

    _hideDevDialog = () => {
        store.dispatch(onSettingDevelopOverride('settingsDevelop', {
            useStaging: this.state.devUseStaging,
            showDeeplinkAlert: this.state.showDeeplinkAlert,
            activeStagingMenuItems: this.state.activeStagingMenuItems,
        }));
        this.setState({isDevelopMenuVisible: false});
    }

    _renderDevelopmentOptions = () => {
        const { t, theme: { colors, appSettings } } = this.props;
        const { devUseStaging, activeStagingMenuItems, routes } = this.state;
        let subscriberId = store.getState().notificationsReducer.subscriberId;

        // Use menu items of app settings
        const menuItems = appSettings?.mainMenu?.items ?? {};

        const output = [];

        output.push(
            <View key={'item_use_stg'} style={this.styles.selectOption}>
                <Text>{t('settings:develop.useStagingServer')}</Text>
                <Checkbox.Android status={devUseStaging ? 'checked' : 'unchecked'}
                    onPress={() => {
                        this.setState({devUseStaging: !devUseStaging})
                    }}
                    color={colors.checkboxChecked}
                    uncheckedColor={colors.checkboxUnchecked}
                />  
            </View>
        );

        output.push(
            <View key={'item_notification_subscriber'} style={[{marginBottom: 30}]}>
                <Text>{t('settings:develop.notificationSubscriberId')}</Text>
                <Text>{subscriberId}</Text>
            </View>
        );
        output.push(
            <View key={'item_notification_push_message'} style={[{marginBottom: 30}]}>
                <Text>{t('settings:develop.resetPushMessage')}</Text>
                <Button
                    color={colors.buttonText}
                    onPress={
                    () => store.dispatch({type: 'UPDATE_PUSH_MESSAGE_SHOWN', pushMessageShown: false})
                }>Reset</Button>
            </View>
        );
        output.push(
            <View key={'item_deeplink_show_url'} style={[{marginBottom: 30}, this.styles.selectOption]}>
                <Text>{t('settings:develop.showDeepLink')}</Text>
                <Checkbox
                    status={this.state.showDeeplinkAlert ? 'checked' : 'unchecked'}
                    onPress={() => {
                        this.setState({showDeeplinkAlert: !this.state.showDeeplinkAlert})
                    }}
                    color={colors.checkboxChecked}
                    uncheckedColor={colors.checkboxUnchecked}
                ></Checkbox>
            </View>
        );

        // Für jeden Menü-Tab einen Bereich erstellen und im Bereich für jeden Menüpunkt eine Checkbox anbieten.
        // Menüpunkte-Objekt in ein Array umwandeln
        const activatableMenuItemsSettings = Object.entries(menuItems)
            // Aus der Liste der Menüpunkten, werden die Menüpunkte herausgefiltert, die immer aktiv/eingeschaltet sind.
            .map(
                ([menuItemKey, menuItemEntries]) => {
                    const stagingMenuItemEntries = menuItemEntries.filter(
                        menuItemEntry =>
                            // Wenn active-Property nicht vorhanden, ist der Menüpunkt activ, dann Negierung, weil nicht aktive Menueinträge gefiltert werden 
                            !(menuItemEntry?.active ?? true)
                    );
                    return [menuItemKey, stagingMenuItemEntries];
                }
            )
            // Es werden Menü-Tabs herausgefiltert, die keine Menüpunkte, die nur im Stagingmodus zu sehen sind.
            .filter(
                ([menuItemKey, stagingMenuItemEntries]) => (stagingMenuItemEntries?.length ?? 0) > 0
            )
            // Rendern der Menü-Tabs und deren Menüeinträge
            .map(
                ([menuItemKey, stagingMenuItemEntries]) => {
                    const mainMenuRouteTitleKey = routes
                        ?.find(route => route?.key === menuItemKey)
                        ?.title;

                    return (
                        < View key={`item_menuitems_${menuItemKey}`} >
                            <Text>{t(mainMenuRouteTitleKey)}-Tab</Text>
                            <View style={{ paddingLeft: 20 }}>
                                {
                                    // Rendern der Menüpunkte einers Menü-Tabs
                                    stagingMenuItemEntries.map(
                                        stagingMenuItemEntry => {
                                            const stagingMenuItemEntryKey = `${stagingMenuItemEntry?.title}`;

                                            // Der Menüpunkt ist aktiv, wenn sein Schlüssel in der Liste der activen Menüpunkte zu finden ist
                                            const isActive = activeStagingMenuItems.includes(stagingMenuItemEntryKey);

                                            return (
                                                <View
                                                    key={`item_menuitems_${menuItemKey}_${stagingMenuItemEntry?.title}`}
                                                    style={this.styles.selectOption}
                                                >
                                                    <Text>{t(stagingMenuItemEntry?.title)}</Text>
                                                    <Checkbox
                                                        status={isActive ? 'checked' : 'unchecked'}
                                                        color={colors.checkboxChecked}
                                                        uncheckedColor={colors.checkboxUnchecked}
                                                        onPress={() => this.setState({
                                                            activeStagingMenuItems: isActive
                                                                // Wenn der Menüpunkt schon aktiv ist, wird er aus der Liste der aktiven Punkte entfernt.
                                                                ? activeStagingMenuItems.filter(activeStagingMenuItem => activeStagingMenuItem !== stagingMenuItemEntryKey)
                                                                // Wenn der Menüpunkt nicht aktiv ist, wird er zur Liste der aktiven Punkte hinzugefügt.
                                                                : [...activeStagingMenuItems, stagingMenuItemEntryKey]
                                                        })
                                                        }
                                                    />
                                                </View>
                                            )
                                        }
                                    )
                                }
                            </View>
                        </View>
                    )
                }
            );

        return [
            ...output,
            ...activatableMenuItemsSettings,
        ];
    };

    /**
     * Renders a list of links
     *
     * @param route
     *
     * @returns {Array|*}
     *
     * @private
     */
    _renderMenuItems(route) {
        const { t, settings: { settingsDevelop: { useStaging } } } = this.props;
        const { colors, appSettings } = this.props.theme;
        const activeStagingMenuItems = this?.state?.activeStagingMenuItems ?? [];

        // Use menu items of app settings
        const menuItems = appSettings.mainMenu.items;
        if(!menuItems[route]) {
            return <Text>Nicht verfügbar</Text>;
        }

        let routeMenuItems = menuItems[route];

        // Es werden Hauptmenüeintrage herausgefiltert, die nur im Stagingmodus angezeigt werden sollen, aber nicht aktiv sind
        routeMenuItems = routeMenuItems.filter(routeMenuItem => {
            const routeMenuItemKey = `${routeMenuItem?.title}`;
            const isActive = routeMenuItem?.active ?? true;
            const isActiveStagingMenuItem = activeStagingMenuItems.includes(routeMenuItemKey);

            // Entweder ist der Menüpunkt standadtmäßig aktiv oder er wurde durch das DevelopMenu aktiviert
            return isActive || isActiveStagingMenuItem;
        });

        return routeMenuItems.map(
            routeMenuItem =>
                <MainMenuEntry
                    key={routeMenuItem.title}
                    title={routeMenuItem.title}
                    view={routeMenuItem?.view}
                    url={routeMenuItem?.url}
                    icon={routeMenuItem?.icon}
                    iconSVG={routeMenuItem?.iconSVG}
                    isLocalized={routeMenuItem?.isLocalized}
                />
        );
    }

    /**
     * Render scene variable
     *
     * Has to be defined below the definition of the used functions
     *
     * @type {Function}
     * @private
     */
    _renderScene = ({route}) => (<ScrollView style={this.styles.container}>{this._renderMenuItems(route.key)}</ScrollView>);


    /**
     * Render a tab for each category
     *
     * @param props
     *
     * @returns {*}
     *
     * @private
     */
    _renderTabBar = (props) => {
        const {t} = this.props;
        const {themeStyles} = this.props.theme;

        return (
            <TabBar
                {...props}
                scrollEnabled
                style={themeStyles.tabs}
                labelStyle={themeStyles.tab}
                indicatorStyle={themeStyles.tabIndicator}
                tabStyle={{ width: 'auto', paddingHorizontal: 20 }}
                getLabelText={({route}) => t(route.title).toUpperCase()}
                getAccessible={() => true}
                getAccessibilityLabel={({route}) => t(route.title)}
            />
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

        const {
            t,
            theme:{themeStyles, colors},
            settings: {settingsDevelop: {useStaging}}} = this.props;
        const {
            developCounter
        } = this.state;

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                <AppbarComponent title={t('menu:title')} {...this.props}
                                 rightAction={
                                     <>
                                        {useStaging ? <Text>Server: Staging</Text> : null}
                                        <Appbar.Action icon={developCounter >= 10 ? "grid" : undefined} onPress={this._handlePressDevelop.bind(this)}/>
                                     </>
                                 }
                />
                {this.state.routes && <TabView
                    style={this.props.style}
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={index => this.setState({index})}
                />}
                <Portal>
                    <Dialog visible={this.state.isDevelopMenuVisible}
                            onDismiss={this._hideDevDialog}>
                        <Dialog.Title>{t('settings:develop.dialog')}</Dialog.Title>
                        <Dialog.Content>
                            {this._renderDevelopmentOptions()}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this._hideDevDialog} color={colors.buttonText}>{t('common:okLabel')}</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </SafeAreaView>
        );
    }

    _handlePressDevelop = () => {
        if(this.state.developCounter >= 10) {
            this.setState({isDevelopMenuVisible: true});
        }
        this.setState({developCounter: this.state.developCounter + 1});
    }

    /**
     * User has pressed a menu item
     *
     * Depending on the settings of this item, the app will navigate
     * to the set view or navigate to the web view component
     *
     * @param menuItem
     *
     * @private
     */
    _handlePressItem = (menuItem) => {
        const {t} = this.props;

        if(menuItem.view) {
            this.props.navigation.navigate(menuItem.view);

        } else if(menuItem.url) {
            let url = menuItem.url;

            // The url is localized via i18n files, use the given key to get the correct url
            if(menuItem.isLocalized) {
                url = t(menuItem.url)
            }

            this.props.navigation.navigate('Web', {title: t(menuItem.title), url: url});
        }
    };
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.mainMenu.component,
        pluginStyles: state.pluginReducer.mainMenu.styles,
        settings: state.settingReducer
    };
};

export default connect(mapStateToProps, {onUpdateRefreshing})(withTranslation()(withTheme(MainMenuView)))
