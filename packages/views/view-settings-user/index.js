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

import { useMemo } from 'react';
import { SafeAreaView, View, StyleSheet, Alert } from 'react-native';

import { useTheme, Text, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { DateTime } from 'luxon';

import { useLanguage } from '@openasist/core';
import AppbarComponent from '@openasist/component-app-bar';
import { useUser, useUserContext } from '@openasist/context-user';

import componentStyles from './styles';

/**
 * Renders the User Settings view.
 *
 * @param {Object} props - The component props.
 */
export default function UserSettingsView(props) {
    const componentName = UserSettingsView.name;
    // Get theme from theme context
    const theme = useTheme();
    const { themeStyles } = theme;
    // Get translation function from translation hook
    const { t } = useTranslation();
    const language = useLanguage();

    const [user, login, logout] = useUser();
    const { refreshTokenExpiresAt } = useUserContext();
    const refreshTokenExpiresAtDateTime = refreshTokenExpiresAt
        ? DateTime.fromSeconds(refreshTokenExpiresAt, { locale: language })
        : null;

    // Create styles object using useMemo to prevent unnecessary re-renders
    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    );

    return (
        // SafeAreaView is used to render content within the safe area boundaries of a device.
        <SafeAreaView style={[styles.container, themeStyles.appSafeAreaContainer]}>
            {/* AppbarComponent is a custom component for the app's header bar. */}
            <AppbarComponent {...props} title={t('user:settingsTitle')} />

            {/* This View contains the main content of the screen. */}
            <View accessible={false} style={themeStyles.container}>
                {
                    user
                        ? <>
                            <Text style={styles.userinfoGreeting}>
                                Hallo {user.name}
                            </Text>

                            <Text style={styles.userinfoHeadline}>
                                {t('user:username')}
                            </Text>
                            <Text style={styles.userinfoValue}>
                                {user.sub}
                            </Text>

                            <Text style={styles.userinfoHeadline}>
                                {t('user:email')}
                            </Text>
                            <Text style={styles.userinfoValue}>
                                {user.email}
                            </Text>

                            <Text style={styles.userinfoHeadline}>
                                {t('user:memberTypes')}
                            </Text>
                            {

                                user?.member_types
                                    ?.map(
                                        member_type =>
                                            <Text key={member_type} style={styles.userinfoValue}>
                                                {t(`user:memberType.${member_type}`)}
                                            </Text>
                                    )
                                ?? null
                            }

                            <Text style={styles.userinfoHeadline}>
                                {t('user:organizationalUnits')}
                            </Text>
                            {
                                user?.organizational_units
                                    ?.map(
                                        organizational_unit =>
                                            <Text key={organizational_unit.number} style={styles.userinfoValue}>
                                                {`${organizational_unit.name}(${organizational_unit.number}|${organizational_unit.short_name})`}
                                            </Text>
                                    )
                                ?? null
                            }

                            <Text style={styles.userinfoHeadline}>
                                {t('user:refreshTokenExpiresAt')}
                            </Text>
                            <Text style={styles.userinfoValue}>
                                {refreshTokenExpiresAtDateTime?.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
                            </Text>

                            <Button
                                onPress={() => Alert.alert(
                                    t('user:logout'),
                                    t('user:logoutConfirmation'),
                                    [
                                        {
                                            text: t('user:logoutOkButton'),
                                            onPress: () => logout?.(),
                                        },
                                        {
                                            text: t('user:logoutNoButton'),
                                            isPreferred: true,
                                        }
                                    ]
                                )}
                            >
                                {t('user:logout')}
                            </Button>
                        </>
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
