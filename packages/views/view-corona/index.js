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
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    FlatList,
    Linking
} from 'react-native';

import { connect } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import AppbarComponent from '@olea/component-app-bar';
import IconsOpenasist from '@olea/icons-openasist';
import ViewCoronaDetail from '@olea/view-corona-detail';
import FlexMenuEntry from '@olea/component-flex-menu-entry';

import componentStyles from './styles';

/**
 * Diese View zeigt eine Ebene von Menüeintragen des Flex-Menüs an.
 *
 * Es sollte mindestens ein Menütyp(props.menuType) über die Eigenschaften oder ein Hauptmenüeintrag(props.route.mainMenuEntry) übergeben werden.
 * Wird ein Menütyp übergeben, wird der Hauptmenüeintrag des Menütypes gesucht und die Kindermenüeintrage angezeigt.
 * Wird ein Hauptmenüeintrag bzw. Elternmenüeintrag übergeben, werden dessen Kindereinträge angezeigt.
 * Der Hauptmenüeintrag wird über das Navigationsframework übergeben, weshalb dieser in der 'route'-Eigenschaft zu finden ist.
 * Somit werden meherer Menüebenen unterstützt.
 *
 * Die View heißt aus historischen Gründen CoronaView und sollte zeitnah sinvoll umbennant werden
 *
 * @param {object} props
 * @param {string} [props.menuType] Menütyp, dessen erste Menüebene angezeigt werden soll
 * @param {object} props.route Eigenschaften, welche durch das Navagationsframework übergeben werden: {@link https://reactnavigation.org/docs/params}
 * @param {string} [props.route.mainMenuEntry] ID des Hauptmenüeintrag, dessen Kinder anzuzeigen sind
 */
function CoronaView(props) {
    const {
        route,
        menuType,
    } = props;

    const menuEntries = props.menuEntries ?? [];

    const theme = useTheme();
    const { themeStyles, paddings, colors, appSettings } = theme;
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();

    const languages = appSettings?.languages;
    // Eingestellte Sprache aus der Übersetzung holen
    const selectedLanguage = i18n.language;
    // Hinterlegte Sprachen durchgehen und nach dem erweiterten Sprachcode holen
    const menuEntriesLanguage = languages
        // Finde die derzeitige eingestellte Sprache
        .find(language => language?.code === selectedLanguage)
        // Erweiterten Sprachcode von der gefundenen Sprache auslesen
        ?.extCode;

    let mainMenuEntry;
    let childMenuEntries;

    const styles = StyleSheet.create(componentStyles(theme));

    mainMenuEntry = route?.params?.mainMenuEntry ?? null;
    if (mainMenuEntry === null && menuType !== null) {
        mainMenuEntry = menuEntries
            .filter(menuEntry => menuEntry.type === menuType)
            .filter(menuEntry => (menuEntry.language ?? null) === menuEntriesLanguage)
            .find(menuEntry => (menuEntry.parentMenuEntry ?? null) === null);
    }

    let childMenuEntryIds = mainMenuEntry?.subMenuEntries?.map(subMenuLinkId => subMenuLinkId.split('/').filter(urlSegment => urlSegment !== '').pop()) ?? [];
    childMenuEntries = childMenuEntryIds
        .map(childMenuEntryId => menuEntries.find(menuEntry => menuEntry.id === childMenuEntryId))
        .filter(menuEntry => (menuEntry ?? null) !== null);

    if ((!childMenuEntries || childMenuEntries.length === 0)
        && mainMenuEntry && mainMenuEntry['parentMenuEntry'] === null
        && mainMenuEntry['subMenuEntries'].length === 0 && mainMenuEntry['openIn'] === 'webview') {
        return <ViewCoronaDetail {...props} url={mainMenuEntry.url} item={mainMenuEntry} useBackButton={true} />
    }

    return (
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            <AppbarComponent {...props} title={mainMenuEntry?.title} />
            <View style={themeStyles.container}>
                <FlatList
                    data={Array.isArray(childMenuEntries) ? childMenuEntries ?? [] : []}
                    renderItem={
                        ({ item: menuEntry }) => {
                            let menuEntryOnPress;
                            switch (menuEntry.openIn) {
                                case 'webview':
                                    menuEntryOnPress = () => { navigation.navigate('CoronaDetail', { url: menuEntry.url, item: menuEntry }) };
                                    break;
                                case 'webbrowser':
                                case 'browser':
                                    menuEntryOnPress = () => {
                                        Linking.canOpenURL(menuEntry.url)
                                            .then(supported => {
                                                if (supported) {
                                                    Linking.openURL(menuEntry.url);
                                                } else {
                                                    console.error(`Can not open ${menuEntry.url}.`)
                                                }
                                            });
                                    }
                                    break;
                                case null:
                                    menuEntryOnPress = () => { navigation.push('Corona', { mainMenuEntry: menuEntry, corona: props.corona }) };
                                    break;
                            }

                            return (
                                <FlexMenuEntry
                                    title={menuEntry?.title}
                                    description={menuEntry?.description}
                                    iconImage={menuEntry?.image}
                                    onPress={menuEntryOnPress}
                                />
                            );
                        }
                    }
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: paddings.default }}
                    ListEmptyComponent={
                        <View style={[styles.containerInner, styles.containerErrorMsg]}>
                            <IconsOpenasist icon={'info'} size={48} color={colors.primary} />
                            <Text style={styles.title}>{t('corona:menuEntriesNotAvailable')}</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const mapStateToProps = state => {
    return {
        menuEntries: state.apiReducer.menuEntries,
    };
};

export default connect(mapStateToProps)(CoronaView)
