
//------------------------------------
// canteen : Canteens of university
// -----------------------------------

import { ApiSettings, GETOptions, GETOptionsByLanguage } from '../constants/api';
import {action, commitAction, rollbackAction} from "./../constants/actions";
import { store } from '../redux/store';

export const canteensApi = {

    /**
     * Get all canteens with their menus
     */
    getAll: (res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.canteen.getAll);
        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                if(resJson.canteens) {
                    res(resJson.canteens);
                }
            })
            .catch((error) => {
                console.warn('Error Code: 1003 : ' + error);
                res(null);
            })
    },


    /**
     * Get all canteens with their menus of date {date} with format 'yyyy-MM-dd'
     *
     * @param date
     * @param res
     */
    getByDate: (date, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.canteen.getByDate);
        url = url.replace('{date}', date);

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1004 : ' + error);
                res(null);
            })
    }
};


// REDUX - OFFLINE

const defaultType = action.canteen.getAll;

export const updateTodayMeals = () => {

    const language = store.getState().settingReducer.settingsGeneral.language;
    const headers = GETOptionsByLanguage(language).headers;
    return {
        type: defaultType,
        meta: {
            offline: {
                effect: { url: ApiSettings.getApiUrl(ApiSettings.canteen.getAll), method: 'GET', headers},
                commit: { type: defaultType + commitAction },
                rollback: { type: defaultType + rollbackAction }
            }
        }
    };
};

export const updateAllMeals = () => {
    const language = store.getState().settingReducer.settingsGeneral.language;
    const headers = GETOptionsByLanguage(language).headers;

    return {
        type: action.canteen.getAll,
        meta: {
            offline: {
                effect: { url: ApiSettings.getApiUrl(ApiSettings.canteen.getAll), method: 'GET', headers },
                commit: { type: action.canteen.getAll + commitAction },
                rollback: { type: action.canteen.getAll + rollbackAction }
            }
        }
    };
};
