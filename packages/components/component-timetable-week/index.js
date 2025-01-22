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

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import { withTranslation } from 'react-i18next';
import { onUpdateRefreshing } from '@openasist/core';
import componentStyles from "./styles";
import { Calendar } from 'react-native-big-calendar';
import { useCourses } from '@openasist/context-timetable';
import CalendarStrip from 'react-native-calendar-strip';
import CourseDetailDialog from '../component-course-detail-dialog';
import { DateTime } from 'luxon';
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

function CalendarWeek(props) {
  const { theme, setKw, setMonth, today, settings } = props;
  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme]
  );
  const [courses, refreshCourses] = useCourses();
  const selectedDate = useRef(new Date());
  const [selectedDateState, setSelectedDateState] = useState(selectedDate.current);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const selectedDateStartISO = DateTime.fromISO(JSON.stringify(selectedDate.current).slice(1, -1)).startOf('week').toISODate();
  const selectedDateEndISO = DateTime.fromISO(JSON.stringify(selectedDate.current).slice(1, -1)).endOf('week').toISODate();

  const language = settings?.settingsGeneral?.language;

  useEffect(() => {
    refreshCourses(selectedDateStartISO, selectedDateEndISO);
  }, [selectedDateStartISO, selectedDateEndISO]);

  const weekCourses = useMemo(() => {
    const startDate = DateTime.fromISO(selectedDateStartISO);
    const daysArray = Array.from({ length: 7 }, (_, index) => startDate.plus({ days: index }).toISODate());
    return daysArray.reduce((acc, date) => acc.concat(courses?.[date] ?? []), []);
  }, [selectedDateStartISO, courses]);

  const handleDateChange = (date) => {
    selectedDate.current = date;
    setSelectedDateState(date);
  };

  useEffect(() => {
    handleDateChange(today);
    setKw(getWeekNumber(today));
    setMonth(today.getMonth());
  }, [today, setKw, setMonth]);

  const weekEvents = useMemo(() => {
    try {
      return weekCourses
        .map(course => {
          return {
            title: course.title.data,
            start: course.startDateTime,
            end: course.endDateTime,
            color: theme.colors.eventContainerSidebar,
            type: course.type?.data,
            professor: course.lecturer[0]?.data,
            room: course.room.data
          };
        });

    } catch (error) {
      console.error('Error in useMemo for weekEvents:', error);
      return [];
    }
  }, [weekCourses]);

  const renderHeader = useCallback(() => (
    <View style={styles.viewStrip}>
      <View pointerEvents="none">
        <CalendarStrip
          style={styles.strip}
          locale={{
            name: language,
            config: moment.localeData(language)
          }}
          selectedDate={today}
          highlightDateContainerStyle={styles.highlightDateContainer}
          showMonth={false}
          iconStyle={{ display: 'none' }}
          startingDate={selectedDate.current}
          pointerEvents={'none'}
        />
      </View>
    </View>
  ), []);


  const renderEvent = useCallback((event, touchableOpacityProps) => {
    const { style, ...restTouchableOpacityProps } = touchableOpacityProps;
    return (
      <>
        <TouchableOpacity
          {...restTouchableOpacityProps}
          style={[style, styles.eventContainer, { borderTopColor: event.color || '#000' }]}
        >
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle} numberOfLines={2} ellipsizeMode={'clip'} >{event.title}</Text>
          </View>
          <Text style={styles.eventRoom} numberOfLines={1} ellipsizeMode={'clip'}>{event.room}</Text>
        </TouchableOpacity>
      </>
    );
  }, [styles]);

  return (
    <>
      <Calendar
        events={weekEvents}
        renderEvent={renderEvent}
        renderHeader={renderHeader}
        date={selectedDate.current}
        height={800}
        mode={'week'}
        headerContentStyle={{ backgroundColor: 'transparent' }}
        weekStartsOn={1}
        onSwipeEnd={(date) => {
          handleDateChange(date);
          setKw(getWeekNumber(date));
          setMonth(new Date(date).getMonth());
        }}
        onPressEvent={(event) => {
          setDialogVisible(true);
          setSelectedEvent(event);
        }}
        scrollOffsetMinutes={390} //setzt den Scroll-Startpunkt des Kalenders auf 6:30 Uhr
      />
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
  );
}

const mapStateToProps = (state) => {
  return {
    settings: state.settingReducer,
  };
};

export default connect(mapStateToProps, { onUpdateRefreshing })(withTranslation()(withTheme(CalendarWeek)));