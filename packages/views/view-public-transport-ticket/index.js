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

import { useState, useEffect, useMemo, useCallback } from 'react';
import { AppState, SafeAreaView, View, ScrollView, StyleSheet, Alert, useWindowDimensions, RefreshControl } from 'react-native';

import { useTheme, Text, Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-native-qrcode-svg';

import AppbarComponent from '@openasist/component-app-bar';
import { useUser } from '@openasist/context-user';
import { usePublicTransportTicket } from '@openasist/context-public-transport-ticket';

import componentStyles from './styles';

/**
 * View zum Anzeigen eines OPNV-Tickets.
 */
export default function PublicTransportTicketView() {
    const componentName = PublicTransportTicketView.name;
    // Get theme from theme context
    const theme = useTheme();
    const { themeStyles } = theme;
    // Get translation function from translation hook
    const { t } = useTranslation();

    const [user, login] = useUser();
    const [ticketBarcode, ticketOwner, ticketValidFrom, ticketValidTo, refreshTicket] = usePublicTransportTicket();
    const { width } = useWindowDimensions();

    const [refreshingTicketScrollView, setRefreshingTicketScrollView] = useState(false);

    // Create styles object using useMemo to prevent unnecessary re-renders
    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    useFocusEffect(
        useCallback(
            () => {
                console.log(componentName, ':', 'useFocusEffect', ':', 'update ticket');
                refreshTicket?.()
            },
            [refreshTicket]
        )
    );

    useEffect(
        () => {
            const focusSubscription = AppState.addEventListener(
                'focus',
                () => {
                    console.log(componentName, ':', 'focus', ':', 'update ticket');
                    refreshTicket?.();
                }
            );

            return () => {
                focusSubscription.remove();
            };
        },
        []
    );

    const onRefreshTicketScrollView = useCallback(
        () => {
            if (refreshTicket) {
                setRefreshingTicketScrollView(true);
                refreshTicket()
                    .finally(() => setRefreshingTicketScrollView(false));
            }
        },
        [setRefreshingTicketScrollView, refreshTicket]
    );

    return (
        // SafeAreaView is used to render content within the safe area boundaries of a device.
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            {/* AppbarComponent is a custom component for the app's header bar. */}
            <AppbarComponent title={t('publictransportticket:title')} />

            {/* This View contains the main content of the screen. */}
            <View accessible={false} style={themeStyles.container}>
                {
                    user
                        ? <ScrollView
                            style={
                                {
                                    padding: '10%',
                                }
                            }
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshingTicketScrollView}
                                    onRefresh={onRefreshTicketScrollView}
                                />
                            }
                        >
                            {
                                ticketBarcode
                                    ? <>
                                        <View>
                                            <QRCode
                                                value={ticketBarcode}
                                                size={width * 0.8}
                                            />
                                        </View>
                                        <Text>
                                            <Text
                                                style={styles.infoName}
                                            >
                                                Inhaber:
                                            </Text>
                                            {ticketOwner}
                                        </Text>
                                        <Text>
                                            <Text
                                                style={styles.infoName}
                                            >
                                                Gültigkeit:
                                            </Text>
                                            {ticketValidFrom} - {ticketValidTo}
                                        </Text>
                                    </>
                                    : null
                            }
                        </ScrollView>
                        : <>
                            <Text>
                                Sie sind nicht eingeloogt
                            </Text>
                            <Button
                                onPress={
                                    () =>
                                        login
                                            ? login()
                                                .catch(
                                                    reason => {
                                                        console.debug(componentName, ':', 'login failed', ':', reason);
                                                        Alert.alert(
                                                            t('user:loginFailed'),
                                                            t('user:tryLoginAgain'),
                                                        );
                                                    }
                                                )
                                            : Alert.alert(
                                                t('user:connectionError'),
                                                t('user:connectionErrorTryLoginAgain'),
                                            )
                                }
                            >
                                {t('user:logginButton')}
                            </Button>
                        </>
                }
            </View>
        </SafeAreaView>
    );
}