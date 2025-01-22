export const onNotificationsSubscriberUpdate = (subscriberId) => {
    return {
        type: 'NOTIFICATIONS_SUBSCRIBER_UPDATE',
        subscriberId
    }
};
