
//------------------------------------
// tucroomsApi : Rooms and stuff
// -----------------------------------

import {ApiSettings, GETOptions} from './../constants/api';


export const roomsApi = {
    /**
     * Search for rooms
     */
    getSearchForRooms: (search, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.rooms.getSearchForRooms);
        url = url.replace('{search}', decodeURI(search).trim().replace(' ','%2B'));

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                if(resJson && resJson.length > 0) {
                    res(resJson);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                console.warn('Error Code: 1020 : ' + error, url, GETOptions);
                res(null);
            })
    }
}
