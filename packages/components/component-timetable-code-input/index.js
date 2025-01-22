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

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
  Text,
  Linking,
} from 'react-native';
import { connect } from 'react-redux'
import { Paragraph, TextInput, Button, withTheme } from 'react-native-paper';
import { withTranslation } from 'react-i18next';

import { ApiProviderNotInitializedError, useCourses, useTimetableCode } from '@openasist/context-timetable';

import componentStyles from './styles';

/**
 * Diese Callback-Funktion wird gerufen, wenn der vom Nutzer ausgelöste Import erfolgreich war.
 * @callback onImportSuccessfullyFinished
 * @returns {void}
 */

/**
 * Diese Callback-Funktion wird gerufen, wenn der vom Nutzer ausgelöste Importversuch fehlschägt war.
 * Es wird der Grund des Fehlschlags zur weiteren Behandlung übergeben.
 * @callback onImportFailed
 * @param {*} reason
 */

/**
 * @param {*} props
 * @param {onImportSuccessfullyFinished} props.onImportFailed
 * @param {onImportFailed} props.ponImportSuccessfullyFinished
 */
function TimetableCodeInput(props) {
  const {
    theme,
    theme: { colors, appSettings: { modules: { timetable: { code } } } },
    t,
    // Callback, welche nach dem erfolgreichen Importieren aufgerufen wird.
    onImportSuccessfullyFinished,
    // Callback, welche nach einem fehlgeschlagenen Importversuch aufgerufen wird.
    onImportFailed,
  } = props;

  const componentName = arguments.callee.name;

  // Einstellungen für den Stundenplan-Code
  const timetableCodeInputLength = code?.length ?? 0;
  const timetableCodeInputFilters = code?.filters;
  const timetableCodeInputPreSaveFilters = Array.isArray(code?.preSaveFilters) ? code.preSaveFilters : [];
  const timetableCodeInputFilterToUpperCase = timetableCodeInputFilters?.toUpperCase ?? false;

  const [timetableCode, saveTimetableCode] = useTimetableCode();
  const [courses, refreshCourses] = useCourses();

  const [timetableCodeInput, setTimetableCodeInput] = useState(timetableCode);
  const [importing, setImporting] = useState(false);

  // Generate styles. Will be generated only if not present or the theme property changes.
  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme]
  )
  
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };
  
  const renderTextWithLinks = (text) => {
    const parts = text.split(/(https?:\/\/[^\s]+)/g);
    return parts.map((part, index) => {
      if (part.match(/https?:\/\/[^\s]+/)) {
        const displayText = part.replace(/https?:\/\//, '');
        return (
          <Text
            key={index}
            style={styles.link}
            onPress={() => handleLinkPress(part)}
          >
            {displayText}
          </Text>
        );
      }
      return part;
    });
  };
  
  const paragraphText = t(timetableCode ? 'timetable:inputTimetableCode' : 'timetable:notImportedYet', { timetableCodeInputLength });

  return (
    <ScrollView style={styles.mainContentContainer}>
      <KeyboardAvoidingView behavior={"padding"} >
        <View style={styles.paragraph}>
          {/*selectable and dataDetectorType only work on andorid*/}
          <Paragraph style={styles.paragraphText} selectable={true} dataDetectorType={'link'}>
            {renderTextWithLinks(paragraphText)}
          </Paragraph>
        </View>
        <View style={styles.importTextInputContainer}>
          <TextInput
            theme={{ colors: { primary: colors.textInput, placeholder: colors.textLighter } }}
            style={styles.paragraphText}
            selectionColor={colors.textInputSelection}
            label={t('timetable:inputPlaceholder')}
            value={timetableCodeInput}
            autoCapitalize={timetableCodeInputFilterToUpperCase ? 'characters' : 'none'}
            maxLength={timetableCodeInputLength ? timetableCodeInputLength : null}
            onChangeText={setTimetableCodeInput}
          />
        </View>
        <Button
          onPress={async () => {
            // Wenn eine Mindestlänge des Stundenplandcodes konfiguriert ist und diese nicht von der Eingabe erreicht wird, wird ein Fehlerdialog angezeigt
            if (timetableCodeInputLength && (timetableCodeInput?.length ?? 0) < timetableCodeInputLength) {
              const alertTranslationValues = { timetableCodeInputLength };
              Alert.alert(
                t('timetable:errorCodeShort:title', alertTranslationValues),
                t('timetable:errorCodeShort:message', alertTranslationValues),
                [{ text: 'OK' }],
              );
            } else {
              // Import-Ladeanimation aktivieren
              setImporting(true);
              await saveTimetableCode(
                // Falls Filter eingestellt sind, werden diese nacheinander auf den Stundenplancode angewendet
                timetableCodeInputPreSaveFilters.reduce(
                  (currentTimetableCode, preSaveFilter) => preSaveFilter?.(currentTimetableCode) ?? currentTimetableCode,
                  timetableCodeInput
                )
              );
              /**
               * Dieser Aufruf ist eigentlich unnötig, aber die Nutzer möchten Feedback, wenn der Stundenplan nochmal importiert wird.
               * Der Stundenplan wird über einen useEffect-Hook neu geladen, sobald der neue Stundenplancode vom Context gespeichert wurde.
               * Es soll aber die Lade-Animation angezeigt werden und zum Stundenplan zurückgespungen werden, auch wenn schon ein Stundenplancode importiert wurde.
               *
               * Da ich mir nicht besser zu helfen weiß, wird die refreshCourses-Funktion gerufen und importiert NOCHMAL den Stundenplan, nachdem dieser schon vom useEffect-Hook im Kontext importiert wurde.
               * refreshCourses gibt eine Promise zurück, die mit dem fertigen Import auf nachfolgende then-Anweisungen weiterleitet.
               *
               * Man könnte vielleicht auch bei saveTimetableCode ein Promise zurückgeben, die den Stundenplan auch gleich importiert.
               * Aber dann müsste man anstatt des useEffekt-Hooks, der auf den Stundenplancode reagiert, jeden refresh des Stundenplanes über den Code selbst implementieren.
               */
              refreshCourses()
                // Rufe onImportSuccessfullyFinished-Callback, wenn Import erfolgreich war
                .then(() => onImportSuccessfullyFinished?.())
                .catch((reason) => {
                  if (reason instanceof ApiProviderNotInitializedError) {
                    console.error(componentName, ': ', reason);
                  } else {
                    console.debug(componentName, ': ', reason);
                  }
                  // Rufe onImportFailed.Callback, wenn Import fehlschlug
                  onImportFailed?.(reason);
                })
                // Import-Ladeanimation immer deaktivieren
                .finally(() => setImporting(false));
            }
          }}
          labelStyle={styles.importButtonLabel}
          color={colors.buttonText}
        >
          {t('timetable:importButton')}
        </Button>
        {
          // Es wird ein Ladesymbol angezeigt, wenn der Stundenplan importiert wird.
          importing
            ? <>
              <ActivityIndicator style={styles.activity} size="large" color={colors.loadingIndicator} />
              <View style={styles.paragraph}><Paragraph>{t('timetable:importInProgress', '')}</Paragraph></View>
            </>
            : null
        }
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    settings: state.settingReducer
  };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(TimetableCodeInput)))
