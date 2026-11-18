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
    useState,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import {
    AccessibilityInfo,
    Alert,
    Animated,
    Easing,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { useTheme, Text, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import AppbarComponent from '../../components/AppBar';
import { useUser } from '../../context/context-user';

import componentStyles from './styles';

/**
 * Dauer eines Durchlaufs des Hologramm-Streifens über den Ausweis in Millisekunden.
 */
const shineAnimationDuration = 3500;

/**
 * Pause zwischen zwei Durchläufen des Hologramm-Streifens in Millisekunden.
 */
const shineAnimationPause = 1000;

/**
 * Breite des Hologramm-Streifens in Pixeln.
 */
const shineWidth = 60;

/**
 * Kantenlänge des Hochschullogos im Kopfbereich des Ausweises in Pixeln.
 */
const institutionLogoSize = 48;

/**
 * Ermittelt die Initialen des Nutzers für den Avatar-Platzhalter.
 * Es werden bevorzugt Vor- und Nachname verwendet, ansonsten der Anzeigename.
 *
 * @param {import('../../context/context-user').User|null} user Angemeldeter Nutzer
 * @returns {string} Initialen in Großbuchstaben, z.B. "MM" für "Max Mustermann", oder ein leerer String
 * @example
 * getInitials({ given_name: 'Max', family_name: 'Mustermann' }); // "MM"
 */
function getInitials(user) {
    const nameParts = user?.given_name || user?.family_name
        ? [user?.given_name, user?.family_name]
        : (user?.name ?? '').split(' ');

    return nameParts
        .filter(namePart => namePart)
        .map(namePart => namePart.trim().charAt(0))
        // Bei mehreren Vornamen sollen nur die erste und letzte Initiale angezeigt werden.
        .filter((initial, index, initials) => index === 0 || index === initials.length - 1)
        .join('')
        .toUpperCase();
}

/**
 * Ermittelt den anzuzeigenden Namen des Nutzers.
 * Ist kein Anzeigename vorhanden, wird der Name aus Vor- und Nachname zusammengesetzt.
 *
 * @param {import('../../context/context-user').User|null} user Angemeldeter Nutzer
 * @returns {string|null} Name des Nutzers oder null, wenn kein Name vorhanden ist
 */
function getDisplayName(user) {
    const composedName = [user?.given_name, user?.family_name]
        .filter(namePart => namePart)
        .join(' ');

    return user?.name || composedName || null;
}

/**
 * Zeigt ein Feld des Ausweises bestehend aus Bezeichnung und Wert(en) an.
 * Sind keine Werte vorhanden, wird das Feld nicht angezeigt.
 *
 * @param {Object} props
 * @param {string} props.label Bezeichnung des Feldes
 * @param {string|string[]|null|undefined} props.value Anzuzeigender Wert oder Liste von Werten
 * @param {Object} props.styles Stylesheet des Ausweises
 */
function IdCardField({ label, value, styles }) {
    const values = (Array.isArray(value) ? value : [value])
        .filter(singleValue => singleValue !== null && singleValue !== undefined && `${singleValue}`.trim() !== '');

    if (values.length === 0) {
        return null;
    }

    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel}>
                {label}
            </Text>
            {
                values.map(
                    singleValue =>
                        <Text key={singleValue} style={styles.fieldValue}>
                            {singleValue}
                        </Text>
                )
            }
        </View>
    );
}

/**
 * Animierter, halbtransparenter Hologramm-Streifen, der in regelmäßigen Abständen über den Ausweis läuft.
 * Das Live-Element zeigt bei einer Kontrolle auf einen Blick, dass der Ausweis in der App angezeigt wird
 * und es sich nicht um einen Screenshot handelt.
 *
 * Ist in den Systemeinstellungen "Bewegung reduzieren" aktiviert, wird der Streifen nicht animiert.
 * Der Streifen ist rein dekorativ und wird vor Screenreadern verborgen.
 *
 * @param {Object} props
 * @param {number} props.cardWidth Breite des Ausweises in Pixeln, über die der Streifen laufen soll
 * @param {Object} props.styles Stylesheet des Ausweises
 */
function IdCardShine({ cardWidth, styles }) {
    const componentName = IdCardShine.name;
    const animationProgress = useRef(new Animated.Value(0)).current;
    const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);

    // Systemeinstellung "Bewegung reduzieren" abfragen und auf Änderungen reagieren
    useEffect(
        () => {
            AccessibilityInfo.isReduceMotionEnabled()
                .then(setIsReduceMotionEnabled)
                .catch(reason => console.debug(componentName, ':', 'reduce motion setting not available', ':', reason));

            const reduceMotionSubscription = AccessibilityInfo.addEventListener(
                'reduceMotionChanged',
                setIsReduceMotionEnabled
            );

            return () => {
                reduceMotionSubscription?.remove();
            };
        },
        []
    );

    // Endlosanimation starten, sobald die Breite des Ausweises bekannt ist
    useEffect(
        () => {
            if (!cardWidth || isReduceMotionEnabled) {
                animationProgress.setValue(0);
                return undefined;
            }

            const shineAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(
                        animationProgress,
                        {
                            toValue: 1,
                            duration: shineAnimationDuration,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }
                    ),
                    Animated.delay(shineAnimationPause),
                ])
            );
            shineAnimation.start();

            return () => {
                shineAnimation.stop();
            };
        },
        [cardWidth, isReduceMotionEnabled, animationProgress]
    );

    if (!cardWidth || isReduceMotionEnabled) {
        return null;
    }

    const translateX = animationProgress.interpolate({
        inputRange: [0, 1],
        // Der Streifen startet links außerhalb des Ausweises und endet rechts außerhalb
        outputRange: [-2 * shineWidth, cardWidth + shineWidth],
    });

    return (
        <Animated.View
            pointerEvents='none'
            accessible={false}
            accessibilityElementsHidden={true}
            importantForAccessibility='no-hide-descendants'
            style={[
                styles.shine,
                {
                    width: shineWidth,
                    transform: [
                        { translateX },
                        { rotate: '20deg' },
                    ],
                },
            ]}
        />
    );
}

