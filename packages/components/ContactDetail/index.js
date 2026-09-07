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

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Appbar,
    Headline,
    List,
    withTheme,
} from "react-native-paper";

import { connect } from 'react-redux'
import { withTranslation } from "react-i18next";
import merge from 'lodash/merge';

import componentStyles from './styles';
import AppbarComponent from '../AppBar';
import AppbarAction from '../AppbarAction';


/**
 * Contact Detail Component
 *
 * Shows the detailed information of a contact with name and contact details.
 * Provides a share functionality.
 *
 * Parameters:
 *  - contact: Contact object with all information about the contact
 *
 * Navigation-Parameters:
 *  - none
 */
function ContactDetailComponent(props) {
    const {
        theme,
        contact,
        t,
    } = props;
    const { themeStyles } = theme;

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    );

    /**
     * Share function for contact
     *
     * @returns {Promise<void>}
     * @private
     */
    const _onShare = async () => {
        try {
            const { t } = props;

            let phone = "";
            if (props.contact.telephone.length > 0) {
                phone += "\n" + t('contact:phone') + ": ";
                props.contact.telephone.forEach((phoneNumber) => {
                    phone += phoneNumber.number + '\n';
                });
            }

            let message = t('contact:title') + ' - ' + props.contact.firstName + ' ' + props.contact.lastName +
                ((props.contact.building) ? "\n" + t('contact:building') + ": " + props.contact.building : '') +
                ((props.contact.department) ? "\n" + t('contact:department') + ": " + props.contact.department : '') +
                ((props.contact.room && props.contact.room.title) ? "\n" + t('contact:room') + ": " + props.contact.room.title : '') +
                ((props.contact.email) ? "\n" + t('contact:email') + ": " + props.contact.email : '') +
                phone;

            const result = await Share.share({
                message: message
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
     * Render contact details content
     *
     * @returns {*}
     * @private
     */
    const _renderContent = () => {
        const { contact, t } = props;
        const { themeStyles } = props.theme;

        let output = [];
        let index = 1;




        if (contact.building)
            output.push(<List.Item key="building" title={t('contact:building')} description={contact.building}
                descriptionStyle={themeStyles.textLighter} titleStyle={themeStyles.searchDetailTitle}
                descriptionNumberOfLines={200} />);

        if (contact.department)
            output.push(<List.Item key="department" title={t('contact:department')} description={contact.department}
                descriptionStyle={themeStyles.textLighter} titleStyle={themeStyles.searchDetailTitle}
                descriptionNumberOfLines={200} />);

        if (contact.room && contact.room.title)
            output.push(<List.Item key="room" title={t('contact:room')} description={contact.room.title}
                descriptionStyle={themeStyles.textLighter} titleStyle={themeStyles.searchDetailTitle}
                descriptionNumberOfLines={200} />);

        if (contact.email)
            output.push(<TouchableOpacity key="email" onPress={() => Linking.openURL('mailto:' + contact.email)}>
                <List.Item title={t('contact:email')} description={contact.email}
                    descriptionStyle={themeStyles.textLighter} titleStyle={themeStyles.searchDetailTitle}
                    right={props => <List.Icon {...props} icon="email" />} />
            </TouchableOpacity>
            );

        if (contact.telephone.length > 0) {
            contact.telephone.forEach((phoneNumber) => {
                output.push(
                    <TouchableOpacity key={'phone_' + index} onPress={() => {
                        const formattedPhoneNumber = phoneNumber.number.replace(/\s/g, '');
                        Linking.openURL('tel:' + formattedPhoneNumber).catch(error => console.error(`ContactDetailComponent - Fehler beim öffnen des Telefons ${Platform.OS}`, error));
                    }}>
                        <List.Item
                            title={t('contact:phone') + ' ' + index}
                            description={phoneNumber.number}
                            descriptionStyle={themeStyles.textLighter}
                            titleStyle={themeStyles.searchDetailTitle}
                            right={props =>
                                <List.Icon {...props}
                                    icon="phone" />}
                        />
                    </TouchableOpacity>
                );
                index++;
            });
        }


        return (
            <ScrollView style={this.styles.containerInner}>
                <Headline style={this.styles.name}>{contact.firstName} {contact.lastName}</Headline>
                {output}
                <View style={this.styles.space} />
            </ScrollView>
        );
    };

    return contact
        ? <SafeAreaView style={[this.styles.container, themeStyles.safeAreaContainer]}>
            <AppbarComponent
                {...this.props}
                title={t('contact:contactInformation')}
                rightAction={<AppbarAction icon='share' onPress={this._onShare.bind(this)} />}
            />
            {this._renderContent()}
        </SafeAreaView>

        : <Text>
            {t('contact:couldNotLoad')}
        </Text>;
}

export default withTranslation()(withTheme(ContactDetailComponent));