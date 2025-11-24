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
    View, SafeAreaView, Share, Linking
} from 'react-native';
import {Appbar, Headline, List, withTheme} from "react-native-paper";

import { connect } from 'react-redux'
import merge from 'lodash/merge';

import componentStyles from "./styles"
import { AppBar as AppbarComponent } from '@olea-bps/components';
import IconsOpenasist from "@olea-bps/icons-openasist";
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
class CourseDetailComponent extends React.Component {


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
        this.course = this.props.route.params.course;
    };

    /**
     * Share function for book
     *
     * @returns {Promise<void>}
     * @private
     */
    async _onShare() {
        try {
            const { t } = this.props;
            let keys = this._getSortedKeys();
            let message = '';

            keys.forEach(key => {
                let item = this.course[key];

                switch(key) {
                    case 'title':
                        message += item.data + '\n\n';
                    case 'lecturer':
                        if(item && item.length > 0) {
                            let title = '';
                            let content = '';
                            item.forEach(lecturerItem => {
                                title = lecturerItem.displayname;
                                content += lecturerItem.data + '\n';
                            });
                            message += title + ': \n' + content + '\n';
                        }
                        break;
                    case 'times':
                        if(item && item.length > 0) {
                            let title = '';
                            let times = '';
                            item.forEach(timeItem => {
                                title = timeItem.displayname;
                                times += timeItem.start + ' - ' + timeItem.end + ' ' + t('common:time') +'\n';
                            });
                            message += title + ': \n' + times + '\n';
                        }
                        break;
                    case 'room':
                        if(item && item.length > 0) {
                            const showRoomNumbers = item.length > 1;
                            let rooms = '';
                            item.forEach((roomItem, i) => {
                                let roomNumber = (showRoomNumbers) ? (i+1) +'. ' : '';
                                rooms += roomNumber +
                                    roomItem.displayname +
                                    ': \n' +
                                    roomItem.data +
                                    ' (' + roomItem.url + ')' +
                                    '\n';
                            });
                            message += rooms + '\n'
                        }
                        break;
                    default:
                        if(item && item.displayname && item.data)
                            message += item.displayname + ': \n' + item.data + '\n\n';
                        break;
                }
            });

            const result = await Share.share({
                message:    message
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
                alert(error.message);
        }
    };

    /**
     * Sort course keys by list and alphabetically
     *
     * @returns {string[]}
     * @private
     */
    _getSortedKeys() {
        if(!this.course) {
            return;
        }

        let sortOrder = ['title', 'type', 'times', 'room', 'lecturer'];
        return Object.keys(this.course).sort((a,b) => {
            // First sort by our defined order
            if(sortOrder.indexOf(a) >= 0 && sortOrder.indexOf(b) >= 0)
                return sortOrder.indexOf(a) - sortOrder.indexOf(b);

            // If only a is a key of our sort order, move it up
            if(sortOrder.indexOf(a) >= 0)
                return -1;

            // If a nor b is within the sort order, sort alphabetically
            if(sortOrder.indexOf(b) === -1)
                return a - b;

            return 0;
        });
    }

    /**
     * Render _renderItems
     *
     * @returns {*}
     * @private
     */
    _renderItems = () => {
        if(!this.course) {
            return;
        }
        const {colors} = this.props.theme;
        const {t} = this.props;

        let keys = this._getSortedKeys();
        let itemList = [];

        keys.forEach(key => {
            if(key === 'title') return;
            let item = this.course[key];

            switch(key) {
                case 'lecturer':
                    if(item && item.length > 0) {
                        item.forEach(lecturerItem => {
                            itemList.push(
                                <List.Item key={key} title={lecturerItem.displayname ? lecturerItem.displayname : t('course:lecturer')}
                                           description={lecturerItem.data}
                                           titleStyle={this.styles.listTitle}
                                           descriptionStyle={this.styles.listDescription}
                                           descriptionNumberOfLines={200}
                                />);
                        });
                    }
                    break;
                case 'times':
                    if(item && item.length > 0) {
                        let title = '';
                        let times = '';
                        item.forEach(timeItem => {
                            title = timeItem.displayname;
                            times += timeItem.start + ' - ' + timeItem.end + ' ' + t('common:time') + ' - ' + timeItem.mode + '\n';
                        });
                        itemList.push(
                            <List.Item key={key} title={title}
                                       description={times}
                                       titleStyle={this.styles.listTitle}
                                       descriptionStyle={this.styles.listDescription}
                                       descriptionNumberOfLines={200} />);
                    }
                    break;
                case 'room':
                    if(item && item.length > 0) {
                        const showRoomNumbers = item.length > 1;
                        item.forEach((roomItem, i) => {
                            let roomNumber = (showRoomNumbers) ? (i+1) +'. ' : '';
                            itemList.push(
                                <List.Item
                                    key={key + '_' + i}
                                    title={roomNumber + roomItem.displayname}
                                    description={roomItem.data}
                                    titleStyle={this.styles.listTitle}
                                    descriptionStyle={this.styles.listDescription}
                                    right={props =>
                                        <List.Icon {...props}
                                                   icon={props => <IconsOpenasist icon={"map-search"} size={25}
                                                                                  color={colors.icon}/>}/>
                                    }
                                    onPress={() => Linking.openURL(roomItem.url)}
                                />);
                        });
                    } else if(item.data) {
                        itemList.push(
                            <List.Item
                                key={key}
                                title={t('room:title')}
                                description={item.data}
                                titleStyle={this.styles.listTitle}
                                descriptionStyle={this.styles.listDescription}
                                right={props =>
                                    item.url ? (
                                        <List.Icon {...props}
                                               icon={props => <IconsOpenasist icon={"map-search"} size={25}
                                                                              color={colors.icon}/>}/>
                                    ) : null
                                }
                                disabled={!item.url}
                                onPress={() =>   item.url && Linking.openURL(item.url)}
                            />);
                    }
                    break;
                default:
                    if(item && item.displayname && item.data)
                        itemList.push(
                            <List.Item key={key} title={item.displayname}
                                       description={item.data}
                                       titleStyle={this.styles.listTitle}
                                       descriptionStyle={this.styles.listDescription}
                                       descriptionNumberOfLines={200}
                                       onPress={() => item.url && Linking.openURL(item.url)}
                                       right={
                                       props => item.url && <List.Icon {...props}
                                                                icon={props => <IconsOpenasist
                                                                    icon={"forward"} size={25}
                                                                    color={colors.icon}/>}/>}
                            />);
                    break;
            }
        });

        return (
            <>
                {itemList}
            </>
        )
    };

    /**
     * Render book details content
     *
     * @returns {*}
     * @private
     */
    _renderContent = () => {
      const {themeStyles} = this.props.theme;
        return (
            <View style={[themeStyles.container, this.styles.containerInner]}>
                <Headline style={this.styles.titleHeadline}>{this.course.title.data}</Headline>
                <ScrollView>
                    {this._renderItems()}
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

        if(!this.course){
            return (
                <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                    <AppbarComponent {...this.props}
                                     title={t('course:lectureInformation')}/>
                    <Text>{t('course:couldNotLoad')}</Text>
                </SafeAreaView>
            );
        }

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.appSafeAreaContainer]}>
                <AppbarComponent {...this.props}
                                 title={t('course:lectureInformation')}
                                 rightAction={<Appbar.Action icon="share-variant" onPress={this._onShare.bind(this)}/>}/>
                {this._renderContent()}
            </SafeAreaView>
        );
    }
}


const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(CourseDetailComponent)))
