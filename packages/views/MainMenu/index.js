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

import React, { useMemo, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native';

import { connect } from 'react-redux'
import { withTheme, useTheme, Appbar } from 'react-native-paper';
import { TabView, TabBar, TabBarItem } from "react-native-tab-view";
import { withTranslation, useTranslation } from 'react-i18next';

import merge from 'lodash/merge';
import moment from "moment/moment";

import { onUpdateRefreshing, useActiveStagingMenuItems } from '@olea-bps/core';
import { AppBar as AppbarComponent } from '@olea-bps/components';
import { MainMenuEntry } from '@olea-bps/components';
import { DevelopmentDialog } from '@olea-bps/components';
import { useMainMenuEntries } from '@olea-bps/context-flex-menu';

import componentStyles from './styles'

/**
 * Die Daten für einen Menüeintrag, welche für das Rendern eines Menüseintarges in einem Menü verwendet wird.
 * Es kann eine Views oder eine URL als Ziel hinterlegt werden.
 * Soll eine URL in einer webview geöffnet werden, muss eine URL als String über das Datenfels `url` hinterlegt werden.
 * Eine View wird geöffnet, wenn das Datenfeld `view` einen View-Namen enthält.
 * Das anzuzeigende Icon kann über das Datenfeld `icon` oder `iconSVG` übergeben werden.
 *
 * @typedef {object} MenuItem
 * @property {string} title - Titel des Menüeintrages
 * @property {string} [icon] Schlüssel des Icons, welches mit dem Titel angeziegt werden soll. Stattdessen kann auch `iconSVG` verwendet werden.
 * @property {React.ReactNode} [iconSVG] Icon als SVG-ReactNode. Stattdessen kann auch `icon` verwendet werden.
 * @property {string} [url] URL welche in einer Webview geöffnet werden soll, wenn der Nutzer den Menueintrag auswählt.
 * @property {string} [view] Name der zu öffnenden View
 */

/**
 * Liste von Hauptmenüeinträgen
 *
 * @param {object} props
 * @param {MenuItem[]} props.menuItems Liste der anzuzeigenden Menueinträge als {@link MenuItem}s
 * @returns {React.JSX.Element[]}
 */
function MainMenuEntryList({ menuItems }) {
    return menuItems
        ? menuItems.map(
            menuItem =>
                <MainMenuEntry
                    key={menuItem.title}
                    title={menuItem.title}
                    view={menuItem?.view}
                    url={menuItem?.url}
                    icon={menuItem?.icon}
                    iconSVG={menuItem?.iconSVG}
                    isLocalized={menuItem?.isLocalized}
                />
        )
        : (
            <Text>Nicht verfügbar</Text>
        );
}

/**
 * Tabbar für die Kategorien des Menüs.
 */
function MainMenuTabbar(props) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { themeStyles } = theme;

    return (
        <TabBar
            {...props}
            scrollEnabled
            style={themeStyles.tabs}
            labelStyle={themeStyles.tab}
            activeColor={themeStyles.tabs.activeColor}
            inactiveColor={themeStyles.tabs.inactiveColor}
            indicatorStyle={themeStyles.tabIndicator}
            tabStyle={{ width: 'auto', paddingHorizontal: 20 }}
            renderTabBarItem={({ route, navigationState, ...rest}) =>
              <TabBarItem
                {...rest}
                key={route.key}
                route={route}
                navigationState={navigationState}
                labelStyle={themeStyles.tab}
                activeColor={themeStyles.tabs.activeColor}
                inactiveColor={themeStyles.tabs.inactiveColor}
                // Die einbindung von moment.js zum Anzeigen des Wochentages sollte langfristig entfernt werden.
                // Funktioniert die Luxon funktionalität der Wochenanzeige nicht unter iOS datetime.toFormat('ccc')
                labelText={t(route.title).toUpperCase()}
                accessible={true}
                accessibilityLabel={t(route.title)}
              />
            }
        />
    );
}

/**
 * Scene/Inhalt eines Tabs des Hauptmenüs.
 *
 * @param {object} props
 * @param {object} props.route
 * @param {string} props.route.key Schlüssel der Route und Schlüssel, welcher für die errechnung der Menüeintrage verwendet wird
 */
