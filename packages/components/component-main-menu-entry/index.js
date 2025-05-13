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


import { View, TouchableOpacity, Text, StyleSheet, TouchableNativeFeedback } from 'react-native'

import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import IconsOpenasist from '@olea/icons-openasist';

import componentStyles from './styles';

/**
 * Ein einzelner Eintrag im Hauptmenü, welcher beim draufdrücken eine View oder URL öffnet.
 * Ein Eintrag wird mit einem Icon und einem Titel dargestellt.
 *
 * Soll eine View geöffnet werden, muss die `view`-Eigenschaft mit dem Namen der View gesetzt werden.
 * Ist URL in einer Webview zu öffnen, ist die `url`-Eigenschaft mit der zu öffnenden URL oder einem Übersetzungsschlüssel zu setzen.
 * Wird ein Übersetzungsschlüssel in die `url`-Eigenschaft hinterlegt, muss die `isLocalized`Eigenschaft auf true gesetzt werden.
 * Die Webview wird mit dem Titel des Eintrags initialisert.
 *
 * Für die Eigenschaften icon, iconSVG und iconSize siehe {@link IconsOpenasist}.
 *
 * @param {object}  props
 * @param {string}  props.title Titel des Menüeintrages. Dies kann der direkte Titel oder ein Übersetungsschlüssel sein
 * @param {string}  [props.view] Name der View, zu der gewechselt werden soll
 * @param {string}  [props.url] URL, welche in einer Webview geöffnet werde soll
 * @param {boolean} [props.isLocalized] Soll der URL-String durch die Übersetzung gegeben werden, um die entgültige URL zu bekommen
 * @param {string}  [props.icon] Schlüssel des Icons (siehe {@link IconsOpenasist})
 * @param {string}  [props.iconSvg] siehe {@link IconsOpenasist}
 * @param {number}  [props.iconSize] Größe des Icons (siehe {@link IconsOpenasist})
 */
export default function MainMenuEntry({ title, icon, iconSVG, iconSize, view, url, isLocalized }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { colors } = theme;
    const navigation = useNavigation();
    const styles = StyleSheet.create(componentStyles(theme));

    const translatedTitle = t(title);

    return (
        <TouchableOpacity
            style={styles.entry}
            background={TouchableNativeFeedback.Ripple(colors.background, false)}
            onPress={
                () => {
                    if (view) {
                        navigation.navigate(view);
                    } else if (url) {
                        navigation.navigate(
                            'Web',
                            {
                                title: translatedTitle,

                                // Is isLocalized is true url is localized via i18n files, use the given key to get the correct url
                                url: (isLocalized ?? false)
                                    ? t(url)
                                    : url,
                            }
                        );
                    }
                }
            }>
            <View style={styles.textContainer} accessiblity={true} accessibilityLabel={translatedTitle}>
                <View style={styles.iconContainer}>
                    <IconsOpenasist icon={icon} iconSVG={iconSVG} color={colors.iconDefault} size={iconSize ?? 34} />
                </View>
                <Text style={styles.titleText}>
                    {translatedTitle}
                </Text>
            </View>
        </TouchableOpacity>
    )
}