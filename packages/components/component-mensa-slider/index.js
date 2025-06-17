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

import React, { useMemo, useEffect } from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux'
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient'

import { DateTime } from 'luxon';

import MealItemComponent from '@openasist/component-meal-item';
import { toIsoDateString } from '@openasist/core/helper/date';

import { useCanteen, useFilteredMenu, useFavoriteCanteens } from '@openasist/context-canteen';

import componentStyles from './styles'

function HorizontalMenu({ canteenId, menuDate }) {
    const theme = useTheme();
    const { t } = useTranslation();

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    const [canteen] = useCanteen(canteenId, menuDate);
    const [menu, refreshMenu, mealAmount, filteredMealAmount] = useFilteredMenu(canteenId, menuDate);

    useEffect(
        () => {
            refreshMenu();
        },
        [canteenId, menuDate]
    )

    if (Array.isArray(menu) && menu.length > 0) {
        return menu.map(
            (meal, index) => {
                return (
                    <View
                        key={`${canteenId}-${menuDate}-${meal.title}`}
                    >
                        <Text
                            style={styles.mensaNameText}
                        >
                            {
                                index === 0
                                    ? `${canteen.title} ${filteredMealAmount !== mealAmount ? `(${filteredMealAmount}/${mealAmount})` : ''}`
                                    : null
                            }
                        </Text>
                        <MealItemComponent
                            meal={meal}
                            canteenId={canteenId}
                            menuDate={menuDate}
                        />
                    </View>
                );
            }
        );
    } else {
        return (
            <View
                key={canteenId}
            >
                <Text
                    style={styles.mensaNameText}
                >
                    {canteen.title}
                </Text>
                <Text
                    style={styles.mensaNameText}
                >
                    {t(mealAmount ? 'canteen:noMeals' : 'canteen:closed')}
                </Text>
            </View>
        );
    }
}

// Renders a list of meals for a specific canteen in a horizontal slider
function HorizontalCanteens({ menusDate, settings }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    // Favorisierte Mensen aus dem Mensa-Kontext holen
    const [favoriteCanteens] = useFavoriteCanteens();

    if (Array.isArray(favoriteCanteens) && favoriteCanteens.length > 0) {
        return favoriteCanteens.map(
            canteenId => <HorizontalMenu
                key={`${canteenId}-${menusDate}`}
                canteenId={canteenId}
                menuDate={menusDate}
            />
        )
    } else {
        return null;
    }
}

function MensaSliderComponent(props) {
    const { settings } = props;

    const theme = useTheme();
    const colors = theme?.colors;
    const { t } = useTranslation();

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    const mensaShadow = colors.mensaShadow.filter((element, pos) => {
        return colors.mensaShadow.indexOf(element) === pos;
    });

    const todayDateTime = new Date();
    const todayDateString = toIsoDateString(todayDateTime);
    
    const formattedDate = DateTime
        .fromJSDate(todayDateTime)
        .setLocale(settings.settingsGeneral.language)
        .toLocaleString(DateTime.DATE_SHORT);

    return (
        <View style={styles.container}>
            <Text style={styles.headline}>
                {t('canteen:news')} - {formattedDate}
            </Text>
            <View style={styles.innerContainer}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={mensaShadow}
                    style={styles.shadowLeft}
                />
                <ScrollView
                    horizontal={true}
                    contentContainerStyle={styles.slider}
                >
                    <HorizontalCanteens
                        {...props}
                        menusDate={todayDateString}
                    />
                </ScrollView>
                <LinearGradient
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    colors={mensaShadow}
                    style={styles.shadowRight}
                />
            </View>
        </View>
    );
}

const mapStateToProps = state => {
    return {
        canteens: state.apiReducer.canteens,
        settings: state.settingReducer
    };
};

export default connect(mapStateToProps, null)(MensaSliderComponent);
