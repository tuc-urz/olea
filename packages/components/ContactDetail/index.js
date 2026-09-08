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
    useTheme,
} from "react-native-paper";

import { connect } from 'react-redux'
import { useTranslation } from "react-i18next";
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
export default function ContactDetailComponent({ contact, ...restProps }) {
    const theme = useTheme();
    const { themeStyles } = theme;
    const { t } = useTranslation();

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    );

    const onShare = useCallback(
        async () => {
            try {
                const contactTelephones = contact.telephone;
                const shareMessageTelephoneNumbers = contactTelephones
                    .map(telephone => telephone.number)
                    .map(number => `${t('contact:phone')}: ${number}`)
                    .join('\n');

                const shareMessage = `${t('contact:title')} - ${contact.firstName} ${contact.lastName}`
                    +
                    (
                        contact?.building
                            ? `\n${t('contact:building')}: ${contact.building}`
                            : ''
                    )
                    +
                    (
                        contact?.department
                            ? `\n${t('contact:department')}: ${contact.department}`
                            : ''
                    )
                    +
                    (
                        contact?.room?.title
                            ? `\n${t('contact:room')}: ${contact.room.title}`
                            : ''
                    )
                    +
                    (
                        contact?.email
                            ? `\n${t('contact:email')}: ${contact.email}`
                            : ''
                    )
                    +
                    shareMessageTelephoneNumbers;

                await Share.share({
                    message: shareMessage,
                });
            } catch (error) {
                alert(error.message);
            }
        },
        [contact, t]
    );

    return contact
        ? <SafeAreaView style={[styles.container, themeStyles.safeAreaContainer]}>
            <AppbarComponent
                {...restProps}
                title={t('contact:contactInformation')}
                rightAction={<AppbarAction icon='share' onPress={onShare} />}
            />
            <ScrollView style={styles.containerInner}>
                <Headline style={styles.name}>{contact.firstName} {contact.lastName}</Headline>
                {
                    contact?.building
                        ? <List.Item
                            key="building"
                            title={t('contact:building')}
                            description={contact.building}
                            descriptionStyle={themeStyles.textLighter}
                            titleStyle={themeStyles.searchDetailTitle}
                            descriptionNumberOfLines={200} />
                        : null
                }
                {
                    contact?.department
                        ? <List.Item
                            key="department"
                            title={t('contact:department')}
                            description={contact.department}
                            descriptionStyle={themeStyles.textLighter}
                            titleStyle={themeStyles.searchDetailTitle}
                            descriptionNumberOfLines={200} />
                        : null
                }
                {
                    contact?.room && contact?.room?.title
                        ? <List.Item
                            key="room"
                            title={t('contact:room')}
                            description={contact.room.title}
                            descriptionStyle={themeStyles.textLighter}
                            titleStyle={themeStyles.searchDetailTitle}
                            descriptionNumberOfLines={200} />
                        : null
                }
                {
                    contact?.email
                        ? <TouchableOpacity
                            key="email"
                            onPress={() => Linking.openURL('mailto:' + contact.email)}
                        >
                            <List.Item
                                title={t('contact:email')}
                                description={contact.email}
                                descriptionStyle={themeStyles.textLighter}
                                titleStyle={themeStyles.searchDetailTitle}
                                right={props => <List.Icon {...props} icon="email" />}
                            />
                        </TouchableOpacity>
                        : null
                }
                {
                    Array.isArray(contact?.telephone)
                        ? contact.telephone.map(
                            (telephone, index, telephones) => {

                                const title = telephones.length > 0
                                    ? t('contact:phone')
                                    : t('contact:phone') + ' ' + index;

                                const telephoneNumber = telephone.number

                                return (
                                    <TouchableOpacity
                                        key={telephoneNumber}
                                        onPress={
                                            () => {
                                                const formattedPhoneNumber = telephone.number.replace(/\s/g, '');
                                                Linking.openURL('tel:' + formattedPhoneNumber).catch(error => console.error(`ContactDetailComponent - Fehler beim öffnen des Telefons ${Platform.OS}`, error));
                                            }
                                        }
                                    >
                                        <List.Item
                                            title={title}
                                            description={telephoneNumber}
                                            descriptionStyle={themeStyles.textLighter}
                                            titleStyle={themeStyles.searchDetailTitle}
                                            right={
                                                props =>
                                                    <List.Icon
                                                        {...props}
                                                        icon="phone"
                                                    />
                                            }
                                        />
                                    </TouchableOpacity>
                                )
                            }
                        )
                        : null
                }
                <View style={styles.space} />
            </ScrollView>
        </SafeAreaView>

        : <Text>
            {t('contact:couldNotLoad')}
        </Text>;
}