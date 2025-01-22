export const onSettingUpdate = (name, content) => {
    return {
        type: 'SETTING_UPDATE',
        payload: {content : {[name]: content}}
    }
};
export const onSettingOverride = (name, content) => {
    return {
        type: 'SETTING_OVERRIDE',
        name: name,
        payload: content
    }
};
export const onSettingPtsStationOverride = (name, content) => {
    return {
        type: 'SETTING_PTS_STATION_OVERRIDE',
        name: name,
        payload: content
    }
};
export const onSettingGeneralOverride = (name, content) => {
    return {
        type: 'SETTING_GENERAL_OVERRIDE',
        name: name,
        payload: content
    }
};
export const onSettingCanteenOverride = (name, content) => {
    return {
        type: 'SETTING_CANTEENS_OVERRIDE',
        name: name,
        payload: content
    }
};
export const onSettingCanteenMerge = (name, content) => {
    return {
        type: 'SETTING_CANTEENS_MERGE',
        name: name,
        payload: content
    }
};
export const onSettingAccessibilityOverride = (name, content) => {
    return {
        type: 'SETTING_ACCESSIBILITY_OVERRIDE',
        name: name,
        payload: content
    }
};
export const onSettingNotificationsOverride = (name, content) => {
    return {
        type: 'SETTING_NOTIFICATIONS_OVERRIDE',
        name: name,
        payload: content
    }
};
export const onSettingDevelopOverride = (name, content) => {
    return {
        type: 'SETTING_DEVELOP_OVERRIDE',
        name: name,
        payload: content
    }
};
export const onSettingAPI = (name, content) => {
    return {
        type: 'SETTING_API',
        name: name,
        payload: content
    }
};
export const onSettingClear = () => {
    return {
        type: 'SETTING_CLEAR',
        payload: {}
    }
};
