
//------------------------------------
// device : Registration service for devices
// -----------------------------------

import {ApiSettings, POSTOptions} from '../constants/api';
import {action, commitAction, rollbackAction} from "./../constants/actions";
import {Platform} from 'react-native';

export const deviceApi = {


    /**
     * Resgister a new device
     */
    postRegisterDevice: (type, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.device.postRegisterDevice);
        url = url.replace('{type}', type);

        fetch(url, POSTOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1007 : ' + error);
                res(null);
            })
    },

    /**
     * Post lms
     */
    postLMS: (pushUid, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.device.postLMS);
        url = url.replace('{pushuid}', pushUid);

        fetch(url, POSTOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1008 : ' + error);
                res(null);
            })
    },

    /**
     * Post device settings
     */
    postSettings: (module, value, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.device.postSettings);
        url = url.replace('{module}', module);
        url = url.replace('{value}', value);

        fetch(url, POSTOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1009 : ' + error);
                res(null);
            })
    }
};



// REDUX - OFFLINE

const defaultType = action.device.postRegisterDevice;
const generateToken = () => {
    let token = '';
  for (var i = 0; i <= 1; i++) {
        token += Math.random().toString(36).substr(2);
    }
    return token;
};


export const registerDevice = () => ({
    type: defaultType,
    meta: {
        offline: {
            effect: {
                url: ApiSettings.getApiUrl(ApiSettings.device.postRegisterDevice),
                method: 'POST',
                body: 'token='+ generateToken() + '&type=' + (Platform.OS === 'ios' ? 'IOS' : 'ANDROID'),
                headers: { 'content-type': 'application/x-www-form-urlencoded' }
            },
            commit: { type: defaultType + commitAction },
            rollback: { type: defaultType + rollbackAction }
        }
    }
});

