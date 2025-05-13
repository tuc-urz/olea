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

import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';

import { useTheme } from 'react-native-paper';

import IconsOpenasist from '@olea/icons-openasist';

import componentStyles from './styles';

/**
 * Menüeintrag für das FlexMenü-Modul.
 * Zeigt einen Entrag mit einem Titel, einer optionalen Beshreibung, ein optionales linksbündiges Icon und ein rechtsbündiges Icon.
 *
 * Wird kein rechtsbündiges Icon(rightIcon) festgelegt, wird automatisch das Icon für "forward" verwendet.
 *
 * @param {object} props
 * @param {string} props.title Titel des Eintrages
 * @param {string} [props.description] Beschreibung des Eintrages
 * @param {string} [props.leftIconImage] URL oder URI der linksbündigen Icons
 * @param {string} [props.rightIcon] Bezeichner des rechtsbündigen Icons
 * @param {(event: GestureResponderEvent) => void} [props.onPress] Callback-Funktion die beim drücken des Eintrages ausgeführt wird. (Siehe: {@link https://reactnative.dev/docs/pressable#onpress})
 */
export default function FlexMenuEntry({ title, description, leftIconImage, rightIcon, onPress }) {
    const theme = useTheme();
    const { themeStyles, colors, appSettings } = theme;

    const styles = componentStyles(theme);

    return (
        <TouchableOpacity
            role='button'
            style={themeStyles.card}
            onPress={onPress}
            aria-label={
                // Wen eine Beschreibung vorhanden ist, bilde aus Titel und Beschreibung einen Vorlesetext, ansonsten verwende nur den Titel
                description
                    // Title und Beschreibung wird mit einer newline(\n) verbunden, damit eine Pause beim Vorlesen gelassen wird
                    ? `${title} \n ${description}`
                    : title
            }
        >
            {
                leftIconImage
                    ? <View style={styles.leftIconImage} >
                        <Image
                            style={{ resizeMode: 'contain', width: 30, height: 30 }}
                            source={{ uri: leftIconImage }}
                        />
                    </View>
                    : null
            }
            <View style={[themeStyles.cardContent, styles.cardContent]}>
                <Text style={styles.title}>{title}</Text>
                {
                    description
                        ? <Text style={styles.description}>{description}</Text>
                        : null
                }
            </View>
            <View style={[themeStyles.cardRightIcon]}>
                <IconsOpenasist icon={rightIcon ?? 'forward'} size={25} color={colors.icon} />
            </View>
        </TouchableOpacity>
    )
}