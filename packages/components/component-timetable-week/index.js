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

import { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import { withTranslation } from 'react-i18next';
import { Calendar } from 'react-native-big-calendar';
import { useCourses } from '@openasist/context-timetable';
import CalendarStrip from 'react-native-calendar-strip';
import { DateTime, Duration } from 'luxon';
import { TabView } from 'react-native-tab-view';
import { onUpdateRefreshing } from '@openasist/core';
import CourseDetailDialog from '@openasist/component-course-detail-dialog';
import moment from 'moment';
import 'moment/locale/de';

import componentStyles from './styles';

/**
 * Die Zeitspanne, welche vor und nach heute angezeigt werden soll.
 */
const daysTabDuration = Duration.fromISO('P6M');

/**
 *
 * @param {object} props
 * @param {(DateTime)=> void} props.onWeekChanged
 * @returns
 */
function CalendarWeek(props) {
  const { selectedISOWeek, theme, settings, calendarScrollOffsetMinutes, onWeekChanged, onCourseSelected } = props;

  const styles = useMemo(
    () => StyleSheet.create(componentStyles(theme)),
    [theme]
  );

  const { width } = useWindowDimensions();

  const [courses] = useCourses();

  const language = settings?.settingsGeneral?.language;

  const selectedWeekDate = useMemo(
    () => DateTime.fromISO(selectedISOWeek),
    [selectedISOWeek]
  );

  const now = DateTime.now()
  const todayWeekNumber = now.weekNumber;
  const todayWeekYearNumber = now.weekYear;

  const weeksTabViewRoutes = useMemo(
    () => {
      const todayWeekYear = DateTime.fromObject({ weekNumber: todayWeekNumber, weekYear: todayWeekYearNumber }).startOf('week');
      const beginWeekYear = todayWeekYear.minus(daysTabDuration).startOf('week');
      const endWeekYear = todayWeekYear.plus(daysTabDuration).endOf('week');
      let currentWeekYear = DateTime.fromObject(beginWeekYear.toObject());

      const weekYearRoutes = [];

      while (currentWeekYear <= endWeekYear) {
        const currentISOWeekYear = currentWeekYear.toISOWeekDate();

        const currentWeekYearBeginDate = currentWeekYear.startOf('week');
        const currentWeekYearEndDate = currentWeekYear.endOf('week');
        let currentWeekYearDate = DateTime.fromObject(currentWeekYearBeginDate.toObject());

        const currentWeekYearCourses = [];

        const eventColor = theme.colors.eventContainerSidebar;

        while (currentWeekYearDate <= currentWeekYearEndDate) {
          const currentWeekYearISODate = currentWeekYearDate.toISODate();
          const currentWeekYearDateCourses = courses?.[currentWeekYearISODate]
            ?.map(
              course => (
                {
                  title: course.title.data,
                  start: course.startDateTime,
                  end: course.endDateTime,
                  color: eventColor,
                  type: course.type?.data,
                  professor: course.lecturer[0]?.data,
                  room: course.room.data,
                }
              )
            ) ?? [];

          currentWeekYearCourses.push(currentWeekYearDateCourses);

          currentWeekYearDate = currentWeekYearDate.plus({ day: 1 });
        }

        weekYearRoutes.push(
          {
            key: currentISOWeekYear,
            weekbeginISODate: currentWeekYearBeginDate.toISODate(),
            week: currentWeekYear.weekNumber,
            weekYear: currentWeekYear.weekYear,
            events: currentWeekYearCourses.flat(),
          }
        );

        currentWeekYear = currentWeekYear.plus({ week: 1 });
      }

      return weekYearRoutes;
    },
    [todayWeekNumber, todayWeekYearNumber, courses]
  );

  const weeksTabViewIndexes = useMemo(
    () => weeksTabViewRoutes
      .reduce(
        (accumulator, currentRoute, currentIndex) =>
        (
          {
            ...accumulator,
            [currentRoute.key]: currentIndex
          }
        ),
        {}
      ),
    [weeksTabViewRoutes]
  )

  const weeksTabViewIndex = weeksTabViewIndexes[selectedISOWeek];

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

  const renderScene = useCallback(
    ({ route }) => {
      return (
        <View style={{ flex: 1, width: width }}>
          <Calendar
            events={route.events}
            renderEvent={renderEvent}
            renderHeader={() => null}
            mode={'week'}
            height={800}
            headerContentStyle={{ backgroundColor: 'transparent' }}
            weekStartsOn={1}
            date={route.weekbeginISODate}
            onPressEvent={
              (event) => {
                const eventDateISO = DateTime.fromJSDate(event.start).toISODate();

                const eventStartTime = event.start.getTime();
                const originalCourse = courses[eventDateISO]
                  ?.find(
                    course =>
                      eventStartTime === course.startDateTime.getTime()
                      &&
                      event?.title === course?.title?.data
                      &&
                      event?.professor === course?.lecturer[0]?.data
                      &&
                      event?.room === course?.room?.data
                  );

                onCourseSelected(originalCourse);
              }
            }
            swipeEnabled={false}
            scrollOffsetMinutes={calendarScrollOffsetMinutes}
            hourStyle={styles.hourStyle}
          />
        </View>
      );
    },
    [styles, width, courses, renderEvent]
  );

  return (
    <>
      <View style={styles.viewStrip}>
        <View pointerEvents="none">
          <CalendarStrip
            style={styles.strip}
            locale={{
              name: language,
              config: moment.localeData(language)
            }}
            highlightDateContainerStyle={styles.highlightDateContainer}
            showMonth={false}
            iconStyle={{ display: 'none' }}
            startingDate={selectedWeekDate.plus({ day: 1 }).toJSDate()}
            pointerEvents={'none'}
          />
        </View>
      </View>

      <TabView
        navigationState={{ index: weeksTabViewIndex, routes: weeksTabViewRoutes }}
        renderTabBar={() => null}
        lazy
        lazyPreloadDistance={2}
        onIndexChange={
          (index) => {
            const deltaISOWeekYear = weeksTabViewRoutes?.[index]?.key;
            onWeekChanged(deltaISOWeekYear);
          }
        }
        renderScene={renderScene}
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    settings: state.settingReducer,
  };
};

export default connect(mapStateToProps, { onUpdateRefreshing })(withTranslation()(withTheme(CalendarWeek)));
