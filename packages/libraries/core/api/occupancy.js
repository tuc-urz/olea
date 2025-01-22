
//------------------------------------
// occupancy : Occupancy for specific POI
// -----------------------------------

import {ApiSettings, GETOptions} from '../constants/api';


export const occupanciesApi = {


    /**
     * Get occupancies
     */
    getOccupancies: (res) => {
        fetch(ApiSettings.getApiUrl(ApiSettings.occupancy.getOccupancies), GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1023 : ' + error);
                res(null);
            })
    },

    /**
     * Get occupancies of points of interesst
     */
    getOccupanciesOfPoi: (poiId, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.occupancy.getOccupanciesOfPoi);
        url = url.replace('{poiid}', poiId);

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1024 : ' + error);
                res(null);
            })
    }
};
