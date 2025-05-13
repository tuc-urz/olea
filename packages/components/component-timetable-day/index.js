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

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import { withTranslation } from 'react-i18next';
import { onUpdateRefreshing } from '@olea/core';
import componentStyles from "./styles";
import { Calendar } from 'react-native-big-calendar';
import { useCourses } from '@olea/context-timetable';
import CalendarStrip from 'react-native-calendar-strip';
import CourseDetailDialog from '../component-course-detail-dialog';
import { DateTime } from 'luxon';
import { TabView } from 'react-native-tab-view';
import moment from 'moment';

const getWeekNumber = (d) => {
  if (!(d instanceof Date)) {
    console.error('Invalid date object:', d);
    return null;
  }
  // Kopiere das Datum, damit das Original nicht verändert wird
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Setze den Donnerstag der aktuellen Woche
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Berechne den ersten Tag des Jahres
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Berechne die Kalenderwoche
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNo;
};

function CalendarDay(props) {
  const { theme, today, setKw, setMonth, settings, coursesImportedYet } = props;
  const styles = useMemo(() => (
    StyleSheet.create(componentStyles(theme))
  ), [theme]);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tabIndex, setTabIndex] = useState(182);

  const [selectedDate, setSelectedDate] = useState(today);

  const { height, width } = useWindowDimensions();

  const [courses, refreshCourses] = useCourses();

  const selectedDateISO = DateTime.fromISO(JSON.stringify(selectedDate).slice(1, -1)).toISODate();

  const language = settings?.settingsGeneral?.language;

  const generateRoutes = useMemo(() => {
    if (!coursesImportedYet) {
      const currentDay = new Date(today);
      const currentDateISO = DateTime.fromJSDate(currentDay).toISODate();
      const eventsForDate = [];
      return [{
        key: `day0`,
        title: currentDay.toLocaleDateString(language, { weekday: 'short', day: 'numeric', month: 'numeric' }),
        date: currentDay,
        events: eventsForDate
      }];
    }
    const daysToRender = 365;
    return Array.from({ length: daysToRender }, (_, index) => {
      const currentDay = new Date(today);
      currentDay.setDate(currentDay.getDate() + (index - 182));
  
      const currentDateISO = DateTime.fromJSDate(currentDay).toISODate();
  
      const eventsForDate = courses?.[currentDateISO]?.map(course => ({
        title: course.title.data,
        start: course.startDateTime,
        end: course.endDateTime,
        color: theme.colors.eventContainerSidebar,
        type: course.type?.data,
        professor: course.lecturer[0]?.data,
        room: course.room.data
      })) ?? [];
  
      return {
        key: `day${index - 182}`,
        title: currentDay.toLocaleDateString(language, { weekday: 'short', day: 'numeric', month: 'numeric' }),
        date: currentDay,
        events: eventsForDate
      };
    });
  }, [courses, language, coursesImportedYet]);

  useEffect(() => {
    setKw(getWeekNumber(today));
    setMonth(today.getMonth());
    setSelectedDate(today);
    setTabIndex(182);
  }, [today]);

  const renderEvent = useCallback((event, touchableOpacityProps) => {
    const { style, ...restTouchableOpacityProps } = touchableOpacityProps;
    return (
      <TouchableOpacity {...restTouchableOpacityProps} style={[style, styles.eventContainer, { borderLeftColor: event.color || '#000' }]} >
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle} numberOfLines={1} ellipsizeMode="tail">
            {event.title}
          </Text>
          <Text style={styles.eventType} numberOfLines={1} ellipsizeMode="tail">
            {event.type}
          </Text>
        </View>
        <Text style={styles.eventProfessor} numberOfLines={1} ellipsizeMode="head">
          {event.professor}
        </Text>
        <View style={styles.eventFooter}>
          <Text style={styles.eventTime} numberOfLines={1} ellipsizeMode="tail">
            {`${event.start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} - ${event.end.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`}
          </Text>
          <Text style={styles.eventRoom} numberOfLines={1} ellipsizeMode="tail">
            {event.room}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [styles]);

  const renderHeader = useCallback(() => (
    <View style={styles.stripShadow}>
      <CalendarStrip
        style={styles.strip}
        locale={{
          name: language,
          config: moment.localeData(language)
        }}
        selectedDate={selectedDate}
        onDateSelected={(date) => {
          const oldDate = selectedDate
          if (date > oldDate) {
            const newTabIndex = tabIndex + Math.ceil((date - oldDate) / 86400000);
            setTabIndex(newTabIndex);
            setSelectedDate(date);
          } else {
            const newTabIndex = tabIndex + Math.ceil((date - oldDate) / 86400000);
            setTabIndex(newTabIndex);
            setSelectedDate(date);
          }
          setKw(getWeekNumber(new Date(date)));
          setMonth(new Date(date).getMonth());
        }}
        highlightDateContainerStyle={styles.highlightDateContainer}
        showMonth={false}
        iconStyle={{ display: 'none' }}
        scrollable={true}
        minDate={DateTime.fromJSDate(today).minus({ months: 6 }).toJSDate()}
        maxDate={DateTime.fromJSDate(today).plus({ months: 6 }).toJSDate()} />
    </View>
  ), [selectedDate]);

  const renderScene = ({ route }) => {
    const currentIndex = generateRoutes.findIndex(r => r.key === route.key);
    if (Math.abs(currentIndex - tabIndex) <= 1) {
      return (
        <View style={{ flex: 1, width: width }}>
          <Calendar
            events={route.events}
            renderEvent={renderEvent}
            renderHeader={() => null}
            overlapOffset={Math.round(width / 2.5)}
            mode={'day'}
            height={800}
            headerContentStyle={{ backgroundColor: 'transparent' }}
            weekStartsOn={1}
            date={selectedDate}
            onPressEvent={(event) => {
              setDialogVisible(true);
              setSelectedEvent(event);
            }}
            scrollOffsetMinutes={390}
            hourStyle={styles.hourStyle}
          />
        </View>);
    } return null;
  };

  const renderTabView = useCallback(() => {
    return(
    <TabView
      navigationState={{ index: tabIndex, routes: generateRoutes }}
      renderTabBar={() => null}
      lazy
      lazyPreloadDistance={1}
      onIndexChange={(index) => {
        if (index > tabIndex) {
          const newDate = new Date(selectedDate);
          newDate.setDate(newDate.getDate() + 1);
          setSelectedDate(newDate);
          setKw(getWeekNumber(new Date(newDate)));
          setMonth(new Date(newDate).getMonth());
          setTabIndex(index);
        } else {
          const newDate = new Date(selectedDate);
          newDate.setDate(newDate.getDate() - 1);
          setSelectedDate(newDate);
          setKw(getWeekNumber(new Date(newDate)));
          setMonth(new Date(newDate).getMonth());
          setTabIndex(index);
        }
      }}
      renderScene={renderScene} >
    </TabView>);
  }, [generateRoutes, tabIndex, coursesImportedYet]);

  return (

    <>

      {renderHeader()}

      {renderTabView()}

      {dialogVisible && selectedEvent && (
        <CourseDetailDialog
          visible={dialogVisible}
          hideDialog={() => setDialogVisible(false)}
          course={selectedEvent}
          styles={styles}
          {...props}
        />
      )}
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    pluginComponent: state.pluginReducer.timetable.component,
    pluginStyles: state.pluginReducer.timetable.styles,
    settings: state.settingReducer,
    refreshing: state.stateReducer.refreshing,

  };
};

export default connect(mapStateToProps, { onUpdateRefreshing })(withTranslation()(withTheme(CalendarDay)));