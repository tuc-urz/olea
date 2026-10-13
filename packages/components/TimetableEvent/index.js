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
    Alert,
} from 'react-native';

import { connect } from 'react-redux';
import { withTheme, Text } from 'react-native-paper';
import { withTranslation } from 'react-i18next';

import { onUpdateRefreshing } from '../../libraries/core';
import IconsOpenasist from '../../libraries/icons-openasist';

import componentStyles from './styles';

function TimetableEventComponent(props) {
    const componentName = TimetableEventComponent.name;

    const {
        theme,
        settings,
        times,
        type,
        title,
        location,
        locationUrl,
        description,
        starrable,
        onSelectionChange,
    } = props;

    const isBigFont =
        settings?.settingsAccessibility?.increaseFontSize ?? false;

    const [isSelected, setIsSelected] = useState(false);

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    const handleSelectionChange = () => {
        const nextIsSelected = !isSelected;
        setIsSelected(nextIsSelected);
        onSelectionChange?.(nextIsSelected);
    };

    const titleStyle = isBigFont
        ? styles.titleBigFont
        : styles.title;

    return (
        <View
            style={[
                styles.card,
                isBigFont ? styles.courseCard : null,
                { elevation: 0 },
            ]}
        >
            <View style={styles.otherCourseContainer}>
                {type || times ? (
                    <Text style={styles.type}>
                        {type ? (
                            <Text style={{ fontWeight: 'bold' }}>{type}</Text>
                        ) : null}

                        {type && times ? ' | ' : null}

                        {times
                            ? `${times?.start} - ${times?.end} `
                            : null}
                    </Text>
                ) : null}

                {title ? (
                    <Text style={titleStyle}>
                        {title}
                    </Text>
                ) : null}

                {description ? (
                    <Text style={styles.professorText}>
                        <Text style={styles.professorName}>
                            {description}
                        </Text>
                    </Text>
                ) : null}

                {location ? (
                    <Pressable
                        onPress={
                            locationUrl
                                ? () =>
                                    Linking.openURL(locationUrl).catch(
                                        reason => {
                                            console.debug(
                                                componentName,
                                                ':',
                                                'can`t open link',
                                                ':',
                                                reason
                                            );
                                            Alert.alert(
                                                '',
                                                'Link konnte nicht geöffnet werden.'
                                            );
                                        }
                                    )
                                : null
                        }
                    >
                        <Text
                            style={[
                                styles.location,
                                locationUrl
                                    ? styles.locationLink
                                    : null,
                            ]}
                        >
                            {location}
                        </Text>
                    </Pressable>
                ) : null}
            </View>

            {starrable ? (
                <View style={styles.starPosition}>
                    <TouchableOpacity onPress={handleSelectionChange}>
                        <IconsOpenasist
                            icon={
                                isSelected
                                    ? 'star-selected'
                                    : 'star'
                            }
                            size={25}
                            color={theme.colors.eventContainerSidebar}
                        />
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    );
}

const mapStateToProps = state => ({
    pluginComponent: state.pluginReducer.timetable.component,
    pluginStyles: state.pluginReducer.timetable.styles,
    settings: state.settingReducer,
});

export default connect(
    mapStateToProps,
    { onUpdateRefreshing }
)(withTranslation()(withTheme(TimetableEventComponent)));