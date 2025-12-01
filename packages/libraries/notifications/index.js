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
import messaging from '@react-native-firebase/messaging';

import notifee, { AndroidStyle, EventType } from '@notifee/react-native';
import { feedApi, RootNavigation, store, updateFeeds } from "@olea-bps/core";
import SubscriberService from './services/subscriber.service'

export default class OpenASiSTNotifications {
    subscriberService = null

    navConfig = null;

    languages = null;

    /**
     *
     * @param configuration: Object  (see 'notification' in Settings.js)
     * @param navigationConfiguration : Object (see 'navigation' in Settings.js)
     * @param languages : Object (see 'languages' in Settings.js)
     */
    constructor(configuration, navigationConfiguration, languages) {
        this.subscriberService = new SubscriberService(configuration);
        this.navConfig = navigationConfiguration;
        this.languages = languages;
    }

    /**
     * App is in background, handle incoming messages
     *
     * Important: This function must be called as soon as possible! (Before app initialization)
     */
    initBackgroundHandler() {
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            await this.createNotification(remoteMessage);
        });

        notifee.onBackgroundEvent(async ({ type, detail }) => {
            await this.handlePNAction(type, detail);
        });
    }

    /**
     * App is in foreground
     */
    initForegroundHandler() {
        this.requestPermission().then(async () => {
            await this.subscriberService.initializeSubscriber();

            // Listen for new Messages while the app is in foreground
            messaging().onMessage(async remoteMessage => {
                await this.createNotification(remoteMessage);
            });

            notifee.onForegroundEvent(async ({ type, detail }) => {
                await this.handlePNAction(type, detail);
            })
        });
    }

    unregister() {
        // Unregister the user device from firebase
        messaging().unregisterDeviceForRemoteMessages().then(() => {/* Unregistered */});
        notifee.cancelAllNotifications().then(() => {/* Cancelled all notifications */});
    }

    /**
     * Handle all actions of a push notification, no matter if back- or foreground
     *
     * @param type
     * @param detail
     * @returns {Promise<void>}
     */
    async handlePNAction(type, detail) {
        // notification details and action (like "mark as seen") the user has pressed
        const { notification, pressAction } = detail;
        switch(type) {
            case EventType.PRESS:
                const {newsDetail} = this.navConfig;
                this.subscriberService.markNotificationAsSeen(notification.id);
                await notifee.cancelNotification(notification.id);
                RootNavigation.onNavigationReady(() => {
                    // Trigger News Refresh
                    store.dispatch( updateFeeds() );
                    RootNavigation.navigate(newsDetail.screen, newsDetail.params(notification.data.payload));
                });
                break;
            case EventType.APP_BLOCKED:
            case EventType.DISMISSED:
                this.subscriberService.markNotificationAsSeen(notification.id);
                await notifee.cancelNotification(notification.id);
                break;
            case EventType.FG_ALREADY_EXIST:
                await notifee.cancelNotification(notification.id);
                break;
            /*
            case EventType.ACTION_PRESS && pressAction.id === 'mark-as-read':
                this.subscriberService.markNotificationAsSeen(notification.id)
                // Remove the notification
                await notifee.cancelNotification(notification.id);
                break;
                */
        }
    }


    /**
     * Request permission to display notifications
     *
     * @returns {Promise<void>}
     */
    async requestPermission() {
        const authStatus = await notifee.requestPermission({
            criticalAlert: true
        });

        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        await notifee.requestPermission({
            criticalAlert: true
        })

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    }


    /**
     * Collect data and create the notification
     * @returns {Promise<void>}
     */
    async createNotification(messageDetails) {
        const language = store.getState().settingReducer.settingsGeneral.language;
        const {enabledFeedNotifications, enableAllNotifications, enablePushNotifications} = store.getState().settingReducer.settingsNotifications;
        if(!enablePushNotifications) return;

        const {notificationId, type, id, fallbackMessage} = messageDetails?.data;
        const isCritical = type === 'critical';

        let fallbackText = '';
        try {
            const fallback = JSON.parse(fallbackMessage);
            fallbackText = fallback[language];
        } catch( e) {
            fallbackText = fallbackMessage;
        }

        if(type === undefined || id === undefined || id === null || id === "") {
            return;
        }

        switch(type) {
            case 'critical':
            case 'feed':
                feedApi.getNewsById(id, news => {
                    if(news === -1 || (news && !news.title)) {
                        return;
                    } else if(news !== 0 && news.title) {
                        // If not all notifications, feed notification or the explicit feed are enabled, return
                        if(!enabledFeedNotifications || enabledFeedNotifications?.length === 0 || (enabledFeedNotifications?.length > 0 && enabledFeedNotifications.indexOf(parseInt(news.originFeedId, 10)) === -1)) {
                            return;
                        }
                        this.displayNotification({
                            id: notificationId,
                            title: news.title,
                            desc: news.shortDesc,
                            image: news.descImageUrl,
                            isCritical,
                            payload: news
                        });
                    }
                });
                break;
            case 'grades':
                // TODO -> Network request + display notification
                break;

            default:
                return;
        }

    }

    /**
     * Show a notification
     *
     * @param notification
     * @returns {Promise<void>}
     */
    async displayNotification(notification) {
        const {id, title, desc, image, isCritical, payload} = notification;

        if(!id) { console.error('Id is required to display a notification'); return; }
        if(!title) { console.error('Title is required to display a notification'); return; }


        // Create a channel (required for Android)
        const defaultChannelId = await notifee.createChannel({
            id: 'common',
            name: 'Allgemeine Benachrichtigungen',
            sound: 'default'
        });
        const criticalChannelId = await notifee.createChannel({
            id: 'critically',
            name: 'Kritische Benachrichtigungen',
            bypassDnd: true,
            sound: 'default'
        });

        // Additional Android Settings:
        let android = {};
        if(image) {
            // NOTE: iOS Requires local files: https://notifee.app/react-native/reference/iosnotificationattachment
            // So this isn't implemented right now.
            android = {
                style: { type: AndroidStyle.BIGPICTURE, picture: image}
            }
        }


        await notifee.displayNotification({
            id,
            title,

            // By default notifee supports basic HTML tags and removes unsupported ones, but we need to replace the escaped characters
            body: desc,
            data: {
                notificationId: id,
                payload
            },
            android: {
                ...android,
                channelId: isCritical ? criticalChannelId : defaultChannelId,
                smallIcon: 'notification_icon',
                //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
                sound:'default'
            },
            ios: isCritical ? {
                critical: true,
                //sound: 'critical.wav',
                // iOS > 12
                // play at 90% sound volume
                criticalVolume: 0.9,
                sound: 'default'
            } : {sound: 'default'}
        });
    }
}
