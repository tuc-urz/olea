import uuid from 'react-native-uuid';
import messaging from '@react-native-firebase/messaging';
import debounce from 'lodash/debounce';

import { store } from '@olea-bps/core';
import { POSTOptions } from '@olea-bps/core/constants/api';
import { onNotificationsSubscriberUpdate } from '@olea-bps/core/redux/actions/notifications';


export default class SubscriberService {
    notificationServerUrl = '';
    universityCode = '';
    subscriberId = null

    constructor(configuration) {
        if(!configuration.notificationServerUrl) {
            throw Error('Missing Notification Server Url');
        }
        if(!configuration.universityCode) {
            throw Error('Missing University Code');
        }

        this.notificationServerUrl = configuration.notificationServerUrl;
        this.notificationStgServerUrl = configuration.notificationStgServerUrl;
        this.universityCode = configuration.universityCode;
        this.upsertSubscriber = debounce(this.upsertSubscriber, 2000);
    }


    /**
     * Register a new Subscriber or update the existing one
     */
    async initializeSubscriber() {
        this.subscriberId = this.getSubscriberId();
        if(!messaging().isDeviceRegisteredForRemoteMessages) {
            await messaging().registerDeviceForRemoteMessages();
        }
        const token = await this.getFCMToken();

        await this.upsertSubscriber(token);
    }


    /**
     * Return the subscriber id stored in the redux store or create a new ID.
     *
     * @returns string subscriberId
     * @private
     */
    getSubscriberId() {
        let subscriberId = store.getState().notificationsReducer.subscriberId;

        if(subscriberId) {
            return subscriberId;
        }

        subscriberId = uuid.v4();
        store.dispatch(onNotificationsSubscriberUpdate(subscriberId));
        return subscriberId;
    }


    /**
     * Get Device Token for Firebase Cloud Messaging
     *
     * @returns {Promise<void>}
     */
    async getFCMToken() {
        return await messaging().getToken();
    }


    /**
     * Register / Update a subscriber (=user) with the current device token
     *
     * @returns {Promise<void>}
     */
    async upsertSubscriber(token, skipRefresh = false) {
        const useStaging = store.getState().settingReducer.settingsDevelop.useStaging;
        const url = useStaging ?  this.notificationStgServerUrl : this.notificationServerUrl

        fetch(
            `${url}/subscriber?subscriberId=${this.subscriberId}&universityCode=${this.universityCode}&token=${token}&useDev=${useStaging}`,
            {...POSTOptions})
            .then((response) => response.json())
            .then(() => {
               // subscriber updated
            })
            .catch((error) => {
                console.warn('Error Code: 1100 : ', error);
            });

        // Listen for Token updates
        if(!skipRefresh) {
            messaging().onTokenRefresh(newToken => {
                this.upsertSubscriber(newToken, true);
            });
        }
    }


    /**
     * Mark a single notification as send
     *
     * @param notificationId
     */
    markNotificationAsSeen(notificationId) {
        const useStaging = store.getState().settingReducer.settingsDevelop.useStaging;
        const url = useStaging ?  this.notificationStgServerUrl : this.notificationServerUrl

        fetch(
            `${url}/markAsSeen?subscriberId=${this.subscriberId}&universityCode=${this.universityCode}&notificationId=${notificationId}&useDev=${useStaging}`,
            {...POSTOptions})
            .then((response) => response.json())
            .then(() => {
                // Notification marked as seen
            })
            .catch((error) => {
                console.warn('Error Code: 1101 : ', error);
            });
    }

}
