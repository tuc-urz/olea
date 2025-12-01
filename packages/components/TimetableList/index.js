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

import { useMemo } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

import { connect } from 'react-redux'
import {
    useTheme,
    Text,
} from "react-native-paper";
import { useTranslation } from "react-i18next";

import { onUpdateRefreshing } from "@olea-bps/core";

import { DateTime } from 'luxon';

import componentStyles from "./styles";

/**
 * Timetable List Component
 *
 * Displays the list for timetable,
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 *
 * @param {object} props
 * @param {(course: object) => void} [props.onCourseSelected]
 */
function TimetableListComponent({ course, times, settings, onCourseSelected }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { themeStyles, appSettings } = theme;

    const courseTitle = course?.title?.data;
    const courseType = course?.type?.data;
    const courseRoom = course?.room?.data;
    const courseStartDatetime = DateTime.fromISO(course.startDateTime);
    const courseStarTimeText = courseStartDatetime.isValid
        ? courseStartDatetime?.toLocaleString(DateTime.TIME_24_SIMPLE)
        : undefined;
    const courseEndDatetime = DateTime.fromISO(course.endDateTime);
    const courseEndTimeText = courseEndDatetime.isValid
        ? courseEndDatetime?.toLocaleString(DateTime.TIME_24_SIMPLE)
        : undefined;
    const courseTimesTextesAvaiable = courseStartDatetime && courseEndTimeText ? true : false;
    const courseLecturers = course?.lecturer
        ?.map(lecturer => lecturer.data);
    const courseLecturersAmount = Array.isArray(courseLecturers)
        ? courseLecturers.length
        : 0;
    const courseInfo = course?.info?.data;
    const courseUrl = course?.url?.data;

    const courseAccessibilityText = t(
        'accessibility:timetable:courseSummary',
        {
            type: courseType,
            title: courseTitle,
            startTime: courseStarTimeText,
            endTime: courseEndTimeText,
            room: courseRoom,
        }
    );

    const isBigFont = settings.settingsAccessibility.increaseFontSize;
    const showDetails = appSettings?.modules?.timetable?.showDetails;

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    )

    const courseContainerBigFont = isBigFont ? styles.courseContainerBigFont : null;
    const titleStyle = isBigFont ? styles.titleBigFont : styles.title;
    const coursePressable = showDetails &&
        (
            courseTitle ||
            courseType ||
            courseRoom ||
            courseLecturersAmount ||
            courseInfo ||
            courseUrl ||
            courseStarTimeText ||
            courseEndTimeText
        );

    return (
        <TouchableOpacity
            style={isBigFont ? [themeStyles.card, styles.courseCard] : themeStyles.card}
            accessibilityLabel={courseAccessibilityText}
            onPress={
                coursePressable
                    ? () => onCourseSelected?.(course)
                    : null
            }
            disabled={!coursePressable}
        >
            {
                courseTimesTextesAvaiable
                    ? <View style={isBigFont ? [styles.courseTimeContainer, styles.courseTimeContainerBigFont] : styles.courseTimeContainer}>
                        <Text style={isBigFont ? [styles.timeText, styles.timeTextBig] : styles.timeText}>
                            {courseStarTimeText}
                        </Text>
                        <View style={styles.verticalSeperatorSmall} />
                        <Text style={isBigFont ? [styles.timeText, styles.timeTextBig] : styles.timeText}>
                            {courseEndTimeText}
                        </Text>
                    </View>
                    : null
            }
            {
                courseTimesTextesAvaiable
                    ? <View style={styles.verticalSeperator} />
                    : null
            }
            <View style={courseTimesTextesAvaiable ? [styles.courseContainer, courseContainerBigFont] : styles.otherCourseContainer}>
                {
                    courseType
                        ? <Text style={courseTimesTextesAvaiable ? [styles.type, styles.addLeftRightPadding] : styles.type} >
                            {courseType}
                        </Text>
                        : null
                }
                {
                    courseTitle
                        ? <Text style={courseTimesTextesAvaiable ? [titleStyle, styles.addLeftRightPadding] : styles.title}>
                            {courseTitle}
                        </Text>
                        : null}
                {
                    courseRoom
                        ? <Text style={courseTimesTextesAvaiable ? [styles.room, styles.addLeftRightPadding] : styles.room} >
                            {courseRoom}
                        </Text>
                        : null
                }
                {
                    courseLecturersAmount ?
                        <Text style={courseTimesTextesAvaiable ? [styles.professorText, styles.addLeftRightPadding] : styles.professorText}>
                            Tutor:
                            <Text style={styles.professorName}>
                                {courseLecturers.join(', ')}
                            </Text>
                        </Text>
                        : null
                }
            </View>
        </TouchableOpacity>
    );
}

const mapStateTo = state => {
    return {
        pluginComponent: state.pluginReducer.timetable.component,
        pluginStyles: state.pluginReducer.timetable.styles,
        settings: state.settingReducer
    };
};

export default connect(mapStateTo, { onUpdateRefreshing })(TimetableListComponent)
