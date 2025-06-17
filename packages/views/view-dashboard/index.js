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

import { useMemo, useCallback } from 'react';
import {
    Animated,
    StyleSheet,
    View,
    RefreshControl,
    SafeAreaView,
    useAnimatedValue,
} from 'react-native';

import { connect } from 'react-redux';
import { Appbar, Button, Dialog, Portal, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';

import { onUpdateRefreshing, DataService } from '@openasist/core';
import TopNewsComponent from '@openasist/component-top-news';
import QuickLinksComponent from '@openasist/component-quick-links';
import MensaSliderCompnent from '@openasist/component-mensa-slider';
import CourseInfoCompnent from '@openasist/component-course-info';
import { usePendingInfos } from '@openasist/context-info-dialog';

import componentStyles from './styles';

export const scrollRangeForAnimation = 160;

/**
 * Dashboard View
 *
 * The home screen of the app. Shows different informations like the top news, weather,
 * current mensa menus and informations of the next course (if the student has imported his timtetable)
 *
 * Parameters:
 *  - none
 *
 * Navigation-Parameters:
 *  - none
 */
function DashboardView(props) {
    const componentName = arguments.callee.name;
    const theme = useTheme();
    const { t } = useTranslation();
    const { themeStyles } = theme;
    const [pendingInfos, setInfoDisplayed, refreshInfos] = usePendingInfos();
    const pendingInfo = pendingInfos?.[0];
    const hasNextPendingInfo = (pendingInfos?.length ?? 0) > 1

    // Generate styles. Will be generated only if not present or the theme property changes.
    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    )

    const dataService = useMemo(
        () => new DataService,
        []
    );

    useFocusEffect(
        useCallback(
            () => {
                refreshInfos();
            },
            [refreshInfos]
        )
    );

    const scrollY = useAnimatedValue(0);

    const headerTranslate = scrollY.interpolate({
        inputRange: [0, scrollRangeForAnimation],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    console.debug(componentName, ':', 'pending info', ':', pendingInfo);

    return (
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            <Appbar.Header style={{ elevation: 0 }} statusBarHeight={0}>
                <Appbar.Content title={t('home:title')} titleStyle={styles.titleStyle} />
            </Appbar.Header>
            <Animated.ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                scrollEventThrottle={2}
                onScroll={
                    Animated.event(
                        [
                            {
                                nativeEvent: { contentOffset: { y: scrollY } },
                            },
                        ],
                        {
                            useNativeDriver: true,
                        },
                    )
                }
                refreshControl={
                    <RefreshControl
                        refreshing={props.refreshing}
                        onRefresh={() => {
                            props.onUpdateRefreshing(true);
                            dataService.refresh();
                        }}
                    />
                }>
                <View>
                    <TopNewsComponent    {...props} animationRange={headerTranslate} />
                    <QuickLinksComponent {...props} />
                    <MensaSliderCompnent {...props} />
                    <CourseInfoCompnent  {...props} />
                </View>
            </Animated.ScrollView>
            <Portal>
                <Dialog
                    visible={
                        pendingInfo === undefined
                            ? false
                            : true
                    }
                    dismissable={false}
                >
                    <Dialog.Title>{pendingInfo?.title ?? 'Info'}</Dialog.Title>
                    <Dialog.Content>
                        {
                            pendingInfo
                                ? <Markdown>
                                    {pendingInfo?.message}
                                </Markdown>
                                : null
                        }
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setInfoDisplayed(pendingInfo?.id)}>
                            {
                                hasNextPendingInfo
                                    ? 'Next'
                                    : 'Ok'
                            }
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </SafeAreaView>
    );
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.dashboard.component,
        pluginStyles: state.pluginReducer.dashboard.styles,
        view: state.stateReducer.view,
        feedItems: state.stateReducer.feedItems,
        feeds: state.stateReducer.feeds,
        refreshing: state.stateReducer.refreshing,
        settings: state.settingReducer
    };
};

export default connect(mapStateToProps, { onUpdateRefreshing })(DashboardView)
