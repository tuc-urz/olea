import React from 'react';
import { Alert, Appearance, AppState, Linking, StatusBar } from 'react-native';

import { connect } from 'react-redux'
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
import { DataService, RootNavigation, store } from '@olea-bps/base';

import i18n from './i18n/i18n';
import { getTheme } from './constants/Theme';
import MainTabNavigator from './navigation/MainTabNavigator';

import { CanteenContextProvider } from '@olea-bps/base'
import { TimetableContextProvider } from '@olea-bps/base';
import { ConnectivityContextProvider } from '@olea-bps/base';
import { NewsContextProvider } from '@olea-bps/base';

import settings from './constants/Settings';
import { withTranslation } from 'react-i18next';

class Main extends React.Component {
    state = {
        appState: AppState.currentState,
        refreshInterval: null,
        theme: getTheme(false, false)
    };

    dataService = null;

    currentHighContrastValue;
    currentIncreaseFontSizeValue;
    appChangeSubscriber;
    handleNavigationReady = RootNavigation.triggerNavigationReady;
    appearanceSubscriber;
    currentSystemColorScheme = Appearance.getColorScheme();
    currentDarkValue;

    constructor() {
        super();

        this.dataService = new DataService;
        this.dataService.refresh();
    }

    componentDidMount() {
        this.checkLanguage();
        this.getThemeSettings();
        this.appearanceSubscriber = Appearance.addChangeListener(
            ({ colorScheme }) => {
                this.currentSystemColorScheme = colorScheme;
                this.getThemeSettings();
            }
        );

        // this.checkPushMessage();

        this.appChangeSubscriber = AppState.addEventListener('change', this._handleAppStateChange);

        // TODO Remove when deeplink prefix is determined
        Linking.addEventListener('url', (url) => {
            const isDev = store.getState().settingReducer?.settingsDevelop?.showDeeplinkAlert;
            if (isDev) {
                Alert.alert('Entwicklermodus', `URL des Deep Links:\n${url.url}`);
            }
        });

        // TODO Remove when deeplink prefix is determined
        Linking.getInitialURL().then((url) => {
            const isDev = store.getState().settingReducer?.settingsDevelop?.showDeeplinkAlert;
            if (isDev) {
                Alert.alert('Entwicklermodus Init', `URL des Deep Links:\n${url}`);
            }
        });
    }

    componentDidUpdate() {
        this.checkLanguage();
        this.getThemeSettings();
    }

    componentWillUnmount() {
        if (this.appChangeSubscriber) {
            this.appChangeSubscriber.remove();
        }
        if (this.appearanceSubscriber) {
            this.appearanceSubscriber.remove();
        }
    }

    checkLanguage() {
        const { settingsGeneral } = this.props;
        let lang = settingsGeneral.language;

        // Prevent invalid language
        if (settings.languages.map(l => l.code).includes(lang) === false) {
            lang = 'en';
        }

        if (i18n.language !== lang) {
            i18n.changeLanguage(lang).then(() => {
                if (this.dataService) {
                    this.dataService.refresh();
                }
            });
        }
    }

    getThemeSettings() {
        const { settingsAccessibility, settingsGeneral } = this.props;

        const colorScheme = ['system', 'light', 'dark'].includes(
            settingsGeneral?.colorScheme
        )
            ? settingsGeneral.colorScheme
            : 'light';

        const dark = colorScheme === 'dark'
            || (
                colorScheme === 'system'
                && this.currentSystemColorScheme === 'dark'
            );

        if (
            this.currentHighContrastValue !== settingsAccessibility.highContrast
            || this.currentIncreaseFontSizeValue !== settingsAccessibility.increaseFontSize
            || this.currentDarkValue !== dark
        ) {
            this.currentHighContrastValue = settingsAccessibility.highContrast;
            this.currentIncreaseFontSizeValue = settingsAccessibility.increaseFontSize;
            this.currentDarkValue = dark;

            this.setState({
                theme: getTheme(
                    this.currentHighContrastValue,
                    this.currentIncreaseFontSizeValue,
                    dark
                )
            });
        }
    }

    /**
     * App State has change (inactive, background or foreground)
     *
     * @param nextAppState
     * @private
     */
    _handleAppStateChange = nextAppState => {
        if (nextAppState === 'active') {
            this.currentSystemColorScheme = Appearance.getColorScheme();
            this.getThemeSettings();
            if (this.state.refreshInterval) {
                clearInterval(this.state.refreshInterval);
                this.setState({ refreshInterval: null });
            }

            if (this.dataService) {
                this.dataService.refresh();
            }

            const refreshInterval = setInterval(() => {
                if (this.dataService) {
                    this.dataService.refresh();
                }
            }, 30000); // Refresh after 30 sek
            this.setState({ refreshInterval });
        }
    };

    render() {
        return (
            <PaperProvider theme={this.state.theme}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={this.state.theme.colors.safeAreaBackground}
                />
                <NavigationContainer ref={RootNavigation.navigationRef} linking={settings.deepLinking} onReady={this.handleNavigationReady}>
                    <ConnectivityContextProvider>
                        <TimetableContextProvider>
                            <CanteenContextProvider>
                                <NewsContextProvider>
                                    <MainTabNavigator colors={this.state.theme.colors.tabs} />
                                </NewsContextProvider>
                            </CanteenContextProvider>
                        </TimetableContextProvider>
                    </ConnectivityContextProvider>
                </NavigationContainer>
            </PaperProvider>
        );
    }
}

const mapStateToProps = (state) => ({
    settingsAccessibility: state.settingReducer.settingsAccessibility,
    settingsGeneral: state.settingReducer.settingsGeneral
});

export default connect(mapStateToProps)(withTranslation()(Main));
