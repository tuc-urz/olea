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

import React from 'react';
import {
    Animated,
    StyleSheet,
    View,
    RefreshControl,
    Dimensions,
    SafeAreaView
} from 'react-native';
import {connect} from 'react-redux'
import {Appbar, Provider as PaperProvider, withTheme} from "react-native-paper";
import {withTranslation} from "react-i18next";

import merge from 'lodash/merge';

import {onUpdateRefreshing, DataService} from '@openasist/core';
import TopNewsComponent from "@openasist/component-top-news";
import QuickLinksComponent from "@openasist/component-quick-links";
import MensaSliderCompnent from "@openasist/component-mensa-slider";
import CourseInfoCompnent from "@openasist/component-course-info";

import componentStyles from "./styles"
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
class DashboardView extends React.Component {
    static navigationOptions = {
        header: null
    };

    // Styles of this component
    styles;

    dataService = null;
    _scrollView = null;


    constructor(props) {
        super(props);

        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------

        const { pluginStyles,theme } = this.props;
        this.styles = componentStyles(theme);

        if(pluginStyles) {
            this.styles = merge(this.styles, pluginStyles);
        }

        this.styles = StyleSheet.create(this.styles);

        // ------------------------------------------------------------------------

        this.dataService = new DataService();
        this.props.onUpdateRefreshing(false);

        this.state = {
            scrollY: new Animated.Value(0)
        };
    }

    /**
     * User has dragged down the view to update the informations
     *
     * @private
     */
    _onRefresh = () => {
        this.props.onUpdateRefreshing(true);
        this.dataService.refresh();
    };

    /**
     * User has scrolled down. If the header animation isn't fully finished,
     * scroll up or down (depends on how far the user has scrolled) to finish the animation.
     * This prevents that the top view looks like its stuck.
     *
     * @param event
     *
     * @private
     */
    _onScrollEndSnapToEdge = event => {
      /* TODO Disabled at the moment. On smaller devices the user isn't able to
          use the course component because of the scroll back

      const y = event.nativeEvent.contentOffset.y;
        if (0 < y && y < this._scrollRangeForAnimation / 2) {
            if (this._scrollView) {
                this._scrollView.scrollTo({y: 0});
            }
        } else if (this._scrollRangeForAnimation / 2 <= y && y < this._scrollRangeForAnimation) {
            if (this._scrollView) {
                this._scrollView.scrollTo({y: this._scrollRangeForAnimation});
            }
        }*/
    };

    render() {
        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------
        const PluginComponent = this.props.pluginComponent;
        if (PluginComponent) {
            return <PluginComponent />;
        }
        // ------------------------------------------------------------------------

        const { t } =  this.props;
        const { colors, themeStyles } = this.props.theme;

        const scrollY = Animated.add(
            this.state.scrollY,
            0,
        );
        const headerTranslate = scrollY.interpolate({
            inputRange: [0, scrollRangeForAnimation],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
          <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
            <Appbar.Header style={{elevation: 0}} statusBarHeight={0}>
                <Appbar.Content title={t('home:title')} titleStyle={this.styles.titleStyle}/>
            </Appbar.Header>
            <Animated.ScrollView
                ref={scrollView => {
                    this._scrollView = scrollView ? scrollView._component : null;
                }}
                style={this.styles.container}
                contentContainerStyle={this.styles.contentContainer}
                scrollEventThrottle={2}
                onScrollEndDrag={this._onScrollEndSnapToEdge}
                onMomentumScrollEnd={this._onScrollEndSnapToEdge}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {contentOffset: {y: this.state.scrollY}},
                        },
                    ],
                    {
                        useNativeDriver: true,
                    }
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.refreshing}
                        onRefresh={this._onRefresh}
                    />
                }>
                <View>
                    <TopNewsComponent    {...this.props}  animationRange={headerTranslate}/>
                    <QuickLinksComponent {...this.props} />
                    <MensaSliderCompnent {...this.props} />
                    <CourseInfoCompnent  {...this.props} />
                </View>
            </Animated.ScrollView>
          </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.dashboard.component,
        pluginStyles: state.pluginReducer.dashboard.styles,
        view : state.stateReducer.view,
        feedItems: state.stateReducer.feedItems,
        feeds: state.stateReducer.feeds,
        refreshing: state.stateReducer.refreshing,
        settings: state.settingReducer
    };
};

export default connect(mapStateToProps, {onUpdateRefreshing})(withTranslation()(withTheme(DashboardView)))
