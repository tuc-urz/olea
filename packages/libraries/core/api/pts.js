
//------------------------------------
// pts : public transportation system
// -----------------------------------

import {ApiSettings, GETOptions} from './../constants/api';


export const ptsApi = {

    /**
     * Get stations
     */
    getStations: (res) => {
        fetch(ApiSettings.getApiUrl(ApiSettings.pts.getStations), GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1027 : ' + error);
                res(null);
            })
    },

    /**
     * Get nearby stations
     */
    getNearbyStations: (latitude, longitude, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.pts.getNearbyStations);
        url = url.replace('{latitude}', latitude);
        url = url.replace('{longitude}', longitude);

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1028 : ' + error);
                res(null);
            })
    },

    /**
     * Get favorite stations
     */
    getFavoritesStations: (stations, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.pts.getFavoritesStations);
        let stationText = '';
        stations.forEach(station => {
            stationText += 'station=CAG-' + station + '&';
        });
        stationText = stationText.substring(0, stationText.length - 1);

        url = url.replace('{stations}', stationText);

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1036 : ' + error);
                res(null);
            })
    }
};