function MainMenuScene({ route: { key: mainMenuItemsKey } }) {
    const theme = useTheme();
    const { i18n } = useTranslation();
    const appSettings = theme?.appSettings;
    const availableMenuItems = appSettings?.mainMenu?.items?.[mainMenuItemsKey];
    const activeStagingMenuItems = useActiveStagingMenuItems();
    const [flexMainMenuEntries, refreshFlexMenuEntries] = useMainMenuEntries();

    useEffect(
        () => {
            refreshFlexMenuEntries?.();
        },
        [refreshFlexMenuEntries]
    )

    // Verfügbare Sprachen
    const languages = appSettings?.languages;
    // Eingestellte Sprache aus der Übersetzung holen
    const selectedLanguage = i18n.language;
    // Hinterlegte Sprachen durchgehen und nach dem erweiterten Sprachcode holen
    const selectedExtLanguageCode = languages
        // Finde die derzeitige eingestellte Sprache
        .find(language => language?.code === selectedLanguage)
        // Erweiterten Sprachcode von der gefundenen Sprache auslesen
        ?.extCode;

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );



    // Es werden Hauptmenüeintrage herausgefiltert, die nur im Stagingmodus angezeigt werden sollen, aber nicht aktiv sind
    const activeMenuItems = useMemo(
        () => availableMenuItems.filter(
            menuItem => {
                const menuItemKey = `${menuItem?.title}`;
                // Ist der Menüpunkt durch Appeinstellungen aktiv?
                const isActive = menuItem?.active ?? true;
                // Ist der Menüpunkt durch die Entwicklereinstellungen aktiviert?
                const isActiveStagingMenuItem = activeStagingMenuItems.includes(menuItemKey);

                // Entweder ist der Menüpunkt standadtmäßig aktiv oder er wurde durch den Developmenteinstellungen-Dialog aktiviert
                return isActive || isActiveStagingMenuItem;
            }
        ),
        [availableMenuItems, activeStagingMenuItems]
    );

    const flexMenuItems = useMemo(
        () => flexMainMenuEntries
            .filter(flexMainMenuEntry => flexMainMenuEntry.language === selectedExtLanguageCode)
            .filter(flexMainMenuEntry => flexMainMenuEntry.type === mainMenuItemsKey)
            .map(
                flexMainMenuEntry =>
                ({
                    title: flexMainMenuEntry?.title,
                    icon: flexMainMenuEntry?.icon,
                    ...(
                        flexMainMenuEntry?.url
                            ? { url: flexMainMenuEntry.url }
                            : { view: flexMainMenuEntry?.id }
                    )
                })
            ),
        [flexMainMenuEntries, selectedExtLanguageCode, mainMenuItemsKey]
    )

    return (
        <ScrollView style={styles.container}>
            <MainMenuEntryList
                menuItems={[
                    ...activeMenuItems,
                    ...flexMenuItems,
                ]}
            />
        </ScrollView>
    );
}

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
    };


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

        this.styles = StyleSheet.create(this.styles);

        // ------------------------------------------------------------------------

        const { appSettings } = this.props.theme;
        const menuRoutes = appSettings.mainMenu.routes;
        if (menuRoutes) {
            this.state.routes = menuRoutes;
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.setState({ developCounter: 0 });
        });
    }

    _hideDevDialog = () => {
        this.setState({ isDevelopMenuVisible: false });
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

        const {
            t,
            theme: { themeStyles, colors },
            settings: { settingsDevelop: { useStaging } } } = this.props;
        const {
            developCounter
        } = this.state;

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                <AppbarComponent title={t('menu:title')} {...this.props}
                    rightAction={
                        <>
                            {useStaging ? <Text>Server: Staging</Text> : null}
                            <Appbar.Action icon={developCounter >= 10 ? 'grid' : undefined} onPress={this._handlePressDevelop.bind(this)} />
                        </>
                    }
                />
                {this.state.routes && <TabView
                    style={this.props.style}
                    navigationState={this.state}
                    renderTabBar={MainMenuTabbar}
                    renderScene={(props) => <MainMenuScene {...props} />}
                    onIndexChange={index => this.setState({ index })}
                />}
                <DevelopmentDialog
                    visible={this.state.isDevelopMenuVisible}
                    onDismiss={this._hideDevDialog}
                />
            </SafeAreaView>
        );
    }

    _handlePressDevelop = () => {
        if (this.state.developCounter >= 10) {
            this.setState({ isDevelopMenuVisible: true });
        }
        this.setState({ developCounter: this.state.developCounter + 1 });
    }
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.mainMenu.component,
        pluginStyles: state.pluginReducer.mainMenu.styles,
        settings: state.settingReducer
    };
};

export default connect(mapStateToProps, { onUpdateRefreshing })(withTranslation()(withTheme(MainMenuView)))
