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

import { useState, useEffect, useMemo } from 'react';
import {
    View,
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Text
} from 'react-native';
import {AccordionList} from "accordion-collapse-react-native";
import {TabView, TabBar} from 'react-native-tab-view';
import {connect} from 'react-redux'
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import moment from "moment";
import { CommonActions, useNavigation } from '@react-navigation/native';

import componentStyles from "./styles";
import AppbarComponent from "@olea/component-app-bar";
import IconsOpenasist from "@olea/icons-openasist";
import MensaMenu from "@olea/component-mensa-menu";
import { useCanteen, useCanteens, useFilteredMenu } from '@olea/context-canteen';

function generateDayRoutes(begin, daysToRender, language, disabledWeekdays = []) {
    const beginMoment = begin?.clone();
    disabledWeekdays = disabledWeekdays ?? [];

    return Array?.from(
        { length: daysToRender },
        (_, index) => {
            const currentDay = beginMoment?.clone()?.locale(language)?.add(index, 'days')?.startOf('day');
            const isoDayDate = currentDay?.format('YYYY-MM-DD');
            return {
                key: isoDayDate,
                date: currentDay,
            }
        }
    )?.filter(dayRoute => !disabledWeekdays?.includes(dayRoute?.date?.isoWeekday()));
};

function CanteensAccordionHeader({ canteenId, menuDate, isExpanded, styles }) {
    const { t } = useTranslation();
    const [canteen] = useCanteen(canteenId);
    const [menu, refreshMenu, mealAmount, filteredMealAmount, activeSelections] = useFilteredMenu(canteenId, menuDate);
    const { themeStyles, colors } = useTheme();

    useEffect(
        () => {
            refreshMenu();
        },
        [canteenId, menuDate]
    )

    return (
        <View style={styles.header}>
            <View style={[themeStyles.cardLeftIcon, { marginStart: 5 }]}>
                {
                    canteen?.type
                        ? <IconsOpenasist icon={((canteen.type === "cafeteria") ? "coffee" : "mensa")} size={25} color={colors.icon} />
                        : null
                }
            </View>
            <View>
                <Text style={styles.headerText}>{canteen?.title ?? `Fehler: Mensa mit ID ${canteenId} kann nicht angezeigt werden. Bitte melden!`}</Text>
                {
                    Array.isArray(activeSelections) && activeSelections.length > 0
                        ? <Text>
                            {
                                t(
                                    'canteen:amountOfFilteredMeals',
                                    { filteredMealAmount, mealAmount, filters: activeSelections.map(favoriteSelection => t(favoriteSelection.labelKey)) }
                                )
                            }
                        </Text>
                        : null
                }
            </View>
            <View style={styles.arrowIcon}>
                <IconsOpenasist icon={isExpanded ? "up" : "down"} size={20} color={colors.grayLight5} />
            </View>
        </View>
    );
}

/**
 * Akkordion, welches die Mensen einer Universität anzeigt.
 * Es werden automatisch die Mensen aus dem Mensa-Kontext geladen.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.menuDate - Datum des Essensangebotes, welches als String im ISO 8601 Format zu übergeben ist.
 * @param {string} [props.expandedCanteenId] - ID der Mensa, dessen Akkordion-Element geöffent sein soll.
 * @param {JSX.Element} [props.CanteensEmptyComponent] - JSX, welches angezeigt werden soll, wenn keine Mensen angezeigt werden können.
 * @param {(expandedCanteenId: string) => void} [props.onCanteenSelect] - Event welches ausgelöst wird, wenn der Nutzer ein Akkordion-Element öffnet oder schließt.
 * @returns {JSX.Element}
 *
 * @example
 * const [activeCanteen, setActiveCanteen] = useState(null);
 *
 * return (
 *     <CanteensAccordion
 *         menuDate={'01-12-2020'}
 *         expandedCanteenId={activeCanteen}
 *         onCanteenSelect={
 *             expandedCanteenId => setActiveCanteen(expandedCanteenId)
 *         }
 *         CanteensEmptyComponent={
 *             <Text>Keine Mensa gefunden</Text>
 *         }
 *     />
 * )
 */
