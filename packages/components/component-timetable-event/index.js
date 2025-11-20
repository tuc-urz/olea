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

import { useState, useMemo } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Pressable,
    Linking,
} from 'react-native';

import { connect } from 'react-redux'
import {
    withTheme,
    Text
} from 'react-native-paper';
import { withTranslation } from 'react-i18next';

import { onUpdateRefreshing } from '@openasist/core';
import IconsOpenasist from '@openasist/icons-openasist';

import componentStyles from './styles';

function TimetableEventComponent(props) {
    const componentName = TimetableEventComponent.name;

    const {
        theme,
        t,
        settings,
        times,
        type,
        title,
        location,
        locationUrl,
        description,
        starrable,
        onSelectionChange
    } = props;

    const isBigFont = settings?.settingsAccessibility?.increaseFontSize ?? false;
    const [isSelected, setIsSelected] = useState(false);

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    )

    const handleSelectionChange = () => {
        setIsSelected(isSelected => !isSelected);

        onSelectionChange?.(!isSelected)
    };

    const accessibilityStartTime = t('accessibility:timetable:startTime') + times?.start.slice(0, 2) + ' ' + t('accessibility:pts:speechTime') + ' ' + (times?.start.slice(3, 5) !== '00' ? times?.start.slice(3, 5) : '') + ',';
    const accessibilityEndTime = t('accessibility:timetable:endTime') + times?.end.slice(0, 2) + ' ' + t('accessibility:pts:speechTime') + ' ' + (times?.end.slice(3, 5) !== '00' ? times?.end.slice(3, 5) : '') + ',';
    const courseContainerBigFont = isBigFont ? styles.courseContainerBigFont : null;
    const titleStyle = isBigFont ? styles.titleBigFont : styles.title;

    return (
        <View style={[isBigFont ? [styles.card, styles.courseCard] : styles.card, { backgroundColor: 'rgba(0, 95, 80, 0.25)', elevation: 0 }]} onPress={() => { console.log("Clicking is currently not working. Don't try it!") }}>
            {
                //times
                //    ? <View style={[isBigFont ? [styles.courseTimeContainer, styles.courseTimeContainerBigFont] : styles.courseTimeContainer, { backgroundColor: 'rgba(0, 95, 80, 0)' }]}>
                //        <Text accessibilityLabel={accessibilityStartTime} style={isBigFont ? [styles.timeText, styles.timeTextBig] : styles.timeText}>{times?.start || ''}</Text>
                //        <View style={styles.verticalSeperatorSmall} />
                //        <Text accessibilityLabel={accessibilityEndTime} style={isBigFont ? [styles.timeText, styles.timeTextBig] : styles.timeText}>{times?.end || ''}</Text>
                //    </View>
                //    : null
            }
            {
                //times ? <View style={styles.verticalSeperator} /> : null
            }
            <View style={[styles.otherCourseContainer, { backgroundColor: 'rgba(0, 95, 80, 0)' }]}>
                {
                    type || times
                        ? <Text style={styles.type}>
                            {
                                type
                                    ? <Text style={{ fontWeight: 'bold' }}>
                                        {type}
                                    </Text>
                                    : null
                            }
                            {
                                type && times
                                    ? ' | '
                                    : null
                            }
                            {
                                times
                                    ? `${times?.start} - ${times?.end} `
                                    : null
                            }
                        </Text>
                        : null
                }
                {title ? <Text style={styles.title}>{title}</Text> : null}
                {
                    description
                        ? <Text style={styles.professorText}>
                            <Text style={styles.professorName}>{description}</Text>
                        </Text>
                        : null
                }
                {
                    location
                        ? <Pressable
                            onPress={
                                locationUrl
                                    ? () => Linking.openURL(locationUrl)
                                        .catch(
                                            reason => {
                                                console.debug(componentName, ':', 'can`t open link', ':', reason);
                                                alert('Link konnte nicht geöffnet werden.');
                                            }
                                        )
                                    : null
                            }
                        >
                            <Text
                                style={[styles.location, locationUrl ? styles.locationLink : null]}
                            >
                                {location}
                            </Text>
                        </Pressable>
                        : null
                }
            </View>
            {
                starrable
                    ? <View style={styles.starPosition}>
                        <TouchableOpacity onPress={handleSelectionChange}>
                            <IconsOpenasist icon={isSelected ? 'star-selected' : 'star'} size={25} color='#005F50' />
                        </TouchableOpacity>
                    </View>
                    : null
            }
        </View>
    );
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.timetable.component,
        pluginStyles: state.pluginReducer.timetable.styles,
        settings: state.settingReducer
    };
};

export default connect(mapStateToProps, { onUpdateRefreshing })(withTranslation()(withTheme(TimetableEventComponent)))
