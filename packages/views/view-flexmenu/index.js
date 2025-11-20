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

import { useMemo } from 'react';
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

import AppbarComponent from '@openasist/component-app-bar';
import IconsOpenasist from '@openasist/icons-openasist';
import FlexMenuEntry from '@openasist/component-flex-menu-entry';

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
 * @param {object} props.route Eigenschaften, welche durch das Navigationsframework übergeben werden: {@link https://reactnavigation.org/docs/params}
 * @param {string} [props.route.mainMenuEntry] ID des Hauptmenüeintrag, dessen Kinder anzuzeigen sind
 */
function FlexMenuView(props) {
    const componentName = FlexMenuView.name;
    const {
        route,
    } = props;

    const menuType = props?.menuType ?? route?.params?.menuType;
    const menuEntries = props.menuEntries ?? [];
    const view = props?.view ?? route.params.view;

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

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    // Bestimmen des Hauptmenüeintrages dieser View
    // Zuerst wird der Hauptmenüeintrag es den Navigationsparametern entnommen
    mainMenuEntry = route?.params?.mainMenuEntry ?? null;
    // Ist der Hauptmenüeintrag nicht in den Navigationsparametern enthalten gewesen, aber dennoch ist ein Menütyp vergeben, wird der Hauptmenüeintrag aus allen Menueinträgen bestimmt
    if (mainMenuEntry === null && menuType !== null) {
        // Der Hauptmenüeintrag ist ein Eintrag ohne einen Elterneintrag, mit dem übergenen Menütyp und der eingestellten Sprache
        mainMenuEntry = menuEntries
            // Es werden alle Menüeintrage behalten, die dem Menütyp entsprechen
            .filter(menuEntry => menuEntry.type === menuType)
            // Es werden alle Menüeintrage behalten, die der eingestellten Sprache entsprechen
            .filter(menuEntry => (menuEntry.language ?? null) === menuEntriesLanguage)
            // Aus den nicht ausgefilterten Menüeinträgen wird eine Eintrag genommen, der kein Elterneintrag besitzt
            .find(menuEntry => (menuEntry.parentMenuEntry ?? null) === null);
    }

    // Ids der Untermenüpunkte aus den Ressource-links herausholen
    const childMenuEntryIds = mainMenuEntry
        ?.subMenuEntries
        ?.map(
            subMenuLinkId =>
                // Der Link des Untermenüpunktes wird in seine Segmente aufgesplitted und das letzte Segment mit Inhalt als ID verwendet
                subMenuLinkId
                    // Aufsplitten der URL in seine Segmente
                    .split('/')
                    // Entfernen aller 'leeren' Segmenente
                    .filter(urlSegment => urlSegment !== '')
                    // Nehmen des letzten Elements
                    .pop()
        )
        ?? [];

    childMenuEntries = childMenuEntryIds
        .map(childMenuEntryId => menuEntries.find(menuEntry => menuEntry.id === childMenuEntryId))
        .filter(menuEntry => (menuEntry ?? null) !== null);

    return (
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            <AppbarComponent {...props} title={mainMenuEntry?.title} />
            <View style={themeStyles.container}>
                <FlatList
                    data={
                        Array.isArray(childMenuEntries)
                            ? childMenuEntries
                            : []
                    }
                    renderItem={
                        ({ item: menuEntry }) => {
                            let menuEntryOnPress;
                            switch (menuEntry.openIn) {
                                case 'webview':
                                    menuEntryOnPress = () => { navigation.push('FlexMenuWebView', { url: menuEntry.url, item: menuEntry }) };
                                    break;
                                case 'webbrowser':
                                case 'browser':
                                    menuEntryOnPress = () => {
                                        Linking.canOpenURL(menuEntry.url)
                                            .then(supported => {
                                                if (supported) {
                                                    Linking.openURL(menuEntry.url);
                                                } else {
                                                    console.debug(componentName, ':', 'Can not open', menuEntry?.url);
                                                }
                                            });
                                    }
                                    break;
                                case null:
                                    menuEntryOnPress = () => { navigation.push(view, { mainMenuEntry: menuEntry, view: view }) };
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

export default connect(mapStateToProps)(FlexMenuView)
