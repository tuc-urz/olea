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

import { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withTheme, Headline } from 'react-native-paper';
import componentStyles from "./styles";
import { withTranslation } from 'react-i18next';

import { DateTime, Duration } from 'luxon';
import moment from 'moment';
import 'moment/locale/de';

import { onUpdateRefreshing, useLanguage } from '@olea-bps/core';
import { useTimetableCode } from '@olea-bps/context-timetable';
import { Ionicons } from '@expo/vector-icons';
import { AppBar as AppbarComponent } from '@olea-bps/components';
import { TabView, TabBar } from 'react-native-tab-view';
import { TimetableDay as CalendarDay } from '@olea-bps/components';
import { TimetableWeek as CalendarWeek } from '@olea-bps/components';
import { TimetableMonth as CalendarMonth } from '@olea-bps/components';
import { useCourses, TimetableNotFoundError } from '@olea-bps/context-timetable';
import { CourseDetailDialog } from '@olea-bps/components';

function TimetableViewCalendar(props) {
  const { theme, theme: { themeStyles, colors, appSettings, appSettings: { modules: { timetable: { code, calendarStarttime } } } }, t, settings } = props;
  const language = useLanguage();

  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme]
  );

  const whiteAppbar = theme?.appSettings?.modules?.timetable?.whiteAppbar ?? colors.primary;
  const [timetableCode, saveTimetableCode, deleteTimetableCode] = useTimetableCode();

  const [timetableCodeInput, setTimetableCodeInput] = useState(timetableCode);
  const [selectedDayModeDate, setSelectedDayModeDate] = useState(() => DateTime.now());
  const [selectedWeekModeISOWeekDate, setSelectedWeekModeISOWeekDate] = useState(() => DateTime.now().startOf('week').toISOWeekDate());
  const [index, setIndex] = useState(0);
  const [formVisible, setFormVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(timetableCode ? false : true);
  const [loading, setLoading] = useState(false);
  const [today, setToday] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  /**
   * Höhe des Kalenders in Pixeln.
   * Wird an die Calendar-Komponente in TimetableDay/TimetableWeek übergeben.
   * WICHTIG: Bei Änderung dieses Wertes muss auch die height-Prop in TimetableDay und TimetableWeek angepasst werden!
   */
  const CALENDAR_HEIGHT = 800;

  /**
   * Interne Mindesthöhe der react-native-big-calendar Bibliothek.
   * Siehe: node_modules/react-native-big-calendar/build/index.es.js (MIN_HEIGHT = 1200)
   */
  const CALENDAR_MIN_HEIGHT = 1200;

  /**
   * Berechnet die Höhe einer Stunden-Zelle in Pixeln.
   * Verwendet die gleiche Formel wie react-native-big-calendar intern:
   * cellHeight = Math.max(height - 30, MIN_HEIGHT) / 24
   */
  const calculateCellHeight = (height) => Math.max(height - 30, CALENDAR_MIN_HEIGHT) / 24;

  // Berechnen der Uhrzeit zu der beim Öffnen des Stundenplan Kalenders hingepsrungen werden soll.
  // Wird in einem State gespeichert, weil später noch beim Focus-Wechsel erneut berechnet werden muss.
  const [calendarScrollOffsetMinutes, setCalendarScrollOffsetMinutes] = useState(
    () => {
      // Berechnen der Uhrzeit, falls im Custemizing eine angegeben ist, ansonsten wird die jetzige Stunde verwendet.
      // Speichern als Duration.
      const calendarScrollOffsetDuration = calendarStarttime
        ? Duration.fromISOTime(calendarStarttime)
        : Duration.fromObject({ hours: DateTime.now().hour });

      // Duration wird in Minuten umgewandelt, weil der Kalender ein Minutenoffset erwartet
      const offsetMinutes = calendarScrollOffsetDuration.as('minutes');

      /**
       * iOS Workaround für Bug in react-native-big-calendar (v4.0.19)
       *
       * Problem: Die Bibliothek behandelt scrollOffsetMinutes auf iOS falsch.
       * - Android verwendet: scrollTo({ y: (cellHeight * scrollOffsetMinutes) / 60 })
       * - iOS verwendet: contentOffset.y = scrollOffsetMinutes (direkt als Pixel!)
       *
       * Lösung: Auf iOS den Wert vorab in Pixel umrechnen mit der gleichen Formel wie Android.
       *
       * Siehe: node_modules/react-native-big-calendar/build/index.es.js (Zeile 799 und 895)
       */
      if (Platform.OS === 'ios') {
        const cellHeight = calculateCellHeight(CALENDAR_HEIGHT);
        return (cellHeight * offsetMinutes) / 60;
      }

      return offsetMinutes;
    }
  );

  const [courses, refreshCourses] = useCourses();

  // Einstellungen für den Stundenplan-Code
  const timetableCodeInputLength = code?.length ?? 0;
  const timetableCodeInputFilters = code?.filters;
  const timetableCodeInputPreSaveFilters = Array.isArray(code?.preSaveFilters) ? code.preSaveFilters : [];
  const timetableCodeInputFilterToUpperCase = timetableCodeInputFilters?.toUpperCase ?? false;

  const routes = [
    appSettings?.modules?.timetable?.enableDayTab ? { key: 'day', title: t('timetable:day') } : null,
    appSettings?.modules?.timetable?.enableWeekTab ? { key: 'week', title: t('timetable:week') } : null,
    appSettings?.modules?.timetable?.enableMonthTab ? { key: 'month', title: t('timetable:month') } : null,
  ].filter(Boolean); // Filter out null values

  const activeMode = routes?.[index]?.key;
  const activeHeaderDate =
    activeMode === 'day'
      ? selectedDayModeDate
      : DateTime.fromISO(selectedWeekModeISOWeekDate);

  const unsetSelectedEvent = useCallback(
    () => setSelectedEvent(null),
    [setSelectedEvent]
  );

  const renderScene = useCallback(({ route }) => {
    switch (route.key) {
      case 'day':
        return <CalendarDay
          selectedDate={selectedDayModeDate}
          calendarScrollOffsetMinutes={calendarScrollOffsetMinutes}
          calendarHeight={CALENDAR_HEIGHT}
          onDateChanged={setSelectedDayModeDate}
          onCourseSelected={setSelectedEvent}
        />;
      case 'week':
        return <CalendarWeek
          selectedISOWeek={selectedWeekModeISOWeekDate}
          calendarScrollOffsetMinutes={calendarScrollOffsetMinutes}
          calendarHeight={CALENDAR_HEIGHT}
          onWeekChanged={setSelectedWeekModeISOWeekDate}
          onCourseSelected={setSelectedEvent}
        />;
      case 'month':
        return <CalendarMonth today={today} setToday={setToday} month={month} setMonth={setMonth} calendarScrollOffsetMinutes={calendarScrollOffsetMinutes} calendarHeight={CALENDAR_HEIGHT} />;
      default:
        return null;
    }
  },
    [language, selectedDayModeDate, calendarScrollOffsetMinutes, selectedDayModeDate, setSelectedDayModeDate, selectedWeekModeISOWeekDate, setSelectedWeekModeISOWeekDate]
  );

  // Unter verwendung von Luxon wird eine Liste der Monatsnamen generiert, dabei wird die eingestellte Sprache berücksichtigt
  const months = moment.months();

  const handleImportButtonPress = () => {
    setLoading(true);
    setErrorMessage('');
    setInfoMessage('');

    saveTimetableCode(
      // Falls Filter eingestellt sind, werden diese nacheinander auf den Stundenplancode angewendet
      timetableCodeInputPreSaveFilters.reduce(
        (currentTimetableCode, preSaveFilter) => preSaveFilter?.(currentTimetableCode) ?? currentTimetableCode,
        timetableCodeInput
      )
    )
        .then(
            () => {
              const now = DateTime.now();
              const startDate = now.startOf('week');
              const endDate = now.endOf('week');
              return refreshCourses(startDate.toISODate(), endDate.toISODate())
                  .then(
                      () => {
                        setFormVisible(false);
                        setLoading(false);
                      }
                  );
            }
        ).catch(
        (error) => {
          if (error instanceof TimetableNotFoundError) {
            setErrorMessage(t('timetable:codeNotFoundError', { timetableCode: timetableCodeInput }));
            setLoading(false);
          } else {
            console.error(TimetableViewCalendar.name, ':', 'can´t import timetable code', timetableCode, ':', error);
            setErrorMessage(t('timetable:importError'));
          }
        }
    ).finally(
        () => setLoading(false)
    );
  };

  useEffect(() => {
    setErrorMessage('')
    if (infoVisible) {
      setInfoMessage(t(timetableCode ? 'timetable:inputTimetableCode' : 'timetable:notImportedYet', { timetableCodeInputLength }));
    } else {
      setInfoMessage('');
    }
  }, [infoVisible]);
  const tabView = useMemo(() => {
    return (
      <TabView
        style={{ backgroundColor: '#fff' }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        swipeEnabled={false}
        lazy={true}
        lazyPreloadDistance={0}
        renderTabBar={props => (
          <TabBar
            {...props}
            activeColor={themeStyles.tabs.activeColor}
            inactiveColor={themeStyles.tabs.inactiveColor}
            style={themeStyles.tabs}
            labelStyle={themeStyles.tab}
            indicatorStyle={themeStyles.tabIndicator}
          />
        )}
      />
    )
  }, [renderScene, index, routes, setIndex, themeStyles.tab, themeStyles.tabIndicator]);

  const renderForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.codeInput}
          placeholder={t('timetable:inputPlaceholder')}
          value={timetableCodeInput}
          onChangeText={(code) => {
            setTimetableCodeInput(code);
            setErrorMessage('');
          }}
          autoCapitalize={timetableCodeInputFilterToUpperCase ? 'characters' : 'none'}
          maxLength={timetableCodeInputLength ? timetableCodeInputLength : undefined}
          contextMenuHidden={false}
        />
        <TouchableOpacity style={styles.infoIcon} onPress={() => {
          setInfoVisible(!infoVisible);
        }}>
          <Ionicons name="information-circle-outline" size={30} color={colors.icon} />
        </TouchableOpacity>
      </View>
      {loading ? <ActivityIndicator size="large" color={colors.loadingIndicator} /> : null}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {infoMessage ? (
        <Text
          style={styles.infoText}
          dataDetectorType="link"
          selectable
        >
          {infoMessage}
        </Text>
      ) : null}

      <TouchableOpacity
        style={styles.importButton}
        labelStyle={styles.importButtonLabel}
        label={t('eventCode:importButton')}
        onPress={() => {
          handleImportButtonPress();
        }}
      >
        <Headline style={styles.importButtonLabel} color={colors.buttonText}>
          {t('timetable:importButton')}
        </Headline>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.deleteButtonContainer}
          onPress={() => {
            deleteTimetableCode();
            setTimetableCodeInput('');
          }}
        >
          <Text style={styles.deleteButton}>{t('timetable:deleteCode')}</Text>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setFormVisible(false);
            setErrorMessage('');
            setInfoVisible(false);
          }}
        >
          <Text style={styles.dismissButton}>{t("timetable:close")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: whiteAppbar }}>
      <AppbarComponent
        rightAction={
          <TouchableOpacity
            onPress={
              activeMode === 'day'
                ? () => setSelectedDayModeDate(() => DateTime.now())
                : () => setSelectedWeekModeISOWeekDate(() => DateTime.now().startOf('week').toISOWeekDate())
            }
          >
            <Text style={{ color: whiteAppbar === colors.primary ? '#fff' : '#000' }}>{t("timetable:today")}</Text>
          </TouchableOpacity>
        }
        style={{ backgroundColor: colors.primary /* whiteAppbar */ }}//hintergrundappbar
        title={
          activeMode === 'month'
            ? `${months[activeHeaderDate.month - 1]}`
            : `${months[activeHeaderDate.month - 1]} ${t('timetable:weekNumber', { kw: activeHeaderDate.weekNumber })}`
        }
      />
      {tabView}
      {formVisible && (
        <KeyboardAvoidingView
          behavior='position'
          keyboardVerticalOffset={Platform.OS === 'android' ? 50 : 0}
        >
          {renderForm()}
        </KeyboardAvoidingView>
      )}

      {!formVisible && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setFormVisible(true)}
        >
          <Ionicons name="add-outline" size={40} color="#000" />
        </TouchableOpacity>
      )}
        <CourseDetailDialog
            course={selectedEvent}
            visible={selectedEvent ? true : false}
            onClose={unsetSelectedEvent}
            onDismiss={unsetSelectedEvent}
        />
    </SafeAreaView>
  );
}

const mapStateToProps = state => ({
  settings: state.settingReducer,
});

export default connect(mapStateToProps, { onUpdateRefreshing })(withTranslation()(withTheme(TimetableViewCalendar)));
