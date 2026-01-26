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
    Text,
    StyleSheet,
    View,
    Image
} from 'react-native';
import { connect } from 'react-redux'
import { Button, Dialog, Portal, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { useFilteredMenu } from '@olea-bps/context-canteen';

import { onUpdateRefreshing } from "@olea-bps/core";
import IconsOpenasist from "@olea-bps/icons-openasist";

import componentStyles from './styles';

/**
 * Mensa Menu Component
 *
 * Shows a list of all menu items of selected canteen
 * The class component uses hooks in order to render each meal component and each dialog as its own component
 * instead of the whole menu
 *
 * In this component two hooks are used:
 *  - Meal that renders each meal
 *  - AdditionalDialog that renders the dialog containing all additives and allergens if there are any
 *
 * Parameters:
 *  - none
 *
 */


function SelectionIcons({ selections, iconSize }) {
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    );

    return (
        <View style={styles.mealItemTitleIcons}>
            {
                selections.map(
                    selection =>
                        <View key={selection} style={{ marginLeft: 2, lineHeight: 20 }}>
                            <IconsOpenasist icon={"mensa-" + selection} color={colors.secondaryText} size={iconSize} />
                        </View>
                )
            }
        </View>
    );
}

function AdditionalDialog({ allergens, additives, visible, onDismiss }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { colors } = theme;
    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    );

    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={onDismiss}>
                <Dialog.Title style={styles.dialogTitle}>{t('canteen:allergeneTitle')}</Dialog.Title>
                <Dialog.Content>
                    {
                        Array.isArray(allergens)
                            ? <View style={styles.addionals}>
                                <Text style={styles.dialogContent}>{t('canteen:allergens:title')}</Text>
                                {
                                    allergens.map(
                                        allergen =>
                                            <Text key={allergen} style={styles.dialogContent}>{t('canteen:allergens:' + allergen)}</Text>
                                    )
                                }
                            </View>
                            : null
                    }
                    {
                        Array.isArray(additives)
                            ? <View style={styles.addionals}>
                                <Text style={styles.dialogContent}>{t('canteen:additives:title')}</Text>
                                {
                                    additives.map(
                                        additive =>
                                            <Text key={additive} style={styles.dialogContent}>{t('canteen:additives:' + additive)}</Text>
                                    )
                                }
                            </View>
                            : null
                    }
                </Dialog.Content>
                <Dialog.Actions>
                    <Button labelStyle={styles.dialogContent} onPress={onDismiss} color={colors.buttonText}>
                        {t('common:okLabel')}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}


