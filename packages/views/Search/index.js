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

import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux'
import { Searchbar, Text, withTheme } from 'react-native-paper';
import { TabView, TabBar } from 'react-native-tab-view';
import { withTranslation } from "react-i18next";

import NetInfo from '@react-native-community/netinfo';

import { SearchService } from "@olea-bps/core";

import componentStyles from "./styles";
import IconsOpenasist from "@olea-bps/icons-openasist";
import { AppBar as AppbarComponent } from '@olea-bps/components';
import { SearchResults as SearchResultsComponent } from '@olea-bps/components';


/**
 * Search View
 *
 * Shows a search view with taps for every category.
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */


function SearchView(props) {
    const [searchTabIndex, setSearchTabIndex] = useState(0);
    const [hasConnection, setHasConnection] = useState(true);
    const [inProgress, setInProgress] = useState(false);
    const [searchString, setSearchString] = useState(props.searchTopic ? props.searchTopic : '');

    const { theme, theme: { themeStyles, colors }, t } = props;
    const activeSearchCategories = props?.theme?.appSettings?.modules?.search?.activeCategories ?? SearchService.categories;

    const searchTabRoutes = useMemo(
        () => [
            { key: 'all', title: t('search:tabs.all') },
            ...activeSearchCategories.map(activeSearchCategory => ({
                key: activeSearchCategory,
                title: t(`search:tabs.${activeSearchCategory}`)
            }))
        ],
        [activeSearchCategories, t]
    );

    useEffect(
        () => NetInfo.addEventListener(state => setHasConnection(state.isInternetReachable && state.isConnected)),
        [NetInfo]
    );

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    )

    const _onPressButton = () => {
        if (searchString.length > 0) {
            _executeSearch();
        }
    };

    const _executeSearch = () => {
        const includedSearches = props.theme.appSettings.modules.search.activeCategories;
        const searchService = new SearchService();

        setInProgress(true);

        if (searchTabIndex > 0 && searchTabRoutes.length > 0) {
            searchService.searchByType(
                searchTabRoutes[searchTabIndex]?.key,
                searchString,
                () => {
                    setInProgress(false);
                });
        } else {
            searchService.searchAll(searchString, () => {
                setInProgress(false);
            }, includedSearches);
        }
    };

    /**
     * Render the top bar for categories
     *
     * @param props
     * @returns {*}
     * @private
     */
    const _renderTabBar = (props) => {

        return (
            <View style={styles.tabBarContainer}>
                <TabBar
                    {...props}
                    scrollEnabled
                    style={themeStyles.tabs}
                    activeColor={themeStyles.tabs.activeColor}
                    inactiveColor={themeStyles.tabs.inactiveColor}
                    labelStyle={themeStyles.tab}
                    indicatorStyle={themeStyles.tabIndicator}
                    tabStyle={{ width: 'auto', paddingHorizontal: 20 }}
                />
                <Searchbar
                    onSubmitEditing={() => _onPressButton()}
                    onIconPress={() => _onPressButton()}
                    onChangeText={setSearchString}
                    icon={(props) =>
                        <IconsOpenasist icon={"search"} size={32} color={colors.icon} />
                    }
                    style={styles.searchBar}
                    inputStyle={styles.searchBarInput}
                    value={searchString}
                    placeholder={t('search:title') + ' ...'}
                    placeholderTextColor={colors.textLighter}
                    clearAccessibilityLabel={t('accessibility:search:searchBarClearButton')}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            <AppbarComponent title={t('search:title')} {...props} />
            <TabView
                style={styles}
                navigationState={{ index: searchTabIndex, routes: searchTabRoutes }}
                renderScene={
                    ({ route, jumpTo }) =>
                        hasConnection
                          ? <View style={styles.containerInner}>
                                {
                                    inProgress
                                      ? <View style={[styles.containerInner, styles.containerLoading]}>
                                            <Text>{t('search:inProgress')}</Text>
                                            <ActivityIndicator style={styles.activity} size="large" color={props.theme.colors.loadingIndicator} />
                                        </View>
                                      : <SearchResultsComponent type={route.key} {...props} />
                                }
                            </View>
                          : <View style={[styles.containerInner, styles.containerLoading]}>
                                <IconsOpenasist icon={"search"} size={48} color={props.theme.colors.loadingIndicator} />
                                <Text style={styles.title}>{t('search:noInternetTitle')}</Text>
                                <Text style={styles.subtitle}>{t('search:noInternetSubtitle')}</Text>
                            </View>

                }
                renderTabBar={_renderTabBar}
                onIndexChange={setSearchTabIndex}
            />
        </SafeAreaView>
    );

}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.search.component,
        pluginStyles: state.pluginReducer.search.styles,
        searchTopic: state.stateReducer.searchTopic
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(SearchView)));




