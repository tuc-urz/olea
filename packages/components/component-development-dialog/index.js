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

import { useMemo, useCallback, FC } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import { useDispatch } from 'react-redux';
import { useTheme, Portal, Dialog, Checkbox, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { onSettingDevelopOverride, useActiveStagingMenuItems, useShowDeeplinkAlert, useStagingServer, useSubscriberId } from '@openasist/core';

import componentStyles from './styles'

/**
 * Ein Dialog, welches Optionen für Entwickler anzeigt.
 * Der Dialog verwendet sein eigenes {@link Portal}, sodass nur die Einbindung dieser Komponente für die richtige Funktionweise nötig ist.
 *
 * Über diesen Dialog, kann auf den Staging-Server umgeschaltet werden.
 *
 * @param {object} props
 * @param {boolean} props.visible Wird der Dialog angezeigt?
 * @param {() => void} [props.onDismiss] Callback-Funktion welche ausgeführt wird, wenn der Dialog geschlossen werden soll.
 * @returns {FC}
 */
export default function DevelopmentDialog({ visible, onDismiss }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { colors, appSettings } = theme;
    const mainMenuSettings = appSettings?.mainMenu;
    const menuItems = mainMenuSettings?.items ?? {};
    const menuRoutes = mainMenuSettings?.routes ?? [];
    const isStagingServerActive = useStagingServer();
    const subscriberId = useSubscriberId();
    const showDeeplinkAlert = useShowDeeplinkAlert();
    const activeStagingMenuItems = useActiveStagingMenuItems();
    const dispatch = useDispatch();

    const styles = useMemo(
        () => StyleSheet.create(componentStyles(theme)),
        [theme, componentStyles]
    )

    // Erzeugen einer Funktion, die die Entwicklereinstellugen setzt.
    // Dabei werden immer die derzeitigen Werte gesetzt, außer es werden neue Werte zum überschreiben übergeben.
    // Diese Funktion sollte langfristig entfallen.
    const setDevelopmentSettings = useCallback(
        (settings) => dispatch(
            onSettingDevelopOverride(
                'settingsDevelop',
                {
                    useStaging: isStagingServerActive,
                    showDeeplinkAlert: showDeeplinkAlert,
                    activeStagingMenuItems: activeStagingMenuItems,
                    ...settings,
                }
            )
        ),
        [isStagingServerActive, showDeeplinkAlert, activeStagingMenuItems, onSettingDevelopOverride]
    )

    const output = [];

    output.push(
        <View key={'item_use_stg'} style={styles.selectOption}>
            <Text>{t('settings:develop.useStagingServer')}</Text>
            <Checkbox.Android status={isStagingServerActive ? 'checked' : 'unchecked'}
                onPress={() => setDevelopmentSettings({ useStaging: !isStagingServerActive })}
                color={colors.checkboxChecked}
                uncheckedColor={colors.checkboxUnchecked}
            />
        </View>
    );

    output.push(
        <View key={'item_notification_subscriber'} style={[{ marginBottom: 30 }]}>
            <Text>{t('settings:develop.notificationSubscriberId')}</Text>
            <Text>{subscriberId}</Text>
        </View>
    );
    output.push(
        <View key={'item_notification_push_message'} style={[{ marginBottom: 30 }]}>
            <Text>{t('settings:develop.resetPushMessage')}</Text>
            <Button
                color={colors.buttonText}
                onPress={() => dispatch({ type: 'UPDATE_PUSH_MESSAGE_SHOWN', pushMessageShown: false })}
            >
                Reset
            </Button>
        </View>
    );
    output.push(
        <View key={'item_deeplink_show_url'} style={[{ marginBottom: 30 }, styles.selectOption]}>
            <Text>{t('settings:develop.showDeepLink')}</Text>
            <Checkbox
                status={showDeeplinkAlert ? 'checked' : 'unchecked'}
                onPress={() => setDevelopmentSettings({ showDeeplinkAlert: !showDeeplinkAlert })}
                color={colors.checkboxChecked}
                uncheckedColor={colors.checkboxUnchecked}
            ></Checkbox>
        </View>
    );

    // Für jeden Menü-Tab einen Bereich erstellen und im Bereich für jeden Menüpunkt eine Checkbox anbieten.
    // Menüpunkte-Objekt in ein Array umwandeln
    const activatableMenuItemsSettings = Object.entries(menuItems)
        // Aus der Liste der Menüpunkten, werden die Menüpunkte herausgefiltert, die immer aktiv/eingeschaltet sind.
        .map(
            ([menuItemKey, menuItemEntries]) => {
                const stagingMenuItemEntries = menuItemEntries.filter(
                    menuItemEntry =>
                        // Wenn active-Property nicht vorhanden, ist der Menüpunkt activ, dann Negierung, weil nicht aktive Menueinträge gefiltert werden
                        !(menuItemEntry?.active ?? true)
                );
                return [menuItemKey, stagingMenuItemEntries];
            }
        )
        // Es werden Menü-Tabs herausgefiltert, die keine Menüpunkte, die nur im Stagingmodus zu sehen sind.
        .filter(
            ([menuItemKey, stagingMenuItemEntries]) => (stagingMenuItemEntries?.length ?? 0) > 0
        )
        // Rendern der Menü-Tabs und deren Menüeinträge
        .map(
            ([menuItemKey, stagingMenuItemEntries]) => {
                const mainMenuRouteTitleKey = menuRoutes
                    ?.find(menuRoute => menuRoute?.key === menuItemKey)
                    ?.title;

                return (
                    < View key={`item_menuitems_${menuItemKey}`} >
                        <Text>{t(mainMenuRouteTitleKey)}-Tab</Text>
                        {
                            // Rendern der Menüpunkte eines Menü-Tabs
                            stagingMenuItemEntries.map(
                                stagingMenuItemEntry => {
                                    const stagingMenuItemEntryKey = `${stagingMenuItemEntry?.title}`;

                                    // Der Menüpunkt ist aktiv, wenn sein Schlüssel in der Liste der activen Menüpunkte zu finden ist
                                    const isActive = activeStagingMenuItems.includes(stagingMenuItemEntryKey);

                                    return (
                                        <Checkbox.Item
                                            key={stagingMenuItemEntryKey}
                                            label={t(stagingMenuItemEntry?.title)}
                                            status={isActive ? 'checked' : 'unchecked'}
                                            color={colors.checkboxChecked}
                                            uncheckedColor={colors.checkboxUnchecked}
                                            theme={theme}
                                            style={styles.selectOption}
                                            onPress={() => setDevelopmentSettings(
                                                {
                                                    activeStagingMenuItems: isActive
                                                        // Wenn der Menüpunkt schon aktiv ist, wird er aus der Liste der aktiven Punkte entfernt.
                                                        ? activeStagingMenuItems.filter(activeStagingMenuItem => activeStagingMenuItem !== stagingMenuItemEntryKey)
                                                        // Wenn der Menüpunkt nicht aktiv ist, wird er zur Liste der aktiven Punkte hinzugefügt.
                                                        : [...activeStagingMenuItems, stagingMenuItemEntryKey]
                                                }
                                            )}
                                        />
                                    )
                                }
                            )
                        }
                    </View>
                )
            }
        );

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>{t('settings:develop.dialog')}</Dialog.Title>
                <Dialog.Content>
                    {
                        [
                            ...output,
                            ...activatableMenuItemsSettings,
                        ]
                    }
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        onPress={onDismiss}
                        color={colors.buttonText}
                    >
                        {t('common:okLabel')}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}