
//------------------------------------
// poi : Points of Interest for given university
// -----------------------------------

import {ApiSettings, GETOptions} from '../constants/api';


export const poiApi = {

    /**
     * Get current weather
     */
    getPointsOfInterest: (res) => {
        fetch(ApiSettings.getApiUrl(ApiSettings.poi.getPointsOfInterest), GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1026 : ' + error);
                res(null);
            })
    }
};
