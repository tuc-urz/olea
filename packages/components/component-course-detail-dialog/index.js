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
    Linking,
    TouchableOpacity
} from 'react-native';

import { useTheme, Text, Dialog, Portal } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import IconsOpenasist from '@openasist/icons-openasist';
import { useIncreaseFontSize } from '@openasist/core';

import componentStyles from './styles';

/**
 * Ein Dialog, der sich über die derzeitige Ansicht legt, welcher die Detailinformationen zu einer Vorlesung anzeigt.
 *
 * @param {object} props
 * @param {object} props.course Das JSON-Objekt, welches die Daten der Vorlesung enthält
 * @param {boolean} props.visible `true`, wenn der Dialog angezeigt werden soll, ansonsten `false`
 * @param {() => void} [props.onClose]
 * @param {() => void} [props.onDismiss]
 * @example
 * const [showDetailDialog, setShowDetailDialog] = useState(true);
 *
 * const course = {
 *     title:     { displayName: 'Bezeichnung', data: 'Programierung' },
 *     room:      { displayName: 'Raum',        data: '13.344.3' },
 *     startTime: { displayName: 'Begin',       data: '12:00' }
 * };
 *
 * return (
 *     <CourseDetailDialog
 *         course={course}
 *         visible={showDetailDialog}
 *         onDismiss={() => setShowDetailDialog(false)}
 *         onClose={() => setShowDetailDialog(false)}
 *     />
 * );
 */
export default function CourseDetailDialog({ course, visible, onClose, onDismiss }) {
    const theme = useTheme();
    const { t } = useTranslation();

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    const { room, url, info, title, times, type, lecturer, ...extraCourseData } = course ?? {};
    const courseDetails = [
        { ...room, key: 'room', displayName: t('timetable:detail.room'), icon: 'map-search' },
        { key: 'startTimes', data: times?.[0]?.start, displayName: t('timetable:detail.start') },
        { key: 'endTimes', data: times?.[0]?.end, displayName: t('timetable:detail.end') },
        { ...type, key: 'type', displayName: t('timetable:detail.type') },
        { ...lecturer?.[0], key: 'lecturer', displayName: t('timetable:detail.lecturer') },
        { ...url, key: 'url', displayName: t('timetable:detail.url'), icon: 'forward' },
        { ...info, key: 'info', displayName: t('timetable:detail.info') },

        // Restliche Daten werden in Format gebracht und angefügt
        ...Object.entries(extraCourseData)
            .map(
                ([courseDataKey, courseDataValue]) =>
                (
                    {
                        key: courseDataKey,
                        displayName: courseDataValue?.displayname,
                        ...courseDataValue,
                    }
                )
            )
    ]
        .filter(courseDetail => courseDetail?.data ? true : false);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>{title?.data ?? 'Keine weiteren Informationen'}</Dialog.Title>
                <Dialog.Content>
                    {
                        courseDetails
                            ? courseDetails.map(
                                courseDetail =>
                                    <CourseDetailDialogText
                                        key={courseDetail?.displayName}
                                        title={courseDetail?.displayName}
                                        content={courseDetail?.data}
                                        url={courseDetail?.url}
                                        icon={courseDetail?.icon}
                                    />
                            )
                            : <Text>
                                Keine Informationen verfügbar
                            </Text>
                    }
                </Dialog.Content>
                <Dialog.Actions>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.dismissButton}>{t('timetable:close')}</Text>
                    </TouchableOpacity>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

/**
 * Eine einzelne Information im {@link CourseDetailDialog}
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.content
 * @param {string} props.url
 * @param {string} props.icon
 */
function CourseDetailDialogText({ title, content, url, icon }) {
    const increaseFontSize = useIncreaseFontSize();

    const theme = useTheme();
    const { colors } = theme;

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    return (
        <TouchableOpacity
            style={[styles.detailContainer, styles.textDetail]}
            onPress={
                url
                    ? () => Linking.openURL(url)
                    : null
            }
            disabled={
                url
                    ? false
                    : true
            }
        >
            <Text style={[styles.detailLabel, increaseFontSize ? styles.textDetailBigFont : styles.textDetail]} >
                {title}
            </Text>
            <Text style={[styles.detailValue, increaseFontSize ? styles.textDetailBigFont : styles.textDetail]} ellipsizeMode='tail' >
                {content}
            </Text>
            {
                icon && url
                    ? <IconsOpenasist icon={icon} size={25} color={colors.icon} />
                    : null
            }
        </TouchableOpacity>
    )
}
