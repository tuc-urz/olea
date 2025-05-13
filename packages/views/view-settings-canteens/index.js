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

import React, { useState, useMemo } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";

import { connect } from "react-redux";
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { onSettingCanteenMerge, store } from "@olea/core";
import AppbarComponent from "@olea/component-app-bar";
import SettingsDialogSelect from '@olea/component-settings-dialog-select';
import SettingsDialogRadio from '@olea/component-settings-dialog-radio';
import { useCanteens, useFavoriteCanteens, usePriceGroupCode } from "@olea/context-canteen";
import SettingSection from '@olea/component-setting-section';

import componentStyles from "./styles";

/**
 * Renders the Canteens Settings view.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.settings - The settings object.
 * @returns {JSX.Element} The rendered component.
 */
function CanteensSettingsView(props) {
    // Get theme from theme context
    const theme = useTheme();
    // Get translation function from translation hook
    const { t } = useTranslation();
    // Get canteens from canteen context
    const [canteens] = useCanteens();

    // Extract required datas using destructuring
    const { settings } = props;
    const { colors, appSettings: { mealSelections, groupsOfPersons, mealTypes }, themeStyles } = theme;

    // Get canteen settings from settings property or use default
    const settingsCanteens = settings?.settingsCanteens;
    const favoriteSelection = Array.isArray(settingsCanteens?.favoriteSelection)
        ? settingsCanteens.favoriteSelection
        : [];
    const [favoriteCanteens, setFavoriteCanteens] = useFavoriteCanteens();

    // Eingestellter Mensapreis aus dem Mensa-Kontext holen
    const [favoritePrice, setFavoritePrice] = usePriceGroupCode();

    const activeMealTypes = Array.isArray(settingsCanteens?.favoriteMealTypes) && settingsCanteens?.favoriteMealTypes?.length
        ? settingsCanteens.favoriteMealTypes
        // If no meal type is active, all meal types are active
        // By getting the code auf all avaiables meal types
        : mealTypes?.map?.(mealType => mealType.code) ?? [];

    // State variables for showing/hiding dialogs
    const [showPriceDialog, setShowPriceDialog] = useState(false);
    const [showSelectionsDialog, setShowSelectionsDialog] = useState(false);
    const [showCanteensDialog, setShowCanteensDialog] = useState(false);
    const [showMealTypesDialog, setShowMealTypesDialog] = useState(false);

    // Create styles object using useMemo to prevent unnecessary re-renders
    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    // JSX structure and Rendering for the component
    return (
        // SafeAreaView is used to render content within the safe area boundaries of a device.
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            {/* AppbarComponent is a custom component for the app's header bar. */}
            <AppbarComponent {...props} t={t} title={t("settings:canteens.title")} />

            {/* This View contains the main content of the screen. */}
            <View accessible={false} style={themeStyles.container}>
                {/* List.Section groups related content. */}
                <SettingSection
                    title={t("settings:canteens.priceSelection")}
                    description={
                        favoritePrice
                            ? t(
                                groupsOfPersons
                                    .find(personGroup => personGroup.code === favoritePrice)
                                    .labelKey
                            )
                            : groupsOfPersons
                                .map(personGroup => personGroup.labelKey)
                                .map(t)
                                .join(', ')
                    }
                    onPress={() => setShowPriceDialog(true)}
                />
                <SettingsDialogRadio
                    title={t('settings:canteens.priceSelection')}
                    visible={showPriceDialog}
                    selectedOption={favoritePrice}
                    options={
                        groupsOfPersons
                            .map(
                                personGroup =>
                                ({
                                    key: personGroup.code,
                                    label: t(personGroup.labelKey),
                                })
                            )
                    }
                    onDismiss={() => { setShowPriceDialog(false) }}
                    onOk={() => { setShowPriceDialog(false) }}
                    onChange={setFavoritePrice}
                />

                {/* Conditional rendering based on whether mealSelections is an array. */}
                {
                    Array.isArray(mealSelections)
                        ? <>
                            <SettingSection
                                title={t("settings:canteens.preferredSelections")}
                                description={
                                    mealSelections
                                        .filter(selection => favoriteSelection.includes(selection.code))
                                        .map(selection => selection.labelKey)
                                        .map(selectionLabelKey => t(selectionLabelKey))
                                        .join(", ")
                                }
                                onPress={() => setShowSelectionsDialog(true)}
                            />
                            <SettingsDialogSelect
                                title={t("settings:canteens.preferredSelections")}
                                selectedOptions={favoriteSelection}
                                visible={showSelectionsDialog}
                                options={
                                    mealSelections.map(
                                        selection =>
                                        ({
                                            key: selection.code,
                                            label: t(selection.labelKey),
                                        })
                                    )
                                }
                                onDismiss={() => { setShowSelectionsDialog(false) }}
                                onOk={() => { setShowSelectionsDialog(false) }}
                                onChange={
                                    selectedOptions =>
                                        store.dispatch(
                                            onSettingCanteenMerge(
                                                "canteenSettings",
                                                { favoriteSelection: selectedOptions }
                                            )
                                        )
                                }
                            />
                        </>
                        : null
                }

                <SettingSection
                    title={t("canteen:favoriteCanteen:title")}
                    description={
                        Object.entries(canteens)
                            .filter(([canteenId, canteenDatas]) => favoriteCanteens.includes(canteenId))
                            .map(([canteenId, canteenDatas]) => canteenDatas.title)
                            .join(", ")
                    }
                    onPress={() => setShowCanteensDialog(true)}
                />
                <SettingsDialogSelect
                    title={t('canteen:favoriteCanteen:select')}
                    selectedOptions={favoriteCanteens}
                    visible={showCanteensDialog}
                    options={
                        Object.entries(canteens).map(
                            ([canteenId, canteenDatas]) => ({
                                key: canteenId,
                                label: canteenDatas.title
                            })
                        )
                    }
                    onDismiss={() => setShowCanteensDialog(false)}
                    onOk={() => setShowCanteensDialog(false)}
                    onChange={setFavoriteCanteens}
                />

                {
                    Array.isArray(mealTypes)
                        ? <>
                            <SettingSection
                                title={t('settings:canteens:activeMealtypes:title')}
                                description={
                                    mealTypes
                                        .filter(mealType => activeMealTypes.includes(mealType.code))
                                        .map(mealType => mealType.labelKey)
                                        .map(mealTypeLabelKey => t(mealTypeLabelKey))
                                        .join(", ")
                                }
                                onPress={() => setShowMealTypesDialog(true)}
                            />
                            <SettingsDialogSelect
                                title={t('settings:canteens:activeMealtypes:dialogTitle')}
                                selectedOptions={activeMealTypes}
                                visible={showMealTypesDialog}
                                options={
                                    mealTypes.map(
                                        mealType =>
                                        ({
                                            key: mealType.code,
                                            label: t(mealType.labelKey),
                                        })
                                    )
                                }
                                onDismiss={() => setShowMealTypesDialog(false)}
                                onOk={() => setShowMealTypesDialog(false)}
                                onChange={
                                    selectedOptions =>
                                        store.dispatch(
                                            onSettingCanteenMerge(
                                                "canteenSettings",
                                                { favoriteMealTypes: selectedOptions }
                                            )
                                        )
                                }
                            />
                        </>
                        : null
                }
            </View>
        </SafeAreaView>
    );
};

// Map the Redux state to component props
const mapStateToProps = (state) => {
    return {
        settings: state.settingReducer,
    };
};

// Connect the component to Redux store and apply translation and theme
export default connect(mapStateToProps)(CanteensSettingsView);
