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

import React, { useEffect, useMemo, useState } from 'react';
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

import { withTranslation } from "react-i18next";
import {
    Headline,
    Paragraph,
    TextInput,
    withTheme,
} from "react-native-paper";
import { connect } from 'react-redux';
import * as SecureStore from 'expo-secure-store';

import componentStyles from "./styles";


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



function EventCodeInputComponent(props) {

    const { setShowCodeView, eventCode, setEventCode, setContinuedWithout, setCodeInCache, theme, theme: { colors, themeStyles }, t } = props;
    const [inProgress, setInProgress] = useState(props.inProgress);
    const [codeEntered, setCodeEntered] = useState(true);
    const [tempEventCode, setTempEventCode] = useState("");

    const getTempEventCode = async () => {
        const tempCode = await SecureStore.getItemAsync('tempEventCode');
        setTempEventCode(tempCode)
    }

    useEffect(() => {
        getTempEventCode();
    }, [])



    /*
    if a code is entered a different text should be showing up. this makes sure that the text shown up,
    is only changing when a code was imported. Not while typing the code. changes might still be needed
    with safing the code in the cache.
    */
    useEffect(() => {
        if (eventCode === '' || eventCode === null) {
            setCodeEntered(false);
        }
    }, []);

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    )
    //let dataService = null
    const regex = /https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[\/\d\w\.-]*)*(?:[\?])*(.+)*/gi;


    async function _onImportButtonPressed() {
        const { t } = props;
        setInProgress(true);
        let trimmedCode = eventCode?.trim();
        const eCode = regex.exec(trimmedCode);

        if (eCode) {
            trimmedCode = eCode[2].replace(/\//g, '');
            if (trimmedCode !== eventCode) {
                setTempEventCode(trimmedCode);
            }
        }
        if (tempEventCode.length < 8) {
            alert(t('eventCode:codeShortError'));
            setInProgress(false);
        } else if (tempEventCode.length > 8) {
            alert(t('eventCode:codeLongError'));
            setInProgress(false);
        } else {
            try {
                //eventCode wird erst hier gesetzt, somit sollte man nicht ohne den import Button zu drücken schon ausgewählte Veranstaltungen sehen
                setEventCode(tempEventCode);
                await SecureStore.setItemAsync('tempEventCode', tempEventCode);
                await SecureStore.setItemAsync('eventCode', tempEventCode);
                setCodeInCache(true);
                setShowCodeView(false);


            } catch (error) {
                alert(error);
                setInProgress(false);
            }
        }
    }

    async function _onContinueWithoutCodeButtonPressed() {
        setContinuedWithout(true);
        setShowCodeView(false);
    }

    return (
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView behavior={"padding"} >
                <View style={styles.paragraph}>
                    {
                        !codeEntered && (
                            <Text style={styles.paragraphText} selectable={true} dataDetectorType={'link'}>
                                {t('eventCode:notImportedYet')}
                                <Text style={styles.linkText} selctable={true} dataDetectorType={'link'} onPress={() => Linking.openURL('https://www.tu-chemnitz.de/tu/veranstaltungen/tuctag/alle-angebote.html')}>
                                    {t('eventCode:tucDayLinkText')}
                                </Text>
                            </Text>
                        )
                    }
                    {
                        codeEntered && (
                            <Text style={styles.paragraphText} selectable={true} dataDetectorType={'link'}>
                                {t('eventCode:inputEventCode')}
                            </Text>
                        )
                    }
                </View>
                <View style={styles.importTextInput}>
                    <TextInput
                        theme={{ colors: { primary: colors.textInput, placeholder: colors.textLighter } }}
                        style={styles.paragraphText}
                        maxLength={8}
                        selectionColor={colors.textInputSelection}
                        label={t('eventCode:inputPlaceholder')}
                        value={tempEventCode}
                        onChangeText={tempEventCode => setTempEventCode(tempEventCode)}
                    />
                </View>

                <View style={styles.container}>
                    <TouchableOpacity style={styles.importButton}
                        labelStyle={styles.importButtonLabel}
                        label={t('eventCode:importButton')}
                        onPress={() => {
                            _onImportButtonPressed()
                        }}>
                        <Headline style={styles.importButtonLabel} color={colors.buttonText}>{t('eventCode:importButton')}</Headline>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.continueWithoutCodeButton}
                        labelStyle={styles.importButtonLabel}
                        label={t('eventCode:importButton')}
                        onPress={() => {
                            _onContinueWithoutCodeButtonPressed()
                        }}>
                        <Headline style={styles.continueWithoutCodeButtonLabel} color={colors.buttonText}>{t('eventCode:continueWithoutCodeButton')}</Headline>
                    </TouchableOpacity>
                </View>


                {inProgress && <ActivityIndicator style={styles.activity} size="large" color={colors.loadingIndicator} />}
                {inProgress && <View style={styles.paragraph}><Paragraph>{t('timetable:importInProgress', '')}</Paragraph></View>}
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.opal.component,
        pluginStyles: state.pluginReducer.opal.styles,
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(EventCodeInputComponent)))

