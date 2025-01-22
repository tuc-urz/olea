
//------------------------------------
// library : Books and stuff
// -----------------------------------

import {ApiSettings, GETOptions} from './../constants/api';


export const libraryApi = {

    /**
     * Search for book
     */
    getSearchForBooks: (search, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.library.getSearchForBooks);
        url = url.replace('{search}', decodeURI(search).trim().replace(' ','%2B'));

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                if(resJson && resJson.books) {
                    res(resJson.books);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                console.warn('Error Code: 1016 : ' + error);
                res(null);
            })
    },

    /**
     * Get extended search
     */
    getSearchExtended : (res) => {
        fetch(ApiSettings.getApiUrl(ApiSettings.library.getSearchExtended), GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                if(resJson && resJson.books) {
                    res(resJson.books);
                }
            })
            .catch((error) => {
                console.warn('Error Code: 1017 : ' + error);
                res(null);
            })
    },

    /**
     * Get search details by book id
     */
    getSearchDetailsByBookId : (bookId, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.library.getSearchDetailsByBookId);
        url = url.replace('{bookId}', bookId);

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1018 : ' + error);
                res(null);
            })
    }
}
