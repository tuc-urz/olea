
//------------------------------------
// course : Courses of university
// -----------------------------------

import {ApiSettings, GETOptions} from './../constants/api';
import {action, commitAction, rollbackAction} from "./../constants/actions";

const defaultType = action.coursesV2.getCourses;

export const coursesApi = {

    /**
     * Get courses by short code and device id
     */
    getCourses: (timetableCode, res) => {
        let url = ApiSettings.getApiUrl(ApiSettings.coursesV2.getCourses);
        url = url.replace('{timetableCode}', timetableCode);

        fetch(url, GETOptions)
            .then((response) => response.json())
            .then((resJson) => {
                res(resJson);
            })
            .catch((error) => {
                console.warn('Error Code: 1006 : ' + error);
                res(null);
            })
    }
};


// REDUX - OFFLINE

export const updateCourses = (timetableCode, hideErrors) => {
    const headers = GETOptions.headers;
    let url = ApiSettings.getApiUrl(ApiSettings.coursesV2.getCourses);
    url = url.replace('{timetableCode}', timetableCode);

    return {
        type: defaultType,
        meta: {
            offline: {
                effect: {
                    url,
                    method: 'GET',
                    headers
                },
                commit: { type: defaultType + commitAction },
                rollback: { type: defaultType + rollbackAction, hideErrors }
            }
        }
    }
};
