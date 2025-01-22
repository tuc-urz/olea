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

import { onUpdateRefreshing } from "@openasist/core";

import IconsOpenasist from "@openasist/icons-openasist";

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



function CourseDetailDialog(props) {
    const { visible, hideDialog, course, theme: {colors}} = props;
    const { title, room, type, professor, url, start, end, info } = course;
    const { t } = useTranslation();
    return (
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>{title}</Dialog.Title>
                    <Dialog.Content>
                        <Text>{room}</Text>
                        <Text>{type}</Text>
                        <Text>{professor}</Text>
                        <Text>{`${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
                        <Text>{info}</Text>
                        {/* TODO: info noch zur json hinzufügen und andere Sachen*/}
                        {/* <CourseDetailDialogText {...props } detail={type}/>
                        <CourseDetailDialogText {...props } detail={url} icon={"forward"}/>
                        <CourseDetailDialogText {...props } detail={professor}/>
                        <CourseDetailDialogText {...props } detail={start}/>
                        <CourseDetailDialogText {...props } detail={end}/>
                        <CourseDetailDialogText {...props } detail={info}/> */}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog} color={colors.icon}>{t('timetable:close')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
    );

}

function CourseDetailDialogText(props) {
    const { styles, settings, icon, detail, theme: {colors} } = props;
    const isBigFont = settings.settingsAccessibility.increaseFontSize;

    const commonJSX =
        (
            <>
                <Text style={[styles.detailLabel, isBigFont ? styles.textDetailBigFont : styles.textDetail]}>{detail?.displayname}</Text>
                <Text style={[styles.detailValue, isBigFont ? styles.textDetailBigFont : styles.textDetail]} numberOfLines={1} ellipsizeMode='tail'>{detail?.data}</Text>
                {icon ? <IconsOpenasist icon={icon} size={25} color={colors.icon}/> : null}
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

export default connect(mapStateTo, { onUpdateRefreshing })(CourseDetailDialog);
