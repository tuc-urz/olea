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
    View,
} from 'react-native';

import { connect } from 'react-redux'
import { useTheme, Text, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { onUpdateRefreshing } from "@olea-bps/core";

import IconsOpenasist from "@olea-bps/icons-openasist";

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
    const { colors, themeStyles, appSettings } = theme;

    const accessibilityStartTime = t('accessibility:timetable:startTime') + times?.start.slice(0, 2) + ' ' + t('accessibility:pts:speechTime') + ' ' + (times?.start.slice(3, 5) !== '00' ? times?.start.slice(3, 5) : '') + ',';
    const accessibilityEndTime = t('accessibility:timetable:endTime') + times?.end.slice(0, 2) + ' ' + t('accessibility:pts:speechTime') + ' ' + (times?.end.slice(3, 5) !== '00' ? times?.end.slice(3, 5) : '') + ',';

    const isBigFont = settings.settingsAccessibility.increaseFontSize;
    const showDetails = appSettings?.modules?.timetable?.showDetails;

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    )

    const renderTimeSlot = (
        <View style={isBigFont ? [styles.courseTimeContainer, styles.courseTimeContainerBigFont] : styles.courseTimeContainer}>
            <Text accessibilityLabel={accessibilityStartTime} style={isBigFont ? [styles.timeText, styles.timeTextBig] : styles.timeText}>{times?.start || ''}</Text>
            <View style={styles.verticalSeperatorSmall} />
            <Text accessibilityLabel={accessibilityEndTime} style={isBigFont ? [styles.timeText, styles.timeTextBig] : styles.timeText}>{times?.end || ''}</Text>
        </View>
    );
    var renderVerticalSeperator = (
        <View
            style={styles.verticalSeperator}
        />
    );

    const { type, title, room, lecturer, info, url } = course;

    const courseContainerBigFont = isBigFont ? styles.courseContainerBigFont : null;
    const titleStyle = isBigFont ? styles.titleBigFont : styles.title;


    return (

        <View style={isBigFont ? [themeStyles.card, styles.courseCard] : themeStyles.card}>
            {times ? renderTimeSlot : null}
            {times ? renderVerticalSeperator : null}
            <View style={times ? [styles.courseContainer, courseContainerBigFont] : styles.otherCourseContainer}>
                {(type && type.data) ? <Text style={times ? [styles.type, styles.addLeftRightPadding] : styles.type} >{type.data}</Text> : null}
                {(title && title.data) ? <Text style={times ? [titleStyle, styles.addLeftRightPadding] : styles.title}>{title.data}</Text> : null}
                {(room && room.data) ? <Text style={times ? [styles.room, styles.addLeftRightPadding] : styles.room} >{room.data}</Text> : null}
                {(lecturer && lecturer[0] && lecturer[0].data) ?
                    <Text style={times ? [styles.professorText, styles.addLeftRightPadding] : styles.professorText}>
                        Tutor: <Text style={styles.professorName}>{lecturer.map(lecturer => lecturer.data).join(',') || ''}</Text>
                    </Text> : null
                }
            </View>
            {showDetails && (room?.data || info?.data || url?.data) ?
                <View style={styles.btnPosition}>
                    <Button style={styles.btnAddionals} onPress={() => onCourseSelected?.(course)}>
                        <IconsOpenasist icon={"info"} color={colors.secondaryText} size={22} />
                    </Button>
                </View>
                : null}
        </View>
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
