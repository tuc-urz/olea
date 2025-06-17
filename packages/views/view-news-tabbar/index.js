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

import React, { useMemo, useState, useEffect } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';

import { TabView, TabBar, TabBarItem } from "react-native-tab-view";
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import AppbarComponent from '@openasist/component-app-bar';
import NewsList from '@openasist/component-news-list';
import { useNewsChannels } from '@openasist/context-news';

import componentStyles from './styles';

export default function NewsTabBarView(props) {
    const theme = useTheme();
    const { colors, themeStyles } = theme;
    const { t } = useTranslation();
    const [newsChannels, refreshNewsChannels] = useNewsChannels();

    const [newsTabIndex, setNewsTabIndex] = useState(0);

    const newsTabRoutes = useMemo(
        () =>
            Array.isArray(newsChannels)
                ? newsChannels?.map(
                    newschannel =>
                    ({
                        key: newschannel.feedid,
                        title: newschannel.title,
                    })
                )
                : null,
        [newsChannels]
    );

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    );

    useEffect(
        () => {
            refreshNewsChannels();
        },
        [refreshNewsChannels]
    )

    return (
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            <AppbarComponent
                {...props}
                title={t('news:feeds')}
            />
            <View style={themeStyles.container}>
                {
                    Array.isArray(newsTabRoutes)
                        ? newsTabRoutes.length
                            ? newsTabRoutes.length === 1
                                ? <View style={styles.screenView} >
                                    <View style={styles.tabHeaderView} >
                                        <Text style={styles.tabHeaderText} >
                                            {newsTabRoutes[0].title}
                                        </Text>
                                    </View>
                                    <NewsList
                                        active={true}
                                        newsChannelId={newsTabRoutes[0].key}
                                        navigation={props.navigation}
                                    />
                                </View>
                                : <TabView
                                    style={props.style}
                                    navigationState={{
                                        routes: newsTabRoutes,
                                        index: newsTabIndex,
                                    }}
                                    renderTabBar={
                                        props => {
                                            const { key, ...restProps } = props;
                                            return (<View style={styles.tabBarContainer}>
                                                <TabBar
                                                    {...restProps}
                                                    scrollEnabled
                                                    style={themeStyles.tabs}
                                                    labelStyle={themeStyles.tab}
                                                    indicatorStyle={themeStyles.tabIndicator}
                                                    tabStyle={{ width: 'auto', paddingHorizontal: 20 }}
                                                    initialLayout={{
                                                        width: Dimensions.get('window').width,
                                                        height: Dimensions.get('window').height
                                                    }}
                                                    renderTabBarItem={({ route, navigationState, ...rest}) =>
                                                      <TabBarItem
                                                        {...rest}
                                                        key={route.key}
                                                        route={route}
                                                        navigationState={navigationState}
                                                        labelStyle={themeStyles.tab}
                                                        activeColor={themeStyles.tabs.activeColor}
                                                        inactiveColor={themeStyles.tabs.inactiveColor}
                                                        // Die einbindung von moment.js zum Anzeigen des Wochentages sollte langfristig entfernt werden.
                                                        // Funktioniert die Luxon funktionalität der Wochenanzeige nicht unter iOS datetime.toFormat('ccc')
                                                        labelText={route.title}
                                                        accessible={true}
                                                        accessibilityLabel={({ route }) => route.title}
                                                      />
                                                    }
                                                />
                                            </View>);
                                        }
                                    }
                                    renderScene={
                                        ({ route }) =>
                                            <NewsList
                                                active={route.key === newsTabRoutes[newsTabIndex].key}
                                                newsChannelId={route.key}
                                                navigation={props.navigation}
                                            />
                                    }
                                    onIndexChange={setNewsTabIndex}
                                    lazy
                                    lazyPreloadDistance={1}
                                />
                            : <View style={styles.screenView} >
                                <View style={styles.tabHeaderView} >
                                    <Text style={styles.tabHeaderText} >
                                        {t('news:noResult')}
                                    </Text>
                                </View>
                                <Text>
                                    {t('news:noResult')}
                                </Text>
                            </View>
                        : <ActivityIndicator
                            style={styles.activity}
                            size="large"
                            color={colors.primary}
                        />
                }
            </View>
        </SafeAreaView>
    );
}