function CanteensAccordion({ expandedCanteenId, menuDate, onCanteenSelect, CanteensEmptyComponent }) {

    const [canteens] = useCanteens();
    const canteensIds = useMemo(
        () => Object.keys(canteens),
        [canteens]
    )
    const theme = useTheme();

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    return (
        <AccordionList
            list={canteensIds}
            expandedKey={expandedCanteenId}
            onToggle={
                // Wenn eine Mensa-Akkordion-Element vim Nutzer angeklickt wird, soll dessen ID bzw. Key an die onCanteenSelect-Funktion gegeben werden.
                // Wird das Akkordion-Element geschlossen, wird null übergeben.
                // Somit kann eine Eltern-Komponente die Kontrolle über die geöffenten Akkordion-Elemente übernehmen (siehe expandedCanteenId).
                (key, index, isExpanded) => onCanteenSelect?.(
                    // Wenn isExpanded == false, wurde die Mensa gerade geschlossen, ansonsten wurde die Mensa vom Nutzer geöffnet.
                    isExpanded
                        // Mensa-Akkordion-Element wurde geöffnet. Es wird der Mensa-Key zurückgeben.
                        ? key
                        // Mensa-Akkordion-Element wurde geschlossen. Es wird kein Mensa-Key zurückgeben.
                        : null
                )
            }
            keyExtractor={(canteenId, index) => canteenId}
            header={
                (canteenId, index, isExpanded) =>
                    <CanteensAccordionHeader
                        canteenId={canteenId}
                        menuDate={menuDate}
                        isExpanded={isExpanded}
                        styles={styles}
                    />
            }
            body={
                canteenId =>
                    < View style={styles.content} >
                        <MensaMenu
                            canteenId={canteenId}
                            menuDate={menuDate}
                        />
                    </View >
            }
            ListEmptyComponent={CanteensEmptyComponent}
        />
    )
}

/**
 * Canteens View
 *
 * In this view the tabbar and the scenes for the different canteens for each day are rendered
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */


//TODO: 
//  - remove unused dependencies
//  - add comments
//  - recheck code
//  - rename to view-canteens?

