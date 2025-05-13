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

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { withTheme, Headline } from 'react-native-paper';
import componentStyles from "./styles";
import { withTranslation } from 'react-i18next';
import { onUpdateRefreshing } from '@olea/core';
import { useTimetableCode } from '@olea/context-timetable';
import { Ionicons } from '@expo/vector-icons';
import AppbarComponent from "@olea/component-app-bar";
import { TabView, TabBar } from 'react-native-tab-view';
import CalendarDay from '@olea/component-timetable-day';
import CalendarWeek from '@olea/component-timetable-week';
import CalendarMonth from '@olea/component-timetable-month';
import moment from 'moment';
import 'moment/locale/de';
import { useCourses, TimetableNotFoundError } from '@olea/context-timetable';


function TimetableViewCalendar(props) {
  const { theme, theme: { themeStyles, colors, appSettings, appSettings: { modules: { timetable: { code } } } }, t, settings } = props;
  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme]
  );

  const whiteAppbar = theme?.appSettings?.modules?.timetable?.whiteAppbar ?? colors.primary;
  const [timetableCode, saveTimetableCode, deleteTimetableCode] = useTimetableCode();

  const [timetableCodeInput, setTimetableCodeInput] = useState(timetableCode);
  const [kw, setKw] = useState(moment().week());
  const [month, setMonth] = useState(moment().month());
  const [index, setIndex] = useState(0);
  const [formVisible, setFormVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coursesImportedYet, setCoursesImportedYet] = useState(true);
  const [today, setToday] = useState(new Date());

  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const [courses, refreshCourses] = useCourses();

  // Einstellungen für den Stundenplan-Code
  const timetableCodeInputLength = code?.length ?? 0;
  const timetableCodeInputFilters = code?.filters;
  const timetableCodeInputPreSaveFilters = Array.isArray(code?.preSaveFilters) ? code.preSaveFilters : [];
  const timetableCodeInputFilterToUpperCase = timetableCodeInputFilters?.toUpperCase ?? false;

  const language = settings?.settingsGeneral?.language;

  const routes = [
    appSettings?.modules?.timetable?.enableDayTab ? { key: 'day', title: t('timetable:day') } : null,
    appSettings?.modules?.timetable?.enableWeekTab ? { key: 'week', title: t('timetable:week') } : null,
    appSettings?.modules?.timetable?.enableMonthTab ? { key: 'month', title: t('timetable:month') } : null,
  ].filter(Boolean); // Filter out null values

  const renderScene = useCallback(({ route }) => {
    switch (route.key) {
      case 'day':
        return <CalendarDay today={today} setToday={setToday} kw={kw} setKw={setKw} month={month} setMonth={setMonth} coursesImportedYet={coursesImportedYet} />;
      case 'week':
        return <CalendarWeek today={today} setToday={setToday} kw={kw} setKw={setKw} month={month} setMonth={setMonth} />;
      case 'month':
        return <CalendarMonth today={today} setToday={setToday} month={month} setMonth={setMonth} />;
      default:
        return null;
    }
  });
  // hier werden die Monate mithilfe von moment.js geholt
  //dabei wird beachtet welche Sprache eingestellt ist
  const months = moment.months();

  const handleTodayButtonPressed = () => {
    setToday(new Date());
  };

  const handleImportButtonPress = async () => {
    setCoursesImportedYet(false);
    setLoading(true);
    setErrorMessage('');
    setInfoMessage('');
    await saveTimetableCode(
      // Falls Filter eingestellt sind, werden diese nacheinander auf den Stundenplancode angewendet
      timetableCodeInputPreSaveFilters.reduce(
        (currentTimetableCode, preSaveFilter) => preSaveFilter?.(currentTimetableCode) ?? currentTimetableCode,
        timetableCodeInput
      )
    );
    const copyToday = new Date(today);
    const startDate = new Date(copyToday.setDate(copyToday.getDate() - 30));
    const endDate = new Date(copyToday.setDate(copyToday.getDate() + 151));
    await refreshCourses(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0])
      .then(() => {
          setFormVisible(false);
          setLoading(false);
          setCoursesImportedYet(true);

      })
      .catch((error) => {
        if (error instanceof TimetableNotFoundError) {
          console.error(error.message);
          setErrorMessage(t('timetable:codeNotFoundError', { timetableCode: timetableCodeInput }));
          setLoading(false);
        }
        else {
          setErrorMessage(t('timetable:importError'));
          setLoading(false);
        }
      });
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
          maxLength={timetableCodeInputLength ? timetableCodeInputLength : null}
          contextMenuHidden={false}
        />
        <TouchableOpacity style={styles.infoIcon} onPress={() => {
          setInfoVisible(!infoVisible);
        }}>
          <Ionicons name="information-circle-outline" size={30} color={colors.icon} />
        </TouchableOpacity>
      </View>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : null}
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
          <TouchableOpacity onPress={handleTodayButtonPressed}>
            <Text style={{ color: whiteAppbar === colors.primary ? '#fff' : '#000' }}>{t("timetable:today")}</Text>
          </TouchableOpacity>
        }
        style={{ backgroundColor: colors.primary /* whiteAppbar */ }}//hintergrundappbar
        title={index === 2 ? `${months[month]}` : `${months[month]} ${t('timetable:weekNumber', { kw })} `}
      />
      {tabView}
      {formVisible && (
        Platform.OS === 'ios' ? (
          <KeyboardAvoidingView
            behavior='position'
          >
            {renderForm()}
          </KeyboardAvoidingView>
        ) : (
          renderForm()
        )
      )}

      {!formVisible && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setFormVisible(true)}
        >
          <Ionicons name="add-outline" size={40} color="#000" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const mapStateToProps = state => ({
  settings: state.settingReducer,
});

export default connect(mapStateToProps, { onUpdateRefreshing })(withTranslation()(withTheme(TimetableViewCalendar)));