/**
 * View zum Anzeigen eines digitalen Hochschulausweises.
 *
 * Der Ausweis kann von allen Hochschulangehörigen (Studierende, Mitarbeitende, sonstige Angehörige) genutzt werden.
 * Die angezeigten Daten stammen ausschließlich aus dem Login des Nutzers (siehe {@link useUser}).
 * Die Bezeichnung und das Logo der Hochschule werden aus den globalen App-Einstellungen
 * (`appSettings.institution`) gelesen.
 *
 * @param {Object} props Eigenschaften der View, werden an die Appbar weitergereicht
 */
export default function IdCardView(props) {
    const componentName = IdCardView.name;
    // Theme aus dem Theme-Kontext holen
    const theme = useTheme();
    const { themeStyles } = theme;
    // Übersetzungsfunktion holen
    const { t } = useTranslation();

    const [user, login] = useUser();

    // Globale Angaben zur Hochschule aus den App-Einstellungen
    const institutionName = theme?.appSettings?.institution?.name ?? null;
    const InstitutionLogo = theme?.appSettings?.institution?.logo ?? null;

    // Breite des Ausweises, wird für die Animation des Hologramm-Streifens benötigt
    const [cardWidth, setCardWidth] = useState(0);

    // Stylesheet nur bei Änderungen des Themes neu erzeugen
    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    const displayName = getDisplayName(user);
    const initials = getInitials(user);
    // Angehörigkeitsstatus übersetzen, unbekannte Status werden unverändert angezeigt
    const memberTypes = user?.member_types
        ?.map(memberType => t(`user:memberType.${memberType}`, { defaultValue: memberType }))
        ?? [];
    const organizationalUnits = user?.organizational_units
        ?.map(organizationalUnit => organizationalUnit?.name)
        ?? [];

    // Login starten, bei Fehlern wird der Nutzer per Dialog informiert
    const onLoginPress = () =>
        login
            ? login()
                .catch(
                    reason => {
                        console.debug(componentName, ':', 'login failed', ':', reason);
                        Alert.alert(
                            t('user:loginFailed'),
                            t('user:tryLoginAgain'),
                        );
                    }
                )
            : Alert.alert(
                t('user:connectionError'),
                t('user:connectionErrorTryLoginAgain'),
            );

    return (
        // SafeAreaView rendert den Inhalt innerhalb des sicheren Bereichs des Gerätes
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            <AppbarComponent {...props} title={t('idcard:title')} />

            <View accessible={false} style={themeStyles.container}>
                {
                    user
                        ? <ScrollView contentContainerStyle={styles.scrollContent}>
                            <View
                                style={styles.card}
                                onLayout={event => setCardWidth(event.nativeEvent.layout.width)}
                            >
                                {/* Kopfbereich mit Logo und Name der Hochschule */}
                                <View style={styles.cardHeader} accessibilityRole='header'>
                                    {
                                        InstitutionLogo
                                            ? <InstitutionLogo
                                                width={institutionLogoSize}
                                                height={institutionLogoSize}
                                            />
                                            : null
                                    }
                                    <View style={styles.cardHeaderText}>
                                        {
                                            institutionName
                                                ? <Text style={styles.institutionName}>
                                                    {institutionName}
                                                </Text>
                                                : null
                                        }
                                        <Text style={styles.cardTitle}>
                                            {t('idcard:title')}
                                        </Text>
                                    </View>
                                </View>

                                {/* Inhalt mit Avatar und Angaben zum Nutzer */}
                                <View style={styles.cardBody}>
                                    <View
                                        style={styles.avatar}
                                        accessible={true}
                                        accessibilityRole='image'
                                        accessibilityLabel={t('accessibility:idcard.avatar')}
                                    >
                                        <Text style={styles.avatarText}>
                                            {initials}
                                        </Text>
                                    </View>

                                    <View style={styles.fields}>
                                        <IdCardField
                                            label={t('user:name')}
                                            value={displayName}
                                            styles={styles}
                                        />
                                        <IdCardField
                                            label={t('user:memberTypes')}
                                            value={memberTypes}
                                            styles={styles}
                                        />
                                        {/* Matrikelnummer wird nur angezeigt, wenn sie vom Login geliefert wird */}
                                        <IdCardField
                                            label={t('user:matriculationNumber')}
                                            value={user?.matriculation_number}
                                            styles={styles}
                                        />
                                        <IdCardField
                                            label={t('user:organizationalUnits')}
                                            value={organizationalUnits}
                                            styles={styles}
                                        />
                                        <IdCardField
                                            label={t('user:email')}
                                            value={user?.email}
                                            styles={styles}
                                        />
                                    </View>
                                </View>

                                {/* Live-Element: animierter Hologramm-Streifen */}
                                <IdCardShine cardWidth={cardWidth} styles={styles} />
                            </View>
                        </ScrollView>
                        : <View style={styles.notLoggedInContainer}>
                            <Text style={styles.notLoggedInText}>
                                {t('user:notLoggedIn')}
                            </Text>
                            <Button onPress={onLoginPress}>
                                {t('user:logginButton')}
                            </Button>
                        </View>
                }
            </View>
        </SafeAreaView>
    );
}
