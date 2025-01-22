
//------------------------------------
// feedback : Feedback for Courses
// -----------------------------------

import {ApiSettings, GETOptions, POSTOptions} from './../constants/api';


export const feedbackApi = {
    /**
     * Get feedback
     */
    getFeedback: (courseId, date, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.feedback.getFeedback);
        url = url.replace('{courseid}', courseId);
        url = url.replace('{date}', date);

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1010 : ' + error);
                res(null);
            })
    },

    /**
     * Get speed
     */
    getSpeed: (courseId, date, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.feedback.getSpeed);
        url = url.replace('{courseid}', courseId);
        url = url.replace('{date}', date);

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1011 : ' + error);
                res(null);
            })
    },

    /**
     * Get question
     */
    getQuestion: (courseId, date, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.feedback.getQuestion);
        url = url.replace('{courseid}', courseId);
        url = url.replace('{date}', date);

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1012 : ' + error);
                res(null);
            })
    },

    /**
     * Post feedback
     */
    postFeedback: (courseId, date, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.feedback.postFeedback);
        url = url.replace('{courseid}', courseId);
        url = url.replace('{date}', date);

        fetch(url, POSTOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1013 : ' + error);
                res(null);
            })
    },

    /**
     * Post speed
     */
    postSpeed: (courseId, date, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.feedback.postSpeed);
        url = url.replace('{courseid}', courseId);
        url = url.replace('{date}', date);

        fetch(url, POSTOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1014 : ' + error);
            })
    },

    /**
     * Post question
     */
    postQuestion: (courseId, date, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.feedback.postQuestion);
        url = url.replace('{courseid}', courseId);
        url = url.replace('{date}', date);

        fetch(url, POSTOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1015 : ' + error);
                res(null);
            })
    },

};
