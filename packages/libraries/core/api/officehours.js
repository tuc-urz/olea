
//------------------------------------
// officehours : Office Hourse for specific POI
// -----------------------------------

import {ApiSettings, GETOptions} from '../constants/api';


export const officeHoursApi = {

    /**
     * Get current weather
     */
    getOfficehours: (res) => {
        fetch(ApiSettings.getApiUrl(ApiSettings.officeHours.getOfficehours), GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1025 : ' + error);
                res(null);
            })
    }
};
