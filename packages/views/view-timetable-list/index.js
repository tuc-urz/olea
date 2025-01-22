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

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { connect } from 'react-redux'
import { TabView, TabBar } from 'react-native-tab-view';
import { Appbar, useTheme, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from '@react-navigation/native';
import { DateTime, Duration } from 'luxon';

import { onUpdateRefreshing, store } from "@openasist/core";

import OtherCoursesComponent from "@openasist/component-other-courses";
import TimetableListComponent from "@openasist/component-timetable-list";
import TimetableCodeInput from '@openasist/component-timetable-code-input';

import componentStyles from "./styles";
import AppbarComponent from "@openasist/component-app-bar";
import { ApiProviderNotInitializedError, useCourses, useTimetableCode } from '@openasist/context-timetable';

/**
 * Timetable View
 *
 * Displays the timetable, if the has imported one. If no timetable
 * is available, the view will provide a import. The view also
 * provides a button to import a new timetable.
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
function TimetableViewList(props) {
  const theme = useTheme();
  const { t } = useTranslation();

  // Get all required constants from props
  const {
    settings: { settingsGeneral: { language } },
  } = props;

  const { colors, themeStyles, appSettings: { modules: { timetable: { downloadEnabled } } } } = theme;

  const componentName = arguments.callee.name;
  const timetableSettings = theme?.appSettings?.modules?.timetable;
  const disabledWeekdays = timetableSettings?.disabledWeekdays ?? [];
  const weeksToRender = timetableSettings?.weeksToRender ?? 2;
  // Jetziger Zeitpunkt
  const now = DateTime.now();
  // Zeitpunkt, der auf den Wochenanfang zeigt
  const startDate = now.startOf('week');
  // Zeitpunkt, der auf den letzten anzuzeigenen Tag zeigt
  const endDate = startDate.plus({ weeks: weeksToRender }).endOf('week');

  // Generiert die Tabs beginnend beim Wochenanfang bis zum letzten Tag der Ansicht
  // Es werden die nicht anzuzeigenden Wochentage herausgefiltert
  const daysTabViewRoutes = useMemo(
    () => {
      // Berechenen der Anzahl der zu zeigenden Tage bzw. Anzahl der Tabs
      const daysToRender = Duration.fromDurationLike({ weeks: weeksToRender }).as('days');

      // Erstellen der Tabs
      return Array.from(
        // Es wird ein Array erzeugt, welches so lang ist wie die Anzahl der zu zeigenden Tage
        { length: daysToRender },
        // Tabs anhand des Indexes berechnen
        (_, index) => {

          // Festlegen des Tages des entsprechenden Tabs beim Index
          const currentDay = startDate
            // Es wird der Start genommen und um index-viele Tage in die Zukunft verschoben
            .plus({ days: index })
            // Abschliesend wird die Uhrzeit auf 00:00, also den Anfang des Tages, gesetzt.
            .startOf('day');

          // Tab wird als Objekt zurückgeben
          return {
            // Der Schlüssel des Tabs ist das Datum des Tabs im ISO-Format
            // Somit lässt sich über das Datum der entsprechende Tab aktivieren
            key: currentDay.toISODate(),
            // Für die weiter Verarbeitung, wird das Datum als Datumsobjekt mitgeben
            // Dem Datumsobject wird die eingestellt Sprache gegeben
            date: currentDay.setLocale(language),
          }
        }
      )
        .filter(dayRoute => !disabledWeekdays.includes(dayRoute.date.weekday))
    },
    [weeksToRender, disabledWeekdays, startDate, language]
  );
  // Create state for tab view index
  const [daysTabViewActiveRouteIndex, setDaysTabViewActiveRouteIndex] = useState(() => {
    // Present day
    const today = DateTime.now().startOf('day');
    // Search for the index of today or the day after. If no index can be found, -1 is taken.
    let initialDayTabIndex = daysTabViewRoutes.findIndex(dayTab => dayTab.date >= today);
    // If no index could be found, the last tab is taken.
    // If only one week is rendered and the weekend days are switched off, no following day will be found.
    initialDayTabIndex = initialDayTabIndex === -1 ? daysTabViewRoutes.length - 1 : initialDayTabIndex;
    return initialDayTabIndex;
  });

  const [timetableCode] = useTimetableCode();
  const [courses, refreshCourses] = useCourses();

  /**
   * State der speichert, ob die Code-Eingabe gezeigt werden soll.
   *
   * Der State kann 3 Zustände annehmen:
   *   - null : Es wurde noch kein Stundenplan importiert -> Code-Eingabe wird angezeigt
   *   - true : Der Nutzer möchte die Code-Eingabe sehen -> Code-Eingabe wird angezeigt
   *   - false: Die Nutzer möchte die Code-Eingabe nicht sehen -> Stundenplan wird angezeigt
   *
   * Der null-Wert wird benutzt um festzustellen, dass die App die Code-Eingabe anzeigt, weil bisher kein Stundenplan importiert wurde.
   * Somit kann nach dem Import geprüft werden, ob der State den null-Wert hält und automatisch zu den Stundenplan schalten.
   */
  const [showImport, setShowImport] = useState(timetableCode === null && courses === null ? true : false);
  const [coursesRefreshing, setCoursesRefreshing] = useState(false);

  // Generate styles. Will be generated only if not present or the theme property changes.
  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme]
  )

  const otherCourses = courses?.filter?.(course => course?.times?.some(courseTime => courseTime?.dayOfWeek === 0));
  const activeTabDate = daysTabViewRoutes[daysTabViewActiveRouteIndex]?.date;
  const activeTabWeek = activeTabDate.weekNumber;

  // Refreshen der Vorlesungen, wenn die View angeziegt wird und den Fokus vom nutzer bekommt.
  useFocusEffect(
    useCallback(
      () => {
        refreshCourses(startDate.toISODate(), endDate.toISODate())
          .catch((reason) => {
            if (reason instanceof ApiProviderNotInitializedError) {
              console.error(componentName, ': ', reason);
            } else {
              console.debug(componentName, ': ', reason);
            }
          });
      },
      [])
  )

  /*
  Depending on the existence of a timetable, either the timetable or the view for the input of a timetablecode will be rendered
  To decide which components have to rendered, the flag showImport is used.
  If its value is true, there already is an imported timetable as well as a list of courses
  and the function for rendering the timetable-tabview(renderTabView) is called.
  Otherwise, the function for entering a timetablecode will be called(renderTimetableCodeInput)
  */
  return (
    <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
      <AppbarComponent {...props}
        title={t('timetable:title')}
        subtitle={`${t('timetable:weekNumber', { kw: activeTabWeek })} / ${t(activeTabWeek % 2 === 0 ? 'timetable:evenWeek' : 'timetable:oddWeek')}`}
        // in addition to the selection of the icon for the right Action in the app-bar the color for the icon also has to be defined
        rightAction={
          <>
            {
              downloadEnabled
                ? <Appbar.Action
                  icon={"download"}
                  onPress={
                    async () => {
                      const { modules: { timetable: { downloadUrl } } } = props.theme.appSettings;
                      await Linking.openURL(downloadUrl + timetableCode);
                    }
                  }
                  color={colors.appbarIconColor}
                  accessibilityLabel={t('accessibility:timetable:downloadTimetableButton')}
                />
                : null
            }
            <Appbar.Action
              icon={showImport ? "table" : "table-plus"}
              color={colors.appbarIconColor}
              onPress={
                () => setShowImport(currentValue => !currentValue)
              }
              accessibilityLabel={t(
                showImport
                  ? 'accessibility:timetable:showImportButton'
                  : 'accessibility:timetable:showTimetableButton'
              )}
            />
          </>
        }
      />
      {
        !(showImport) // !FIXME: If-Cases sollten getauscht werden, damit Code einfacher wird
          ? <View style={themeStyles.container}>
            <TabView
              style={props.style}
              navigationState={{ index: daysTabViewActiveRouteIndex, routes: daysTabViewRoutes }}
              onIndexChange={setDaysTabViewActiveRouteIndex}
              renderTabBar={
                (props) =>
                  <TabBar
                    {...props}
                    scrollEnabled
                    style={themeStyles.tabs}
                    labelStyle={themeStyles.tab}
                    indicatorStyle={themeStyles.tabIndicator}
                    tabStyle={{ width: 'auto', paddingHorizontal: 20 }}
                    getLabelText={
                      // Generieren das Tab-Textes
                      ({ route }) => {
                        // Datumsobject aus dem Tab holen
                        const date = route.date;
                        // Kurzbezeichnung des Wochentages bestimmen
                        const shortWeekDay = t(`common:isoWeekDay:${date.weekday}:short`); // Falls hermes Intl soweit ist, lieber folgende Zeile verwenden: const shortWeekDay = date.weekdayShort;
                        // Datum, bestehend aus Tag und Monat, bestimmen
                        const localeDate = date.toLocaleString(
                          {
                            day: '2-digit',
                            month: '2-digit',
                          }
                        );

                        // Tab-Text aus Wochentag und Datum generieren
                        return `${shortWeekDay}, ${localeDate}`;
                      }
                    }
                    getAccessibilityLabel={
                      // Volles Datum als Vorlesedatum setzen
                      ({ route }) => route.date.toLocaleString(DateTime.DATE_FULL)
                    }
                  />
              }
              renderScene={
                ({ route }) => {
                  const dayIsoDate = route.key;
                  const coursesOfDay = courses?.[dayIsoDate];

                  return (
                    <View style={themeStyles.container}>
                      <View style={styles.horizontalSeperator} />
                      <ScrollView
                        refreshControl={
                          <RefreshControl
                            refreshing={coursesRefreshing}
                            onRefresh={
                              () => {
                                setCoursesRefreshing(true);
                                refreshCourses(dayIsoDate, dayIsoDate)
                                  .finally(() => setCoursesRefreshing(false));
                              }
                            }
                          />
                        }>
                        <View style={styles.renderList}>
                          {
                            coursesOfDay?.length
                              ? coursesOfDay.map(
                                (course, index) => {
                                  const courseTime = course?.times?.[0];

                                  return (
                                    <TimetableListComponent
                                      {...props}
                                      key={`${course?.title?.data}${course?.type?.data}${courseTime.start}${courseTime.end}`}
                                      course={course}
                                      times={courseTime}
                                    />
                                  )
                                }
                              )
                              : <View style={styles.emptyListContainer}>
                                <Text style={styles.emptyText}>{t('timetable:noEvents')}</Text>
                              </View>
                          }
                        </View>
                      </ScrollView>
                    </View>
                  );
                }
              }
              lazy
              lazyPreloadDistance={2}
              renderLazyPlaceholder={(route) =>
                <View style={styles.centerContainer}>
                  <ActivityIndicator
                    style={styles.activity}
                    size={'large'}
                    color={theme.colors.loadingIndicator}
                  />
                </View>
              }
            />
            {
              otherCourses?.length
                ? <TouchableOpacity
                  style={styles.otherContainer}
                  onPress={
                    () => {
                      // Never provide props directly if you are using translations in this or a parent component
                      const otherCoursesComponentProps = { navigation: { ...props.navigation } };

                      store.dispatch(
                        {
                          type: 'UPDATE_MODAL_CONTENT',
                          modalContent: (
                            <View style={styles.modalContainer}>
                              <OtherCoursesComponent
                                {...otherCoursesComponentProps}
                                course={otherCourses}
                              />
                            </View>
                          )
                        }
                      );
                      props.navigation.navigate('Modal');
                    }
                  }
                >
                  <Text
                    style={styles.otherTitle}
                  >
                    {t('timetable:moreEvents')}
                  </Text>
                </TouchableOpacity>
                : null
            }
          </View>
          : <TimetableCodeInput
            onImportSuccessfullyFinished={
              // Wenn Stundenplan erfolgreich importiert wurde, wird der Stundenplan angezeigt
              () => setShowImport(false)
            }
          />
      }
    </SafeAreaView>
  );
}

const mapStateToProps = state => {
  return {
    pluginComponent: state.pluginReducer.timetable.component,
    pluginStyles: state.pluginReducer.timetable.styles,
    courses: state.apiReducer.courses,
    coursesStatus: state.apiReducer.coursesStatus,
    refreshing: state.stateReducer.refreshing,
    settings: state.settingReducer
  };
};

export default connect(mapStateToProps, { onUpdateRefreshing })(TimetableViewList)
