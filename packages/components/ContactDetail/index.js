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
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Share,
    Linking,
    TouchableOpacity,
    Platform,
    ScrollView
} from 'react-native';
import {Appbar, Headline, List, withTheme} from "react-native-paper";

import { connect } from 'react-redux'
import {withTranslation} from "react-i18next";
import merge from 'lodash/merge';

import componentStyles from "./styles"
import { AppBar as AppbarComponent } from '@olea-bps/components';


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
class ContactDetailComponent extends React.Component {
    static propTypes = {
        contact: PropTypes.object.isRequired
    };

    // Styles of this component
    styles;

    contact = null;


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
    };

    /**
     * Share function for contact
     *
     * @returns {Promise<void>}
     * @private
     */
    async _onShare() {
        try {
            const { t } = this.props;

            let phone = "";
            if(this.contact.telephone.length > 0) {
                phone += "\n"+ t('contact:phone') +": ";
                this.contact.telephone.forEach((phoneNumber) => {
                    phone += phoneNumber.number + '\n';
                });
            }

            let message = t('contact:title') + ' - ' + this.contact.firstName + ' ' + this.contact.lastName +
                ((this.contact.building)                        ? "\n" + t('contact:building') + ": " + this.contact.building       : '') +
                ((this.contact.department)                      ? "\n" + t('contact:department') + ": " + this.contact.department   : '') +
                ((this.contact.room && this.contact.room.title) ? "\n" + t('contact:room') + ": " + this.contact.room.title         : '') +
                ((this.contact.email)                           ? "\n" + t('contact:email') + ": " + this.contact.email             : '') +
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
    _renderContent = () => {
        const { contact, t } = this.props;
        const { themeStyles } = this.props.theme;

        let output = [];
        let index = 1;




        if(contact.building)
            output.push(<List.Item key="building" title={t('contact:building')}   description={contact.building}
                                   descriptionStyle={themeStyles.textLighter} titleStyle={themeStyles.searchDetailTitle}
                                   descriptionNumberOfLines={200}/>);

        if(contact.department)
            output.push(<List.Item key="department" title={t('contact:department')} description={contact.department}
                                   descriptionStyle={themeStyles.textLighter} titleStyle={themeStyles.searchDetailTitle}
                                   descriptionNumberOfLines={200}/>);

        if(contact.room && contact.room.title)
            output.push(<List.Item key="room" title={t('contact:room')} description={contact.room.title}
                                   descriptionStyle={themeStyles.textLighter} titleStyle={themeStyles.searchDetailTitle}
                                   descriptionNumberOfLines={200}/>);

        if(contact.email)
            output.push(<TouchableOpacity key="email" onPress={() => Linking.openURL('mailto:' + contact.email)}>
                            <List.Item title={t('contact:email')} description={contact.email}
                                descriptionStyle={themeStyles.textLighter} titleStyle={themeStyles.searchDetailTitle}
                                right={props => <List.Icon {...props} icon="email"/>}/>
                        </TouchableOpacity>
            );

        if(contact.telephone.length > 0) {
            contact.telephone.forEach((phoneNumber) => {
                output.push(
                    <TouchableOpacity key={'phone_'+ index} onPress={() => {
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
                                           icon="phone"/>}
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
                <View style={this.styles.space}/>
            </ScrollView>
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
        const { contact, t } = this.props;

        if(!contact){
            return (<Text>{t('contact:couldNotLoad')}</Text>);
        }

        this.contact = contact;

        return (
            <SafeAreaView style={[this.styles.container, themeStyles.safeAreaContainer]}>
                <AppbarComponent {...this.props}
                                 title={t('contact:contactInformation')}
                                 rightAction={<Appbar.Action icon="share-variant" onPress={this._onShare.bind(this)}/>}/>
                {this._renderContent()}
            </SafeAreaView>
        );
    }
}


const mapStateToProps = state => {
    return {
        pluginComponent: state.pluginReducer.contactDetail.component,
        pluginStyles: state.pluginReducer.contactDetail.styles
    };
};

export default connect(mapStateToProps, null)(withTranslation()(withTheme(ContactDetailComponent)))
