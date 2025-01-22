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
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';

import { TabView, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper';
import { withTranslation } from 'react-i18next';

import { onUpdateRefreshing } from '@openasist/core';
import AppbarComponent from '@openasist/component-app-bar';
import NewsList from '@openasist/component-news-list';

import componentStyles from './styles';

function NewsTabBarView(props) {
    const { feeds, theme, theme: { colors, themeStyles }, t, navigation } = props;

    const [newsTabIndex, setNewsTabIndex] = useState(0);

    const newsTabRoutes = useMemo(
        () =>
            (feeds?.length ?? 0) > 0
                ? feeds?.map(newschannel => ({
                    key: newschannel.feedid,
                    title: newschannel.title,
                }))
                : [{ key: 0, title: 'No feeds' }],
        [feeds]
    );

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    );
    return (
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            <AppbarComponent
                {...props}
                title={t('news:feeds')}
            />
            <View style={themeStyles.container}>
                {
                    (newsTabRoutes?.length ?? 0) === 0
                      ? <ActivityIndicator
                            style={styles.activity}
                            size="large"
                            color={colors.primary}
                        />
                      : (newsTabRoutes?.length ?? 0) === 1
                          ? <View style={styles.screenView} >
                                <View style={styles.tabHeaderView} >
                                    <Text style={styles.tabHeaderText} >
                                        {newsTabRoutes[0].title}
                                    </Text>
                                </View>
                                <NewsList
                                    feedId={newsTabRoutes[0].key}
                                    feedTitle={newsTabRoutes[0].title}
                                    navigation={navigation}
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
                                                tabStyle={{width: 'auto', paddingHorizontal: 20}}
                                                initialLayout={{
                                                    width: Dimensions.get('window').width,
                                                    height: Dimensions.get('window').height
                                                }}
                                                getAccessible={() => true}
                                                getAccessibilityLabel={({route}) => route.title}
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
                }
            </View>
        </SafeAreaView>
    );
}

const mapStateToProps = state => {
    return {
        feeds: state.apiReducer.feeds
    };
};

export default connect(mapStateToProps, { onUpdateRefreshing })(withTranslation()(withTheme(NewsTabBarView)))
