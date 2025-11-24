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

import { useState, useMemo } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Switch,
    Alert,
    RefreshControl,
} from 'react-native';

import { connect } from 'react-redux'
import { useTheme, Text, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { useParallelCalls } from '@olea-bps/context-callmanager';
import { useUser } from '@olea-bps/context-user';
import { AppBar as AppbarComponent } from '@olea-bps/components';

import componentStyles from './styles';

export default function CallManagerView(props) {
    const componentName = CallManagerView.name;
    const theme = useTheme();
    const themeStyles = theme?.themeStyles;

    const { t } = useTranslation();


    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme]
    )

    const [user, login, logout] = useUser();
    const [parallelCalls, refreshParallelCalls, changeParallelCall] = useParallelCalls();

    const [remoteDestinationProfilesRefreshing, setRemoteDestinationProfilesRefreshing] = useState(false);

    return (
        <SafeAreaView style={themeStyles.appSafeAreaContainer}>
            <AppbarComponent {...props}
                title={t('menu:titles.callmanager')}
            />
            <View style={themeStyles.container}>
                {
                    // Wenn ein Nutzer in der App angemeldet ist, werden dessen Parralelrufe angezeigt. Ansonsten wird der Nutzer zum Loggin aufgefordert.
                    user
                        ? <RefreshControl
                            refreshing={remoteDestinationProfilesRefreshing}
                            onRefresh={() => {
                                setRemoteDestinationProfilesRefreshing(true);
                                refreshParallelCalls()
                                    .finally(() => setRemoteDestinationProfilesRefreshing(false));
                            }}
                        >
                            <Text>
                                {t('callmanager:userInfo', { userName: user.name, userPhoneNumber: user.phone_number })}
                            </Text>
                            {
                                parallelCalls?.map?.(
                                    parallelCall => {
                                        const isActive = parallelCall?.enableMobileConnect;

                                        return (
                                            <View
                                                key={parallelCall?.destination}
                                            >
                                                <Text>
                                                    {parallelCall?.destination ?? t('callmanager:numberNotDisplayable')}
                                                </Text>
                                                <Switch
                                                    value={isActive}
                                                    onValueChange={
                                                        value =>
                                                            changeParallelCall(parallelCall?.destination, { enableMobileConnect: value })
                                                                .then(() => refreshParallelCalls())
                                                    }
                                                />
                                            </View >
                                        )
                                    }
                                )
                            }
                            <Button
                                onPress={() => Alert.alert(
                                    t('callmanager:logout'),
                                    t('callmanager:logoutConfirmation'),
                                    [
                                        {
                                            text: t('callmanager:logoutOkButton'),
                                            onPress: () => logout?.(),
                                        },
                                        {
                                            text: t('callmanager:logoutNoButton'),
                                            isPreferred: true,
                                        }
                                    ]
                                )}
                            >
                                {t('callmanager:logout')}
                            </Button>
                        </RefreshControl>
                        : <>
                            <Text>
                                {t('callmanager:notLoggedIn')}
                            </Text>
                            <Button
                                onPress={
                                    () =>
                                        login
                                            ? login()
                                                .catch(
                                                    reason => {
                                                        Alert.alert(
                                                            t('callmanager:loginFailed'),
                                                            t('callmanager:tryLoginAgain'),
                                                        );
                                                        console.debug(componentName, ':', 'login failed', ':', reason);
                                                    }
                                                )
                                            : Alert.alert(
                                                t('callmanager:connectionError'),
                                                t('callmanager:connectionErrorTryLoginAgain'),
                                            )
                                }
                            >
                                {t('callmanager:logginButton')}
                            </Button>
                        </>
                }
            </View>
        </SafeAreaView >
    )
}
