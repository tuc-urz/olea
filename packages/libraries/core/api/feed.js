
//------------------------------------
// feed : Feeds of university
// -----------------------------------

// IMPORTANT: THIS CONTAINS ONLY V2 OF FEEDS

import {ApiSettings, GETOptionsByLanguage} from './../constants/api';
import {action, commitAction, rollbackAction} from "../constants/actions";
import {store} from "../redux/store";

const defaultType = action.feedV3.getFeeds;
const defaultTypeTopNews = action.feedV3.getTopNews;


export const feedApi = {

    /**
     * Get list of feeds
     */
    getFeeds: (res) => {
        const language = store.getState().settingReducer.settingsGeneral.language;
        fetch(ApiSettings.getApiUrl(ApiSettings.feedV3.getFeeds) + '?rn='+ new Date().getTime(), GETOptionsByLanguage(language))
            .then((response) => response.json())
            .then((resJson) => {
                if(resJson.feeds) {
                    res(resJson.feeds);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                console.warn('Error Code: 1001 : ' + error);
                res(null);
            })
    },

    /**
     * Get feed by id
     */
    getFeedById: (id, res) => {
        const language = store.getState().settingReducer.settingsGeneral.language;
        let url = ApiSettings.getApiUrl(ApiSettings.feedV3.getFeedById);
        url = url.replace('{feed-id}', id);

        fetch(url, GETOptionsByLanguage(language))
            .then((response) => {
                return response.json();
            })
            .then((resJson) => {
                if(resJson.items) {
                    res(resJson.items);
                } else {
                    res(0);
                }
            })
            .catch((error) => {
                console.warn('Error Code: 1002 : ' + error);
                res(-1);
            })
    },

    /**
     * Search for news by given string
     */
    getSearchForNews: (search, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.feedV3.getSearchForNews);
        url = url.replace('{search}', decodeURI(search).trim());

        fetch(url, GETOptions)
            .then((response) => {
                return response.json();
            })
            .then((resJson) => {
                if(resJson.items) {
                    res(resJson.items);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                console.warn('Error Code: 1036 : ' + error);
                res(null);
            })
    },

    getNewsById(id, res) {
        // https://urz-asist.hrz.tu-chemnitz.de/asist/rest/app/v3/feed/tuc/feed-items/25896
        // https://urz-asist.hrz.tu-chemnitz.de/asist/rest/app/v3/feed/htwkl/feed-items/152
        const language = store.getState().settingReducer.settingsGeneral.language;
        let url = ApiSettings.getApiUrl(ApiSettings.feedV3.getNewsById);
        url = url.replace('{feed-id}', id);

        fetch(url, GETOptionsByLanguage(language))
            .then((response) => {
                return response.json();
            })
            .then((resJson) => {
                if(resJson) {
                    res(resJson);
                } else {
                    res(0);
                }
            })
            .catch((error) => {
                console.warn('Error Code: 1039 : ' + error);
                res(-1);
            })
    }
};

export const updateFeeds = () => {
    const language = store.getState().settingReducer.settingsGeneral.language;
    const headers = GETOptionsByLanguage(language).headers;
    return {
        type: defaultType,
        meta: {
            offline: {
                effect: { url: ApiSettings.getApiUrl(ApiSettings.feedV3.getFeeds), method: 'GET',  headers },
                commit: { type: defaultType + commitAction },
                rollback: { type: defaultType + rollbackAction }
            }
        }
    };
};


// REDUX - OFFLINE

export const updateTopNews = () => {
    const language = store.getState().settingReducer.settingsGeneral.language;
    const headers = GETOptionsByLanguage(language).headers;
    return {
        type: defaultTypeTopNews,
        meta: {
            offline: {
                effect: {url: ApiSettings.getApiUrl(ApiSettings.feedV3.getTopNews), method: 'GET', headers},
                commit: {type: defaultTypeTopNews + commitAction},
                rollback: {type: defaultTypeTopNews + rollbackAction}
            }
        }
    }
};

