
//------------------------------------
// canteen : Canteens of university
// -----------------------------------

import {ApiSettings, GETOptions} from '../constants/api';
import {action, commitAction, rollbackAction} from "../constants/actions";

export const coronaApi = {

    /**
     * Get corona menu
     */
    getCoronaMenu: (res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.corona.getCoronaMenu)

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                if(resJson) {
                    res(resJson);
                }
            })
            .catch((error) => {
                console.warn('Error Code: 1005 : ' + error);
                res(null);
            })
    }
};


// REDUX - OFFLINE

const defaultType = action.corona.getCoronaMenu;

export const updateCoronaMenu = () => ({
    type: defaultType,
    meta: {
        offline: {
            effect: { url: ApiSettings.getApiUrl(ApiSettings.corona.getCoronaMenu), method: 'GET' },
            commit: { type: defaultType + commitAction },
            rollback: { type: defaultType + rollbackAction }
        }
    }
});
