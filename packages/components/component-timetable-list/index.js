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

import { useMemo, useState } from 'react';
import {
    StyleSheet,
    View,
    Linking,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux'
import { useTheme, Text, Dialog, Button, Portal } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { onUpdateRefreshing } from "@olea/core";

import IconsOpenasist from "@olea/icons-openasist";

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
 */


function TimetableListComponent(props) {
    const { course, times, settings } = props;
    const { t } = useTranslation();
    const theme = useTheme();
    const { colors, themeStyles, appSettings } = theme;

    const accessibilityStartTime = t('accessibility:timetable:startTime') + times?.start.slice(0, 2) + ' ' + t('accessibility:pts:speechTime') + ' ' + (times?.start.slice(3, 5) !== '00' ? times?.start.slice(3, 5) : '') + ',';
    const accessibilityEndTime = t('accessibility:timetable:endTime') + times?.end.slice(0, 2) + ' ' + t('accessibility:pts:speechTime') + ' ' + (times?.end.slice(3, 5) !== '00' ? times?.end.slice(3, 5) : '') + ',';

    const isBigFont = settings.settingsAccessibility.increaseFontSize;
    const showDetails = appSettings?.modules?.timetable?.showDetails;

    const [dialogVisible, setDialogVisible] = useState(false);

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
                    <Button style={styles.btnAddionals} onPress={() => setDialogVisible(true)}>
                        <IconsOpenasist icon={"info"} color={colors.secondaryText} size={22} />
                    </Button>
                    {dialogVisible ? <CourseDetailDialog visible={dialogVisible} hideDialog={() => setDialogVisible(false)} course={course} styles={styles} showDetails={showDetails} {...props} /> : null}
                </View>
                : null}
        </View>


    );

}

function CourseDetailDialog(props) {
    const { visible, hideDialog, course, showDetails } = props;
    const { title, room, info, url } = course;
    const { t } = useTranslation();
    return (
        showDetails ?
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>{title.data}</Dialog.Title>
                    <Dialog.Content>
                        <CourseDetailDialogText {...props } detail={room} icon={"map-search"}/>
                        <CourseDetailDialogText {...props } detail={info}/>
                        <CourseDetailDialogText {...props } detail={url} icon={"forward"}/>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>{t('timetable:close')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            : null
    );

}

function CourseDetailDialogText(props) {
    const { colors } = useTheme();
    const { styles, settings, icon, detail } = props;
    const isBigFont = settings.settingsAccessibility.increaseFontSize;

    const commonJSX =
        (
            <>
                <Text style={[styles.detailLabel, isBigFont ? styles.textDetailBigFont : styles.textDetail]}>{detail?.displayname}</Text>
                <Text style={[styles.detailValue, isBigFont ? styles.textDetailBigFont : styles.textDetail]} numberOfLines={1} ellipsizeMode='tail'>{detail?.data}</Text>
                {icon ? <IconsOpenasist icon={icon} size={25} color={colors.icon} /> : null}
            </>
        );
   
    return (
        detail?.data ?

            detail?.url ?

                <TouchableOpacity style={[styles.detailContainer, styles.textDetail]} onPress={() => Linking.openURL(detail?.url)} >
                    {commonJSX}
                </TouchableOpacity>

                :

                <View style={[styles.detailContainer, styles.textDetail]}>
                    {commonJSX}
                </View>

            : null
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