function Meal({ settings, meal, priceGroupCode, priceGroupName }) {
    /**
     * @param props contains the current meal, styles, themestyles and local styles
     * @returns {*} a component for each meal(including dialog) with its own state
     *
     * The main-motivation for using hooks is that the state can be set for each meal instead of setting it for every menu.
     * Otherwise the dialog rendered by the AdditionalDialog-function would be set to visible for very meal in the menu at once
     * resulting in the background becoming completely dark when the dialog is opened and other style-related issues
     * By using hooks, the visibility can be set for each individual meal.
     * The function is called in the render function of the class-component inside the flatlist-component for every single meal
     * AdditionalDialog is also another hook on its own and is defined above this function
    */

    const { t } = useTranslation();
    const theme = useTheme();
    const { themeStyles, colors } = theme;
    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    );
    const language = settings.settingsGeneral.language;

    const mealPrice = useMemo(
        () => {
            const mealPrice = meal?.prices?.[priceGroupCode];

            return typeof mealPrice === 'number'
                ? `${mealPrice.toFixed(2).toLocaleString(language ?? 'de')} €`
                : mealPrice;

        },
        [meal, meal?.prices, priceGroupCode, language]
    );

    /*
    The const visible is a state defined for each single Meal-Component and can be set by teh setVisible-Fucntion
    item contains all information for the current meal. It is still unfortunate that the filtering Process is done while rendering
    and not before
    */
    const [additionalDialogVisible, setAdditionalDialogVisible] = useState(false);

    return (
        <View style={themeStyles.flexRow}>
            <View style={[themeStyles.cardContent, styles.mealContent]}>
                {
                    meal?.imageUrl
                        ? <Image
                            style={styles.mealImage}
                            source={{ uri: meal.imageUrl }}
                            resizeMode="contain"
                        />
                        : null
                }
                <View style={styles.mealItemTitle}>
                    <Text style={styles.mealItemTitleText}>
                        {meal.category}
                    </Text>
                    <SelectionIcons
                        selections={meal?.selections ?? []}
                        iconSize={styles.mealItemTitleText.lineHeight}
                    />
                </View>
                <Text style={styles.mealItemText}>
                    {meal.title}
                </Text>
                <View style={styles.addionalInformation}>
                    <Text style={styles.mealItemPrice}>
                        {
                            priceGroupName && mealPrice
                                ? `${priceGroupName}: ${mealPrice}`
                                : null
                        }
                    </Text>
                    {
                        meal?.additives || meal?.allergens
                            ? <>
                                <Button
                                    style={styles.btnAddionals}
                                    color={colors.buttonText}
                                    labelStyle={styles.buttonLabel}
                                    accessibilityLabel={t('canteen:allergeneTitle')}
                                    onPress={() => setAdditionalDialogVisible(true)}
                                >
                                    <IconsOpenasist
                                        icon={"info"}
                                        color={colors.secondaryText}
                                        size={15}
                                    />
                                </Button>
                                <AdditionalDialog
                                    allergens={meal?.allergens}
                                    additives={meal?.additives}
                                    visible={additionalDialogVisible}
                                    onDismiss={() => setAdditionalDialogVisible(false)}
                                />
                            </>
                            : null
                    }
                </View>
            </View>
        </View>
    );
}

function MensaMenu(props) {
    const componentName = MensaMenu.name;

    const { t } = useTranslation();
    const { canteenId, menuDate, settings } = props;
    const [menu, refreshMenu] = useFilteredMenu(canteenId, menuDate);
    const theme = useTheme();
    const { themeStyles, appSettings } = theme;
    const availablePriceGroups = appSettings.groupsOfPersons;
    const favoritePriceGroupCode = settings.settingsCanteens.favoritePrice;
    const favoritePriceGroup = favoritePriceGroupCode
        ? availablePriceGroups.find(priceGroup => priceGroup.code === favoritePriceGroupCode)
        : availablePriceGroups.find(priceGroup => priceGroup.default);
    const favoritePriceGroupName = t(favoritePriceGroup.labelKey);

    console.log(componentName, ':', 'favoritePriceGroupCode', ':', favoritePriceGroupCode);
    console.log(componentName, ':', 'favoritePriceGroup', ':', favoritePriceGroup)
    console.log(componentName, ':', 'favoritePriceGroupName', ':', favoritePriceGroupName)


    useEffect(
        () => {
            refreshMenu();
        },
        []
    )

    // Generieren der styles. Wird nur genieret wenn nicht vorhanden oder die Property theme sich ändert.
    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    )

    /*
    Every single menu-Component is rendered by the Meal-function above with props(themeStyles, settings, etc.), the current item and the local defined styles
    as attributes
    */

    return (
        <View style={themeStyles.container}>
            {
                Array.isArray(menu) && menu.length > 0
                    ? menu.flatMap(
                        (meal) => [
                            <Meal
                                key={meal.title}
                                meal={meal}
                                priceGroupCode={favoritePriceGroup.code}
                                priceGroupName={favoritePriceGroupName}
                                settings={settings}
                            />,
                            <View
                                key={`seperator-${meal.title}`}
                                style={styles.listSeperator}
                            />
                        ]
                    )
                    : <View style={themeStyles.noticeTextContainer}>
                        <Text style={themeStyles.noticeText}>
                            {t('canteen:noMealAvailable')}
                        </Text>
                    </View>
            }
        </View>
    );
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.mealItem.component,
        pluginStyles: state.pluginReducer.mealItem.styles,
        settings: state.settingReducer
    };
};

export default connect(mapStateToProps, { onUpdateRefreshing })(MensaMenu)
