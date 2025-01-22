import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';

import { I18nextProvider } from 'react-i18next';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux'

import {store, onSettingAPI} from '@openasist/core'

import settings from './constants/Settings';
import i18n from './i18n/i18n';

import * as Sentry from 'sentry-expo';
import Main from './Main';

Sentry.init({
    dsn: 'https://bafbb42d6530512b4834edf5f0752f65@sentry.codeculture.de/17',
    enableInExpoDevelopment: false,
    debug: false,
});
// Example Plugin
//import TopNewsPlugin from '@openasist/plugin-top-news';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default class App extends React.Component {
    state = {
        isLoadingComplete: false,
        refreshInterval: null
    };

    constructor(){
        super();
        this._loadResourcesAsync();
    }


    render() {
        if (this.state.isLoadingComplete || this.props.skipLoadingScreen) {

            return (
                <SafeAreaProvider>
                    <I18nextProvider i18n={i18n}>
                        <ReduxProvider store={store}>
                            <Main/>
                        </ReduxProvider>
                    </I18nextProvider>
                </SafeAreaProvider>
            );
        }
    }

    _loadResourcesAsync = () => {
        Promise.all([
            Asset.loadAsync([
                //require('./assets/images/robot-dev.png'),
            ]),
            Font.loadAsync({
                ...Icon.Ionicons.font,
                'poppins-regular':    require('./assets/fonts/Poppins-Regular.ttf'),
                'poppins-semi-bold':  require('./assets/fonts/Poppins-SemiBold.ttf'),
                'poppins-bold':       require('./assets/fonts/Poppins-Bold.ttf'),
                'openasist':                  require('./assets/fonts/openasist-wl-app.ttf')
            }),
        ]).then(async () => {await this._handleFinishLoading()});
    };


    _handleFinishLoading = async () => {
        this.setState({ isLoadingComplete: true });
        store.dispatch(onSettingAPI('api', settings.api));
        this._initializePlugins();

        await SplashScreen.hideAsync();
    };

    /**
     * These function will initialize all required plugins
     */
    _initializePlugins= () => {
        store.dispatch({type: 'RESET_STATE'});
        //new TopNewsPlugin();
    };

}
