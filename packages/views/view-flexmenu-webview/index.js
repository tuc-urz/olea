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

import { useMemo, useState, useCallback, useRef } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    BackHandler,
    Platform,
} from 'react-native';

import { Appbar, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

import AppbarComponent from "@openasist/component-app-bar";
import IconsOpenasist from '@openasist/icons-openasist';

import componentStyles from "./styles";

/**
 * Corona Info View
 *
 * The home screen of the app. Shows different informations like the top news, weather,
 * current mensa menus and informations of the next course (if the student has imported his timtetable)
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
export default function FlexMenuWebView({ route, ...props }) {
    const theme = useTheme();
    const { colors, themeStyles } = theme;
    const { t } = useTranslation();
    const flexMenuEntry = route?.params?.item ?? props?.item;

    const webviewURL = route?.params?.url ?? props?.url;
    const webviewTitle = flexMenuEntry.title;

    const webview = useRef(null);
    const [webviewCanGoBack, setWebviewCanGoBack] = useState();

    /**
     * Erstellen einer Liste von erlauben Hosts, die in der Webview verwendet werden dürfen.
     * In der Liste ist nur ein Host, welcher aus der anzuzeigenden URL extrahiert wird.
     *
     * Unter iOS wird der `undefined`-Wert verwendet.
     * Wird in der Webseite eine Ressource von einem anderem Host eingebunden, öffnet es die Ressource im Browser, weil der Dritthost nicht erlaubt ist.
     * Somit führen zum Beispiel eingebundene Youtube-Videos zu einem öffnen des Videos im Browser.
     *
     * @type {string[]|undefined}
     */
    const webviewOriginWhitelist = useMemo(
        () => {
            // URL-String in URL-Instanze konvertieren
            const url = new URL(webviewURL);
            // Host/Origin aus URL extrahieren
            const webviewURLOrigin = url.origin;

            // Auswahl das Rückgabewerted abhängig vond der Plattform
            // Standartmäßig wird eine Liste mit dem Host der URL zurückgegeben
            // Unter iOS wird undefined zurückgegeben
            return Platform.select({
                default: [webviewURLOrigin],
                ios: undefined,
            });
        },
        [webviewURL]
    );

    // Styles of this component
    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    )

    useFocusEffect(
        useCallback(
            () => {
                const onBackPress = webviewCanGoBack && webview?.current
                    ? () => {
                        webview?.current?.goBack();
                        return true;
                    }
                    : () => {
                        props?.navigation?.goBack();
                        return true;
                    }

                const subscription = BackHandler.addEventListener(
                    'hardwareBackPress',
                    onBackPress
                );

                return () => subscription.remove();
            },
            [webviewCanGoBack]
        )
    );

    return (
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            <AppbarComponent {...props}
                title={t(webviewTitle)}
                leftAction={
                    <Appbar.Action
                        icon={props => <IconsOpenasist {...props} icon={'back'} color={colors.primaryText} />}
                        onPress={
                            webviewCanGoBack
                                ? webview?.current?.goBack
                                : props?.navigation?.goBack
                        }
                        accessible={true}
                        accessibilityLabel={
                            webviewCanGoBack
                                ? t('accessibility:appbar.navigateBack')
                                : t('accessibility:appbar.back')
                        }
                    />
                }
                rightAction={
                    <Appbar.Action
                        icon="refresh"
                        onPress={webview?.current?.reload}
                        accessible={true}
                        accessibilityLabel={t('accessibility:appbar.reload')}
                    />
                }
            />
            <WebView
                ref={webview}
                source={{ uri: webviewURL }}
                startInLoadingState={true}
                allowsFullscreenVideo={true}
                allowsInlineMediaPlayback={true}
                originWhitelist={webviewOriginWhitelist}
                renderLoading={
                    () =>
                        <ActivityIndicator
                            style={styles.activity}
                            size='large'
                            color={colors.loadingIndicator}
                        />
                }
                onLoad={
                    syntheticEvent =>
                        setWebviewCanGoBack(syntheticEvent?.nativeEvent?.canGoBack ?? false)
                }
            />
        </SafeAreaView>
    );
}