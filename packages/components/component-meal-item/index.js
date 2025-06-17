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
import {PixelRatio, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux'
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import componentStyles from "./styles"


/**
 * Meal Item Component
 *
 * Shows a single meal of a mensa. Used for the mensa slider component.
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */

export function MealItemComponent({ meal, canteenId, menuDate, settings }) {
    const theme = useTheme();
    const navigation = useNavigation();

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    const isBigFont = settings?.settingsAccessibility?.increaseFontSize ?? PixelRatio.getFontScale() > 2.8;

    // Remove all additional inforamtions like ingredients from title
    const regex = /(\(\d((\W)?(\d)?)+\))/gm;

    let title = meal.title.replace(regex, '');
    let isShorted = false;
    if(title.length > 63 && !this.isBigFont) {
        isShorted = true;
        title = title.slice(0, 60);
    } else if (title.length > 38 && this.isBigFont) {
        isShorted = true;
        title = title.slice(0, 35);
    }

    return (
        <TouchableOpacity
            style={[styles.mensaItem, isBigFont ? {width: 250} : '']}
            onPress={
                () => navigation.navigate(
                    'canteensTab',
                    {
                        screen: 'Canteens',
                        params: {
                            'canteenId': canteenId,
                            'menuDate': menuDate,
                        }
                    }
                )
            }
        >
            <Text style={styles.mensaItemText}>{title} {isShorted ? '...' : ''}</Text>
        </TouchableOpacity>
    );
}

const mapStateToProps = state => {
    return {
        settings: state.settingReducer,
    };
};

export default connect(mapStateToProps)(MealItemComponent)
