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

import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Linking,
    Text
} from 'react-native';

import { useTranslation } from 'react-i18next';
import {
    Headline,
    Paragraph,
    TextInput,
    useTheme,
} from 'react-native-paper';

import { usePersonalEvents, usePersonalEventsCode } from '@openasist/context-event';

import componentStyles from './styles';


/**
 * View Name
 *
 * Shows the View
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
export default function EventCodeInputComponent({ onClose, onPersonalEventsImported }) {
    const theme = useTheme();
    const { colors } = theme;
    const { t } = useTranslation();

    const [, refreshPersonalEvents] = usePersonalEvents();
    const [personalEventsCode, setPersonalEventsCode] = usePersonalEventsCode();
    const [personalEventsImportedImporting, setPersonalEventsImportedImporting] = useState(false);
    const [personalEventsCodeInput, setPersonalEventsCodeInput] = useState(personalEventsCode ? personalEventsCode : '');

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    )

    const handleImportButtonPressed = () => {
        setPersonalEventsImportedImporting(true);

        if (personalEventsCodeInput.length < 8) {
            alert(t('eventCode:codeShortError'));
            setPersonalEventsImportedImporting(false);
        } else if (personalEventsCodeInput.length > 8) {
            alert(t('eventCode:codeLongError'));
            setPersonalEventsImportedImporting(false);
        } else {
            setPersonalEventsCode(personalEventsCodeInput);
            refreshPersonalEvents()
                .then(() => setPersonalEventsImportedImporting(false))
                .then(() => onPersonalEventsImported?.());
        }
    }

    return (
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView behavior={"padding"} >
                <View style={styles.paragraph}>
                    <Text style={styles.paragraphText} selectable={true} dataDetectorType={'link'}>
                        {
                            personalEventsCodeInput
                                ? t('eventCode:inputEventCode')
                                : <Text style={styles.paragraphText} selectable={true} dataDetectorType={'link'}>
                                    {t('eventCode:notImportedYet')}
                                    <Text style={styles.linkText} selctable={true} dataDetectorType={'link'} onPress={() => Linking.openURL('https://www.tu-chemnitz.de/tu/veranstaltungen/tuctag/alle-angebote.html')}>
                                        {t('eventCode:tucDayLinkText')}
                                    </Text>
                                </Text>
                        }
                    </Text>
                </View>
                <View style={styles.importTextInput}>
                    <TextInput
                        theme={{ colors: { primary: colors.textInput, placeholder: colors.textLighter } }}
                        style={styles.paragraphText}
                        maxLength={8}
                        selectionColor={colors.textInputSelection}
                        label={t('eventCode:inputPlaceholder')}
                        value={personalEventsCodeInput}
                        onChangeText={text => setPersonalEventsCodeInput(text.trim())}
                    />
                </View>

                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.importButton}
                        labelStyle={styles.importButtonLabel}
                        label={t('eventCode:importButton')}
                        onPress={handleImportButtonPressed}
                    >
                        <Headline style={styles.importButtonLabel} color={colors.buttonText}>
                            {t('eventCode:importButton')}
                        </Headline>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.continueWithoutCodeButton}
                        labelStyle={styles.importButtonLabel}
                        label={t('eventCode:importButton')}
                        onPress={() => onClose?.()}>
                        <Headline style={styles.continueWithoutCodeButtonLabel} color={colors.buttonText}>{t('eventCode:continueWithoutCodeButton')}</Headline>
                    </TouchableOpacity>
                </View>


                {
                    personalEventsImportedImporting
                        ? <ActivityIndicator style={styles.activity} size="large" color={colors.loadingIndicator} />
                        : null
                }
                {
                    personalEventsImportedImporting
                        ? <View style={styles.paragraph}><Paragraph>{t('timetable:importInProgress', '')}</Paragraph></View>
                        : null
                }
            </KeyboardAvoidingView>
        </ScrollView>
    );
}