import * as Localization from 'expo-localization';

const lang = Localization.locale.slice(0,2).toLowerCase();
const supportedLanguages = ['de', 'en'];


const initialSetting = {
    favorites: [],
    favoritesPtsStation: [],
    settingsGeneral: {language: supportedLanguages.includes(lang) ? lang : 'en'},
    settingsWeather: {location: 'uni'},
    settingsCanteens: {favoritePrice: ''},
    settingsAccessibility: {
        highContrast: false,
        increaseFontSize: false
    },
    settingsNotifications: {
        enablePushNotifications: false,
        enableAllNotifications: false, // Allow all types of notifications, ignores the allowedTypes setting
        enabledFeedNotifications: [] // Allow only these selected types
    },
    settingsDevelop: {
        useStaging: false,
        showDeeplinkAlert: false,
        activeStagingMenuItems: [],
    },
    api: {
        university: 'tuc',
        rootUrl: 'https://urz-asist.hrz.tu-chemnitz.de/asist-cc/rest'
        // rootUrl: 'https://asist.hrz.tu-chemnitz.de/asist/rest'
    }
};
import merge from 'lodash/merge';

export default (setting = initialSetting, action) => {
    if (action.payload) {
        switch (action.type) {
            case 'SETTING_UPDATE':
                return merge({}, setting, action.payload);
            case 'SETTING_OVERRIDE':
                return {
                    ...setting,
                    favorites: action.payload
                };
            case 'SETTING_PTS_STATION_OVERRIDE':
                return {
                    ...setting,
                    favoritesPtsStation: action.payload
                };
            case 'SETTING_GENERAL_OVERRIDE':
                return {
                    ...setting,
                    settingsGeneral: action.payload
                };
            case 'SETTING_CANTEENS_OVERRIDE':
                return {
                    ...setting,
                    settingsCanteens: action.payload
                };
            case 'SETTING_CANTEENS_MERGE':
                const currentSettingsCanteens = setting?.settingsCanteens ?? {};
                return {
                    ...setting,
                    settingsCanteens: {
                        ...currentSettingsCanteens,
                        ...action.payload
                    }
                };
            case 'SETTING_ACCESSIBILITY_OVERRIDE':
                return {
                    ...setting,
                    settingsAccessibility: action.payload
                };
            case 'SETTING_NOTIFICATIONS_OVERRIDE':
                return {
                    ...setting,
                    settingsNotifications: action.payload
                };
            case 'SETTING_DEVELOP_OVERRIDE':
                return {
                    ...setting,
                    settingsDevelop: action.payload
                };
            case 'SETTING_API':
                return {
                    ...setting,
                    api: action.payload
                };
            case 'SETTING_CLEAR':
                return initialSetting;
        }
    }
    return setting;
}


