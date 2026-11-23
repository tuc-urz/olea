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
    Alert,
    Animated,
    Easing,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

import { useTheme, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import AppbarComponent from '../../components/AppBar';
import { useUser } from '../../context/context-user';
import { usePublicTransportTicket } from '../../context/context-public-transport-ticket';
import { useReduceMotion } from '../../libraries/accessibility';

import componentStyles from './styles';
import {
    AlertCircleIcon,
    CalendarIcon,
    CheckCircleIcon,
    ChevronRightIcon,
    PersonIcon,
    TrainIcon,
} from './icons';

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
const institutionLogoSize = 24;

/**
 * Bereinigt einen oder mehrere Werte: leere Werte (null, undefined, Leerstring) werden entfernt.
 *
 * @param {string|string[]|null|undefined} value Wert oder Liste von Werten
 * @returns {string[]} Liste der nicht-leeren Werte
 */
function toValues(value) {
    return (Array.isArray(value) ? value : [value])
        .filter(singleValue => singleValue !== null && singleValue !== undefined && `${singleValue}`.trim() !== '')
        .map(singleValue => `${singleValue}`);
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
 * Wandelt das Gültigkeitsdatum des Ausweises in ein Luxon-Datum um.
 *
 * @param {string|undefined} validUntil Datum im ISO-Format, z.B. "2027-03-31"
 * @returns {DateTime|null} Ende des Gültigkeitstages oder null, wenn kein gültiges Datum vorhanden ist
 */
function parseValidUntil(validUntil) {
    if (!validUntil) {
        return null;
    }

    const validUntilDate = DateTime.fromISO(validUntil);

    // Der Ausweis ist bis einschließlich des angegebenen Tages gültig
    return validUntilDate.isValid ? validUntilDate.endOf('day') : null;
}

/**
 * Kachel mit Bezeichnung und Wert(en) unterhalb des Ausweises.
 * Sind keine Werte vorhanden, wird die Kachel nicht angezeigt.
 *
 * @param {Object} props
 * @param {string} props.label Bezeichnung der Kachel
 * @param {string|string[]|null|undefined} props.value Anzuzeigender Wert oder Liste von Werten
 * @param {boolean} [props.large] Wert in größerer Schrift anzeigen (für kurze Werte wie Nummern)
 * @param {Object} props.styles Stylesheet des Ausweises
 */
function IdCardInfoTile({ label, value, large, styles }) {
    const values = toValues(value);

    if (values.length === 0) {
        return null;
    }

    return (
        <View style={styles.infoTile} accessible={true}>
            <Text style={styles.infoTileLabel}>
                {label}
            </Text>
            {
                values.map(
                    singleValue =>
                        <Text key={singleValue} style={large ? styles.infoTileValueLarge : styles.infoTileValue}>
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
    const animationProgress = useRef(new Animated.Value(0)).current;
    // Systemeinstellung "Bewegung reduzieren", Änderungen werden live übernommen
    const isReduceMotionEnabled = useReduceMotion();

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
 * Alle Angaben außer dem Namen sind optional und werden nur angezeigt, wenn sie vom Login geliefert werden.
 *
 * Die Bezeichnung und das Logo der Hochschule werden aus den globalen App-Einstellungen
 * (`appSettings.institution`) gelesen.
 *
 * Liegt über den {@link usePublicTransportTicket ÖPNV-Ticket-Kontext} ein Ticket vor, wird ein Verweis
 * auf die View `PublicTransportTicket` angezeigt. Dafür muss die Hochschul-App den
 * `PublicTransportTicketContextProvider` einbinden und die View unter diesem Namen registrieren.
 *
 * @param {Object} props Eigenschaften der View, werden an die Appbar weitergereicht
 */
export default function IdCardView(props) {
    const componentName = IdCardView.name;
    // Theme aus dem Theme-Kontext holen
    const theme = useTheme();
    const { themeStyles } = theme;
    // Übersetzungsfunktion holen
    const { t, i18n } = useTranslation();

    const navigation = useNavigation();

    const [user, login] = useUser();
    // Ticketdaten sind nur vorhanden, wenn das ÖPNV-Ticket-Modul eingebunden ist und der Nutzer ein Ticket besitzt
    const [ticketBarcode] = usePublicTransportTicket();

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
    // Angehörigkeitsstatus übersetzen, unbekannte Status werden unverändert angezeigt
    const memberTypes = user?.member_types
        ?.map(memberType => t(`user:memberType.${memberType}`, { defaultValue: memberType }))
        ?? [];
    const organizationalUnits = user?.organizational_units
        ?.map(organizationalUnit => organizationalUnit?.name)
        ?? [];
    const studyPrograms = toValues(user?.study_programs);
    const matriculationNumber = toValues(user?.matriculation_number)[0] ?? null;
    const semester = toValues(user?.semester)[0] ?? null;

    // Gültigkeit des Ausweises
    const validUntil = parseValidUntil(user?.valid_until);
    const isValid = validUntil ? validUntil >= DateTime.now() : false;
    const validUntilText = validUntil
        ?.setLocale(i18n.language)
        .toLocaleString({ day: '2-digit', month: '2-digit', year: 'numeric' });
    const reregistrationText = user?.reregistration_confirmed
        ? [t('idcard:reregistrationConfirmed'), semester].filter(text => text).join(' · ')
        : null;

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

    // Zur View des ÖPNV-Tickets wechseln
    const onPublicTransportTicketPress = () => navigation.navigate('PublicTransportTicket');

    return (
        // SafeAreaView rendert den Inhalt innerhalb des sicheren Bereichs des Gerätes
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            <AppbarComponent {...props} title={t('idcard:title')} />

            <View accessible={false} style={themeStyles.container}>
                {
                    user
                        ? <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                            <Text style={styles.sectionTitle} accessibilityRole='header'>
                                {t('idcard:myCard')}
                            </Text>

                            {/* Ausweis */}
                            <View
                                style={styles.card}
                                onLayout={event => setCardWidth(event.nativeEvent.layout.width)}
                            >
                                {/* Kopfbereich mit Logo und Name der Hochschule sowie dem Semester */}
                                <View style={styles.cardHeader}>
                                    <View style={styles.cardHeaderInstitution}>
                                        {
                                            InstitutionLogo
                                                ? <InstitutionLogo
                                                    width={institutionLogoSize}
                                                    height={institutionLogoSize}
                                                />
                                                : null
                                        }
                                        {
                                            institutionName
                                                ? <Text style={styles.institutionName} numberOfLines={1}>
                                                    {institutionName}
                                                </Text>
                                                : null
                                        }
                                    </View>
                                    {
                                        semester
                                            ? <View style={styles.semesterBadge}>
                                                <Text
                                                    style={styles.semesterBadgeText}
                                                    accessibilityLabel={`${t('user:semester')}: ${semester}`}
                                                >
                                                    {semester}
                                                </Text>
                                            </View>
                                            : null
                                    }
                                </View>

                                {/* Inhalt mit Profilbild-Platzhalter und Angaben zum Nutzer */}
                                <View style={styles.cardBody}>
                                    <View
                                        style={styles.photo}
                                        accessible={true}
                                        accessibilityRole='image'
                                        accessibilityLabel={t('accessibility:idcard.avatar')}
                                    >
                                        <PersonIcon size={30} color={styles.photoIcon.color} />
                                    </View>

                                    <View style={styles.cardInfo}>
                                        {
                                            displayName
                                                ? <Text style={styles.name} numberOfLines={1}>
                                                    {displayName}
                                                </Text>
                                                : null
                                        }
                                        {
                                            memberTypes.length > 0
                                                ? <Text style={styles.memberTypes}>
                                                    {memberTypes.join(' · ')}
                                                </Text>
                                                : null
                                        }
                                        {
                                            matriculationNumber
                                                ? <Text
                                                    style={styles.cardInfoText}
                                                    accessibilityLabel={`${t('user:matriculationNumber')}: ${matriculationNumber}`}
                                                >
                                                    {t('user:matriculationNumberShort')}{' '}
                                                    <Text style={styles.cardInfoValue}>
                                                        {matriculationNumber}
                                                    </Text>
                                                </Text>
                                                : null
                                        }
                                        {
                                            studyPrograms.length > 0
                                                ? <Text style={styles.cardInfoText} numberOfLines={1}>
                                                    {studyPrograms.join(', ')}
                                                </Text>
                                                : null
                                        }
                                    </View>
                                </View>

                                {/* Fußbereich mit Gültigkeitsdatum */}
                                {
                                    validUntilText
                                        ? <View style={styles.cardFooter} accessible={true}>
                                            <View style={styles.cardFooterLabel}>
                                                <CalendarIcon size={13} color={styles.cardFooterLabelText.color} />
                                                <Text style={styles.cardFooterLabelText}>
                                                    {t('user:validUntil')}
                                                </Text>
                                            </View>
                                            <Text style={styles.cardFooterValue}>
                                                {validUntilText}
                                            </Text>
                                        </View>
                                        : null
                                }

                                {/* Live-Element: animierter Hologramm-Streifen */}
                                <IdCardShine cardWidth={cardWidth} styles={styles} />
                            </View>

                            {/* Gültigkeitsstatus */}
                            {
                                validUntil
                                    ? <View style={styles.validity} accessible={true}>
                                        {
                                            isValid
                                                ? <CheckCircleIcon size={16} color={styles.validityIconValid.color} />
                                                : <AlertCircleIcon size={16} color={styles.validityIconInvalid.color} />
                                        }
                                        <View style={styles.validityContent}>
                                            <Text style={isValid ? styles.validityTitleValid : styles.validityTitleInvalid}>
                                                {isValid ? t('idcard:valid') : t('idcard:expired')}
                                            </Text>
                                            {
                                                reregistrationText
                                                    ? <Text style={styles.tileSubtitle}>
                                                        {reregistrationText}
                                                    </Text>
                                                    : null
                                            }
                                        </View>
                                    </View>
                                    : null
                            }

                            {/* Verweis zum ÖPNV-Ticket (Deutschlandticket), nur wenn ein Ticket vorhanden ist */}
                            {
                                ticketBarcode
                                    ? <TouchableOpacity
                                        style={styles.ticket}
                                        onPress={onPublicTransportTicketPress}
                                        accessibilityRole='button'
                                        accessibilityHint={t('accessibility:idcard.publicTransportTicketHint')}
                                    >
                                        <View style={styles.ticketIcon}>
                                            <TrainIcon size={20} color={styles.ticketIconColor.color} />
                                        </View>
                                        <View style={styles.ticketContent}>
                                            <Text style={styles.ticketTitle}>
                                                {t('publictransportticket:title')}
                                            </Text>
                                            <Text style={styles.tileSubtitle}>
                                                {[t('idcard:publicTransportTicketIncluded'), semester].filter(text => text).join(' · ')}
                                            </Text>
                                        </View>
                                        <View style={styles.ticketAction}>
                                            <Text style={styles.ticketActionText}>
                                                {t('idcard:show')}
                                            </Text>
                                            <ChevronRightIcon size={14} color={styles.ticketActionText.color} />
                                        </View>
                                    </TouchableOpacity>
                                    : null
                            }

                            {/* Kacheln mit weiteren Angaben */}
                            <View style={styles.infoGrid}>
                                <IdCardInfoTile
                                    label={t('user:studyPrograms')}
                                    value={studyPrograms}
                                    styles={styles}
                                />
                                <IdCardInfoTile
                                    label={t('user:organizationalUnits')}
                                    value={organizationalUnits}
                                    styles={styles}
                                />
                                <IdCardInfoTile
                                    label={t('user:matriculationNumber')}
                                    value={matriculationNumber}
                                    large={true}
                                    styles={styles}
                                />
                                <IdCardInfoTile
                                    label={t('user:enrolledSince')}
                                    value={user?.enrolled_since}
                                    large={true}
                                    styles={styles}
                                />
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
