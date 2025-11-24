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

import React, { useState, useMemo, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import moment from 'moment';
import { DateTime } from 'luxon';

import IconsOpenasist from '@olea-bps/icons-openasist';
import { useDateCourses } from '@olea-bps/context-timetable';

import componentStyles from './styles';

/**
 * Course Info Component
 *
 * Shows the informations of the next course, if the student has imported a timetable.
 * If where is no timetable available, a notice will be displayed.
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
export default function CourseInfoComponent(props) {
    const componentName = CourseInfoComponent.name;
    const theme = useTheme();
    const { colors } = theme;
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [now, setNow] = useState(moment());

    const todayDate = DateTime.now().toISODate();
    const academicQuarter = moment.duration(30, 'minutes');

    // Vorlesungen von Stundenplan-Kontext abrufen, die heute stattfinden.
    const [courses] = useDateCourses(todayDate);

    console.debug(componentName, ': Count of courses: ', courses?.length ?? 0);

    // Genieren der Styles, wenn nicht vorhanden oder das Theme sich geändert hat
    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    const isoWeekDaysLabels = useMemo(
        () => new Map(
            ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
                .map(
                    (dayTranslationLabel, index) =>
                        [
                            index + 1,
                            {
                                short: t(`common:day${dayTranslationLabel}Short`),
                                long: t(`common:day${dayTranslationLabel}`),
                            }
                        ]
                )
        ),
        [t]
    );

    // Suchen der nächsten Vorlesung
    const nextCourse = courses
        // Berechnen der heutigen Startzeitpunkt der Vorlesung als Datetime und speichern als startMoment-Property.
        // Berechnen der heutigen mit academischen Viertel der Vorlesung als Datetime und speichern als academicQuarterMoment-Property.
        ?.map?.(course => {
            // Holen der Uhrzeit der Vorlesung
            const courseTime = course.times[0];
            // Erstellen der datetime aus dem heutigen Datum und der Enduhrzeit
            const courseStartMoment = moment(courseTime.start, 'HH:mm');

            return {
                ...course,
                startMoment: courseStartMoment,
                academicQuarterMoment: courseStartMoment.add(academicQuarter),
                // Ursprüngliche Vorlesung als eigene Instanz einbetten
                // Diese Instanze sollte als Abhängigkeit für Hooks verwendet werden, hier bei jedem Rendern eine neue Instaze entsteht
                origineCourse: course,
            }
        })
        // Sortieren der Vorlesung nach ihren Start-Datetimes. unix()-Methode gibt einen Integer-Zeitstempel zurück.
        ?.sort?.((courseA, courseB) => courseA.startMoment.unix() - courseB.startMoment.unix())
        // Suche die erste Vorlesung, anhand der Startzeit mit academischen Viertel nach Jetzt ist.
        ?.find?.(course => course.academicQuarterMoment.isAfter(now));

    const nextOrigineCourse = nextCourse?.origineCourse

    console.debug(componentName, ': next course:', nextCourse);

    // now neu setzen, wenn die nächste Vorlesung anfängt oder der Tag zu Ende ist
    useEffect(
        () => {
            // Millisekunden bis zum anzeigen der nächste Vorlesung bzw. des Tagesende ausrechnen und den mathematischen Betrag nehmen
            const timeoutToCalculateNextCourse = Math.abs(
                moment().diff(
                    // Prüfen ob es heute noch eine Vorlesung geben wird
                    nextCourse
                        // Es wird der Anfang mit academischen Viertel der nächsten/aktuellen Vorlesung genommen
                        ? nextCourse.academicQuarterMoment
                        // Es wird das Ende des heutigen Tages genommen
                        : moment().endOf('day')
                )
            );

            console.debug(componentName, ': recalculating next course in ', timeoutToCalculateNextCourse, ' miliseconds');

            // Timer setzen und Handel zum Löschen des Timeouts zwischenspeichern
            const timeoutHandle = setTimeout(() => setNow(moment()), timeoutToCalculateNextCourse);
            return () => {
                // Timer löschen, falls die nächste Vorlesung wechselt
                clearTimeout(timeoutHandle);
            }
        },
        [nextOrigineCourse]
    );

    const errorMessage = !nextOrigineCourse && courses?.length ? t('course:noLecturesAvailable') : t('course:noLectureFound');

    return useMemo(
        () => {
            const courseTitle = nextOrigineCourse?.title?.data;
            const courseTime = nextOrigineCourse?.times?.[0];
            const courseIsoDayOfWeek = courseTime?.dayOfWeek;
            const courseWeekDaysLabels = isoWeekDaysLabels.get(courseIsoDayOfWeek);

            const courseTimeStart = courseTime?.start;
            const courseTimeStartAccessibility = courseTimeStart
                ? courseTimeStart.slice(0, 2) + ' ' + t('accessibility:pts:speechTime') + ' ' + (courseTimeStart.slice(3, 5) !== '00' ? courseTimeStart.slice(3, 5) : '') + ','
                : null;

            const courseTimeEnd = courseTime?.end;
            const coursetimeEndAccessibility = courseTimeEnd
                ? courseTimeEnd.slice(0, 2) + ' ' + t('accessibility:pts:speechTime') + ' ' + (courseTimeEnd.slice(3, 5) !== '00' ? courseTimeEnd.slice(3, 5) : '') + ','
                : null;

            const courseDayOfWeek = courseWeekDaysLabels?.short;
            const courseDayOfWeekAccessibility = courseWeekDaysLabels?.long;

            const courseTimeText = courseDayOfWeek && courseTimeStart && courseTimeEnd
                ? `${courseDayOfWeek} ${courseTimeStart} - ${courseTimeEnd}`
                : t('common:noDetails');

            const courseTimeAccessibility = courseDayOfWeekAccessibility && courseTimeStartAccessibility && coursetimeEndAccessibility
                ? `${courseDayOfWeekAccessibility} ${t('accessibility:timetable:at')} ${courseTimeStartAccessibility} ${t('accessibility:timetable:to')} ${coursetimeEndAccessibility}`
                : null;

            const courseRoom = Array.isArray(nextOrigineCourse?.room)
                ? nextOrigineCourse?.room?.[0]?.data
                : nextOrigineCourse?.room?.data;

            const courseRoomText = courseRoom?.replace(/\([\w\W]+/, '') ?? t('common:noDetails');

            return (
                <TouchableOpacity
                    onPress={
                        () => navigation.navigate(
                            'timetableModule',
                            nextOrigineCourse
                                ? { course: nextOrigineCourse }
                                : { showCodeInput: true }
                        )
                    }
                    accessible={true}
                    accessibilityLabel={t('course:nextLecture')}
                    accessibilityHint={
                        nextOrigineCourse
                            ? [courseTitle, courseTimeAccessibility, courseRoom].join(' ')
                            : errorMessage
                    }
                >
                    <View style={styles.container}>
                        <Text style={styles.headline}>{t('course:nextLecture')}</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <View style={styles.iconContainer}>
                            <IconsOpenasist icon={"timetable"} color={colors.black} size={40} />
                        </View>
                        {
                            nextOrigineCourse
                                ? <View style={styles.contentContainer}>
                                    <Text style={styles.title}>{courseTitle}</Text>
                                    <Text style={styles.title}>{courseTimeText}{courseTimeText && courseRoomText ? ' | ' : ''}{courseRoomText}</Text>
                                </View>
                                : <View style={styles.contentContainer}>
                                    <Text style={styles.title}>{errorMessage}</Text>
                                </View>
                        }
                    </View>
                </TouchableOpacity>
            )
        },
        [nextOrigineCourse, errorMessage, navigation, styles, t, colors]
    );
}
