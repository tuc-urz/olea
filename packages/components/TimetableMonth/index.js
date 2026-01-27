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
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import { withTranslation } from 'react-i18next';
import { onUpdateRefreshing } from '@olea-bps/core';
import componentStyles from "./styles";
import { Calendar } from 'react-native-big-calendar';
import { useCourses } from '@olea-bps/context-timetable';
import CourseDetailDialog from '../CourseDetailDialog';
import CalendarStrip from 'react-native-calendar-strip';
import { DateTime } from 'luxon';

function CalendarMonth(props) {
  const { theme, setMonth, today, locale, onMonthChanged, calendarHeight } = props;
  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme]
  );

  const [courses, refreshCourses] = useCourses();
  const selectedDate = useRef(new Date());
  const [selectedDateState, setSelectedDateState] = useState(selectedDate.current);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const selectedDateStartISO = DateTime.fromISO(JSON.stringify(selectedDate.current).slice(1, -1)).startOf('month').toISODate();
  const selectedDateEndISO = DateTime.fromISO(JSON.stringify(selectedDate.current).slice(1, -1)).endOf('month').toISODate();

  useEffect(() => {
    refreshCourses(selectedDateStartISO, selectedDateEndISO);
  }, [selectedDateStartISO, selectedDateEndISO]);

  const handleDateChange = (date) => {
    selectedDate.current = date;
    setSelectedDateState(date);
  };

  const monthCourses = useMemo(() => {
    const startDate = DateTime.fromISO(selectedDateStartISO);
    const daysInMonth = startDate.daysInMonth;
    const daysArray = Array.from({ length: daysInMonth }, (_, index) => startDate.plus({ days: index }).toISODate());
    return daysArray.reduce((acc, date) => acc.concat(courses?.[date] ?? []), []);
  }, [selectedDateStartISO, courses]);

  const monthEvents = useMemo(() => {
    try {
      return monthCourses
        .map(course => {
          return {
            title: course.title.data,
            start: course.startDateTime,
            end: course.endDateTime,
            color: '#a3f2c5',
            type: course.type?.data,
            professor: course.lecturer[0]?.data,
            room: course.room.data
          };
        });
    } catch (error) {
      console.error('Error in useMemo for monthEvents:', error);
      return [];
    }
  }, [monthCourses]);

  useEffect(() => {
    handleDateChange(today);
    setMonth(today.getMonth());
  }, [today, setMonth]);

  const renderEvent = useCallback((event, touchableOpacityProps) => {
    const { style, ...restTouchableOpacityProps } = touchableOpacityProps;

    return (
      <TouchableOpacity {...restTouchableOpacityProps}
        style={[style, styles.event]}
      >
        <Text style={styles.eventTitle} numberOfLines={1}>
          {event.title}
        </Text>
      </TouchableOpacity>
    );
  }, [styles]);

  const renderHeader = useCallback(() => (
    <View pointerEvents="none">
      <CalendarStrip
        style={styles.strip}
        locale={locale}
        selectedDate={today}
        showDayNumber={false}
        dateNameStyle={{ fontWeight: 'bold', fontSize: 14 }}
        highlightDateNameStyle={{ fontWeight: 'bold', fontSize: 14 }}
        highlightDateContainerStyle={styles.highlightDateContainer}
        iconStyle={{ display: 'none' }}
        showMonth={false}
        startingDate={selectedDate.current}
      />

    </View>
  ), [selectedDate]);

  return (
    <>
      <Calendar
        events={monthEvents}
        renderEvent={renderEvent}
        renderHeaderForMonthView={renderHeader}
        date={selectedDate.current}
        height={calendarHeight}
        mode={'month'}
        headerContentStyle={{ backgroundColor: 'transparent' }}
        weekStartsOn={1}
        onSwipeEnd={(date) => {
          handleDateChange(date);
          setMonth(new Date(date).getMonth());
        }}
        onPressEvent={(event) => {
          setDialogVisible(true);
          setSelectedEvent(event);
        }}
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

export default connect(mapStateToProps, { onUpdateRefreshing })(withTranslation()(withTheme(CalendarMonth)));