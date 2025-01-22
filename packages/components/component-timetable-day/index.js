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
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import { withTranslation } from 'react-i18next';
import { onUpdateRefreshing } from '@openasist/core';
import componentStyles from "./styles";
import { Calendar } from 'react-native-big-calendar';
import { useCourses } from '@openasist/context-timetable';
import CalendarStrip from 'react-native-calendar-strip';
import CourseDetailDialog from '../component-course-detail-dialog';
import { DateTime, Duration } from 'luxon';
import { TabView } from 'react-native-tab-view';
import moment from 'moment';
import 'moment/locale/de';

/**
 * Die Zeitspanne, welche vor und nach heute angezeigt werden soll.
 */
const daysTabDuration = Duration.fromISO('P6M');

/**
 *
 * @param {object} props
 * @param {(DateTime) => void} props.onDateChanged Callback, welche aufgerufen wird, wenn der Tag in der Ansicht wechselt
 * @returns
 */
function CalendarDay({ selectedDate, theme, settings, calendarScrollOffsetMinutes, onDateChanged, onCourseSelected }) {
    const { appSettings: { modules: { timetable: { showDetails } } } } = theme;
    const today = DateTime.now().toISODate();

    const { width } = useWindowDimensions();

    const [courses] = useCourses();

    const language = settings?.settingsGeneral?.language;

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    const calendarStripMinDate = useMemo(
        () => DateTime.fromISO(today).minus(daysTabDuration).toJSDate(),
        [today, daysTabDuration]
    );

    const calendarStripMaxDate = useMemo(
        () => DateTime.fromISO(today).plus(daysTabDuration).toJSDate(),
        [today, daysTabDuration]
    );

    const daysTabViewRoutes = useMemo(
        () => {
            const dateRoutes = [];
            const todayDateTime = DateTime.fromISO(today);
            const beginDateTime = todayDateTime.minus(daysTabDuration);
            const endDateTime = todayDateTime.plus(daysTabDuration);
            let currentDateTime = DateTime.fromObject(beginDateTime.toObject());

            const eventColor = theme.colors.eventContainerSidebar;

            while (currentDateTime <= endDateTime) {
                const currentISODate = currentDateTime.toISODate();
                const currentDateTimeCourses = courses?.[currentISODate]
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

                dateRoutes.push(
                    {
                        key: currentISODate,
                        date: currentDateTime,
                        events: currentDateTimeCourses,
                    }
                );

                currentDateTime = currentDateTime.plus({ day: 1 });
            }

            return dateRoutes;
        },
        [today, courses, language]
    );

    const daysTabViewIndexes = useMemo(
        () => daysTabViewRoutes
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
        [daysTabViewRoutes]
    )

    const daysTabViewIndex = useMemo(
        () => {
            const selectedISODate = selectedDate.toISODate();
            return daysTabViewIndexes[selectedISODate];
        },
        [daysTabViewIndexes, selectedDate]
    )

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

    const renderScene = useCallback(
        ({ route }) => {
            return (
                <View style={{ flex: 1, width: width }}>
                    <Calendar
                        events={route.events}
                        renderEvent={renderEvent}
                        renderHeader={() => null}
                        overlapOffset={95}
                        mode={'day'}
                        height={800}
                        headerContentStyle={{ backgroundColor: 'transparent' }}
                        weekStartsOn={1}
                        date={route.key}
                        swipeEnabled={false}
                        onPressEvent={
                            showDetails
                                ? (event) => {
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
                                : null
                        }
                        scrollOffsetMinutes={calendarScrollOffsetMinutes}
                        hourStyle={styles.hourStyle}
                    />
                </View>
            );
        },
        [styles, calendarScrollOffsetMinutes, courses, width, renderEvent]
    );

    return (
        <>
            <View style={styles.stripShadow}>
                <CalendarStrip
                    style={styles.strip}
                    locale={{
                        name: language,
                        config: moment.localeData(language)
                    }}
                    selectedDate={selectedDate.toJSDate()}
                    onDateSelected={
                        (date) =>
                            onDateChanged?.(
                                DateTime.fromObject(
                                    {
                                        year: date.year(),
                                        month: date.month() + 1,
                                        day: date.date(),
                                    }
                                )
                            )
                    }
                    highlightDateContainerStyle={styles.highlightDateContainer}
                    showMonth={false}
                    iconStyle={{ display: 'none' }}
                    scrollable={true}
                    minDate={calendarStripMinDate}
                    maxDate={calendarStripMaxDate}
                />
            </View>

            <TabView
                navigationState={{ index: daysTabViewIndex, routes: daysTabViewRoutes }}
                renderTabBar={() => null}
                lazy
                lazyPreloadDistance={1}
                onIndexChange={
                    (index) => {
                        const currentDateTime = daysTabViewRoutes?.[daysTabViewIndex].date;
                        const indexDelta = index - daysTabViewIndex;
                        const deltaDateTime = currentDateTime.plus({ days: indexDelta });
                        onDateChanged?.(deltaDateTime);
                    }
                }
                renderScene={renderScene}
            />
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