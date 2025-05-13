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
import PropTypes from 'prop-types';

import {
    ScrollView, StyleSheet, Text,
    View, SafeAreaView, TouchableOpacity
} from 'react-native';
import {Appbar, withTheme} from "react-native-paper";

import { connect } from 'react-redux'
import merge from 'lodash/merge';
import {DataService, store} from "@olea/core";

import componentStyles from "./styles"
import AppbarComponent from "@olea/component-app-bar";
import IconsOLEA from "@olea/icons-olea";
import TimetableListComponent from "@olea/component-timetable-list";
import {withTranslation} from "react-i18next";


/**
 * Course Detail Component
 *
 * Shows the detailed information of a course with room, time, lecturer and so on.
 * Provides a share functionality.
 *
 * Parameters:
 *  - course: Course object with all information about the course
 *
 * Navigation-Parameters:
 *  - none
 */
class OtherCoursesComponent extends React.Component {
    static propTypes = {
        course: PropTypes.array
    };

    // Styles of this component
    styles;

    course = null;

    constructor(props) {
        super(props);

        // ------------------------------------------------------------------------
        // PLUGIN FUNCTIONALITY
        // ------------------------------------------------------------------------

        const { pluginStyles,theme } = this.props;
        this.styles = componentStyles(theme);

        if(pluginStyles) {
            this.styles = merge(componentStyles, pluginStyles);
        }

        this.styles = StyleSheet.create(this.styles);

        // ------------------------------------------------------------------------
    };

    _renderList = () => {
      var renderList = this.course?.map((course, courseIndex) =>
          <TimetableListComponent
              {...this.props}
              key={'course_' + courseIndex}
              course={course}
              times={null}/>
        ) ?? [];

      return (
      <View style={this.styles.renderList}>
        {renderList}
      </View>
      );
    };

    _renderContent = () => {
      const {themeStyles} = this.props.theme;
        return (
            <View style={themeStyles.container}>
              <ScrollView>
                  {this._renderList()}
              </ScrollView>
            </View>
        );
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

        const {themeStyles} = this.props.theme;
        const { course, t } = this.props;
        const {colors} = this.props.theme;

        if(!course){
            return (
                <SafeAreaView style={[this.styles.container, themeStyles.safeAreaContainer]}>
                    <AppbarComponent {...this.props}
                                     title={t('timetable:moreEvents')}
                                     leftAction={<Appbar.Action
                                         icon={props => <IconsOLEA {...props} icon={'down'} color={colors.primaryText} />}
                                         onPress={() => {
                                             this.props.navigation.goBack(null);
                                         }}/>}/>
                    <Text>{t('course:couldNotLoad')}</Text>
                </SafeAreaView>
            );
        } else if(!this.course) {
            this.course = course;
        }

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.safeAreaContainer]}>
                <AppbarComponent {...this.props}
                title={t('timetable:moreEvents')}
                leftAction={<Appbar.Action
                    icon={props => <IconsOLEA {...props} icon={'down'} color={colors.primaryText} />}
                    onPress={() => {
                        this.props.navigation.goBack(null);
                    }} />}/>
                {this._renderContent()}
            </SafeAreaView>
        );
    }
}


const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(OtherCoursesComponent)))
