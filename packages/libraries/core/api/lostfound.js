
//------------------------------------
// lostfound : Lost and found for university
// -----------------------------------

import {ApiSettings, POSTOptions, GETOptions} from './../constants/api';


export const lostfoundApi = {


    /**
     * Get lost items
     */
    getLostItems: (res) => {
        fetch(ApiSettings.getApiUrl(ApiSettings.lostfound.getLostItems), GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1019 : ' + error);
                res(null);
            })
    },

    /**
     * Get found items
     */
    getFoundItems: (res) => {
        fetch(ApiSettings.getApiUrl(ApiSettings.lostfound.getFoundItems), GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1020 : ' + error);
                res(null);
            })
    },

    /**
     * Report a item as found
     */
    postReportItemAsFound: (deviceId, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.lostfound.postReportItemAsFound);
        url = url.replace('{deviceId}', deviceId);

        fetch(url, POSTOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1021 : ' + error);
                res(null);
            })
    },

    /**
     * Report a item as found
     */
    postReportItemAsLost: (deviceId, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.lostfound.postReportItemAsLost);
        url = url.replace('{deviceId}', deviceId);

        fetch(url, POSTOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1022 : ' + error);
                res(null);
            })
    }
}