function CanteensView(props) {

    const { settings, route, settings: { settingsGeneral: { language } } } = props;
    const { style } = props;

    const theme = useTheme();
    const { themeStyles, colors } = theme;
    const { t } = useTranslation();
    const navigation = useNavigation();

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    const disabledWeekdays = theme?.appSettings?.modules?.canteen?.disabledWeekdays ?? [];
    const weeksToRender = theme?.appSettings?.modules?.canteen?.weeksToRender ?? 1;
    const daysToRender = moment.duration(weeksToRender, 'week').asDays();
    const begin = moment().startOf('isoWeek');
    const daysTabViewRoutes = generateDayRoutes(begin, daysToRender, language, disabledWeekdays);

    // Derzeitiger Tag
    const today = moment().startOf('day');
    // Suche nach dem Index des heutigen Tages oder den Tag danach. Kann kein Index gefunden werden, wird -1 genommen.
    let initialDayTabIndex = daysTabViewRoutes.findIndex(dayTab => dayTab.date.isSameOrAfter(today));
    // Wenn kein Index gefunden werden konnte, wird der letzte Tab genommen
    // Wenn nur eine Woche gerendert wird und die Wochenendtagen ausgeschalten wird, wird kein folgetag gefunden.
    initialDayTabIndex = initialDayTabIndex === -1 ? daysTabViewRoutes.length - 1 : initialDayTabIndex;

    // Dieser State wird an alle Mensa-Akkordions in jedem Tages-Tab weitergeben, damit jedes Mensa-Akkordion die selbe Mensa öffen hat.
    // Ein null-Wert, heißt dass alle Mensa-Akkordion-Elemente geschlossen sind.
    const [activeCanteen, setActiveCanteen] = useState(null);

    const [index, setIndex] = useState(initialDayTabIndex);
    const [routes, setRoutes] = useState(daysTabViewRoutes);
    const [routeBegining, setRouteBegining] = useState(begin);

    useEffect(() => {
        const unsubscribeFocusListener = navigation.addListener('focus', () => {
            _setActiveCanteenFromRoute();
            _setTabViewIndexFromRoute();
        });

        // Cleanup function
        return () => {
            unsubscribeFocusListener();
        };
    }, [route.params?.canteenId]);

    useEffect(() => {
        const disabledWeekdays = theme?.appSettings?.modules?.canteen?.disabledWeekdays ?? [];
        const weeksToRender = theme?.appSettings?.modules?.canteen?.weeksToRender ?? 2;
        const daysToRender = moment.duration(weeksToRender, 'week').asDays();
        const begin = routeBegining ?? moment().startOf('isoWeek');

        setRoutes(generateDayRoutes(begin, daysToRender, language, disabledWeekdays));
    }, [language, theme]); // Runs when canteens, theme, language, or begin changes

    const _updateSections = (key, index, isExpanded) => {
        setActiveCanteen(isExpanded ? index : null)
    };

    /*
     When a user presses a component meal item in dashboard she is taken to the Canteen Tab View.
     To automatically expand the canteen with the pressed meal in the accordion, the canteen id is passed as a route param.
     This method is responsible for setting the component state from the route param values which in turn controls the tab view.
     (active canteen = the canteen which is expanded in accordion)
     */
    const _setActiveCanteenFromRoute = () => {
        const canteenId = route?.params?.canteenId;
        if (canteenId) {
            setActiveCanteen(canteenId);

            /*
            After setting the active canteen state, the passedCanteenId needs to get set as undefined.
            so the lastly collapsed canteen will stay collapsed after navigating through the main tab navigation
            and not the canteen with the lastly passed id
            */
            navigation.dispatch(CommonActions.setParams({ canteenId: undefined }));
        }
    };

    const _setTabViewIndexFromRoute = () => {
        const menuDate = route.params?.menuDate;

        if (!menuDate) return;

        const menuDateIndex = routes.findIndex(route => route.date.format('YYYY-MM-DD') === menuDate);
        setIndex(menuDateIndex);
        navigation.dispatch(CommonActions.setParams({menuDate: undefined}));
    };

    const _renderTabBar = props => {
        return (
            <TabBar
                {...props}
                scrollEnabled
                style={themeStyles.tabs}
                labelStyle={themeStyles.tab}
                indicatorStyle={themeStyles.tabIndicator}
                tabStyle={{ width: 'auto', paddingHorizontal: 20 }}
                getLabelText={({ route, focus }) => `${route.date.format('dd')}, ${route.date.format('DD.MM.')}`}
                getAccessibilityLabel={({ route }) => route.date.format('dddd L')}
            />
        );
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            <AppbarComponent
                title={t('canteen:title')} {...props}
            />
            <View style={themeStyles.container}>
                <TabView
                    style={style}
                    navigationState={{
                        index,
                        routes,

                        // aktive Canteene wird mit übergeben, damit alle Tabs die selbe Mensa öffnen.
                        activeCanteen,
                    }}
                    renderTabBar={_renderTabBar}
                    onIndexChange={setIndex}
                    renderScene={
                        ({ route }) => {

                            const menuDate = route?.key;

                            return (
                                <CanteensAccordion
                                    menuDate={menuDate}
                                    expandedCanteenId={activeCanteen}
                                    onCanteenSelect={
                                        // Wenn dieses Akkordion eine Mensa öffnet oder schließt, wird der activeCanteen statte mit der ID der Mensa aktualisiert.
                                        // Falls der Nutzer die Mensa schließt und damit keine Mensa im Akkordion öffen ist, wird null in den State geschrieben.
                                        expandedCanteenId => setActiveCanteen(expandedCanteenId)
                                    }
                                    CanteensEmptyComponent={
                                        <View>
                                            <Text>{t('canteen:notAvailable')}</Text>
                                            <ActivityIndicator style={styles.activity} size="large" color={colors.primary} />
                                        </View>
                                    }
                                />
                            )
                        }
                    }
                    lazy
                    lazyPreloadDistance={2}
                    renderLazyPlaceholder={(route) =>
                        <View style={styles.centerContainer}>
                            <ActivityIndicator
                                style={styles.activity}
                                size={'large'}
                                color={theme.colors.loadingIndicator}
                            />
                        </View>
                    }
                />
            </View>

        </SafeAreaView>
    );
};

const mapStateToProps = state => {
    return {
        settings: state.settingReducer
    };
};

export default connect(mapStateToProps)(CanteensView)
