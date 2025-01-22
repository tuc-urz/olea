
//------------------------------------
// tucroomsApi : Rooms and stuff
// -----------------------------------

import {ApiSettings, GETOptions} from './../constants/api';


export const tucroomsApi = {
    /**
     * Search for rooms
     */
    getSearchForRooms: (search, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.rooms.getSearchForRooms);
        url = url.replace('{search}', decodeURI(search).trim());

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                if(resJson && resJson.results) {
                    res(resJson.results);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                console.warn('Error Code: 1020 : ' + error);
                res(null);
            })
    }
}
