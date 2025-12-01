
//------------------------------------
// telephone : Telephone and E-Mail
// -----------------------------------

import {ApiSettings, GETOptions} from '../constants/api';


export const telephoneApi = {

    /**
     * Search for contact by name
     */
    getSearchForName: (name, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.telephone.getSearchForName);
        url = url.replace('{name}', decodeURI(name).trim());

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                if(resJson && resJson.contacts) {
                    res(resJson.contacts);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                console.warn('Error Code: 1000 : ' + error);
                res(null);
            })
    }
};
