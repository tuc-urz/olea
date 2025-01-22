
//------------------------------------
// jobsApi : Jobs
// -----------------------------------

import {ApiSettings, GETOptions} from './../constants/api';


export const jobsApi = {
    /**
     * get all jobs
     */
    getAllJobs: (res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.job.getJobs);

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                if(resJson) {
                    res(resJson);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                console.warn('Error Code: 1037 : ' + error);
                res(null);
            })
    },

    getJobCategories: (res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.job.getJobCategories);

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                if(resJson) {
                    res(resJson);
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                console.warn('Error Code: 1038 : ' + error);
                res(null);
            })
    }
}
