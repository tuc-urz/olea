
//------------------------------------
// survey : Webservice for Surveys
// -----------------------------------

import {ApiSettings, GETOptions, POSTOptions} from '../constants/api';


export const surveyApi = {


    /**
     * Get surveys by code
     */
    getSurveys: (code, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.survey.getSurveys);
        url = url.replace('{code}', code);

        fetch(urlGETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1029 : ' + error);
                res(null);
            })
    },

    /**
     * Get single survey by surveycode and deivce id
     */
    getSurveyByCode: (surveyCode, deviceId, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.survey.getSurveyByCode);
        url = url.replace('{surveycode}', surveyCode);
        url = url.replace('{deviceid}', deviceId);

        fetch(urlGETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1030 : ' + error);
                res(null);
            })
    },

    /**
     * Get surveys by code and deivce id
     */
    getSurveysByCode: (code, deviceId, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.survey.getSurveysByCode);
        url = url.replace('{code}', code);
        url = url.replace('{deviceid}', deviceId);

        fetch(urlGETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1031 : ' + error);
                res(null);
            })
    },

    /**
     * Create a survey
     */
    postCreateSurvey: (courseId, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.survey.postCreateSurvey);
        url = url.replace('{courseid}', courseId);

        fetch(urlPOSTOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1032 : ' + error);
                res(null);
            })
    },

    /**
     * Attend a survey
     */
    postAttendSurvey: (code, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.survey.postAttendSurvey);
        url = url.replace('{code}', code);

        fetch(urlPOSTOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1033 : ' + error);
                res(null);
            })
    },

    /**
     * Close a survey
     */
    postCloseSurvey: (code, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.survey.postCloseSurvey);
        url = url.replace('{code}', code);

        fetch(urlPOSTOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1034 : ' + error);
                res(null);
            })
    }
};
