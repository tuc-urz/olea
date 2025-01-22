import { store } from '../redux/store';

export const GETOptions = {
    method: 'GET',
    headers: {
        "Accept" : "application/json;charset=utf-8",
        "Accept-Encoding" : "gzip, deflate, br",
        "Accept-Language" : "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control" : "no-cache",
        'Pragma': 'no-cache',
        'Expires': 0,
    }
};
export const GETOptionsByLanguage = (languageCode = null) => {
    let acceptLanguage = "de-DE, de;q=0.9, en-US;q=0.8, en;q=0.7";
    if (languageCode) {
        if(languageCode === 'en'){
            acceptLanguage = "en-US, en;q=0.9, de-DE;q=0.8, de;q=0.7";
        } else if(languageCode !== 'de') {
            acceptLanguage = languageCode;
        }
    }
    return {
        method: 'GET',
        headers: {
            "Accept": "application/json;charset=utf-8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": acceptLanguage,
            "Cache-Control": "no-cache",
            'Pragma': 'no-cache',
            'Expires': 0,
        }
    }
};
export const POSTOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
    },
    cache: 'no-cache',
};

export const ApiSettings = {
    canteen: {
        getAll:   '/app/v3/{university}/canteens/all',
        getByAll: '/app/v3/{university}/canteens/{date}',
    },
    pts: {
        getNearbyStations: '/app/pts/{university}/nearby?longitude={longitude}&latitude={latitude}&departure.limit=4',
        getFavoritesStations: '/app/pts/{university}/stations?{stations}&departure.limit=4',
        getStations: '/app/pts/{university}'
    },
    coursesV2: {
        getCourses: '/app/{university}/timetable/shortcode/{timetableCode}'
    },
    feedback: {
        getFeedback: '/app/feedback/result/stop/{courseid}/{date}',
        getSpeed: '/app/feedback/result/speed/{courseid}/{date}',
        getQuestion: '/app/feedback/result/question/{courseid}/{date}',
        postFeedback: '/app/feedback/stop/{courseid}/{deviceid}',
        postSpeed: '/app/feedback/speed/{courseid}/{deviceid}/{speed}',
        postQuestion: '/app/feedback/question/{courseid}/{deviceid}'
    },
    feedV3: {
        getFeedById: '/app/v3/feed/{university}/items/{feed-id}',
        getFeeds: '/app/v3/feed/{university}/list',
        getTopNews: '/app/v3/feed/{university}/items/0',
        getNewsById: '/app/v3/feed/{university}/feed-items/{feed-id}',
        getSearchForNews: '/app/v3/feed/{university}/search/{search}',
    },
    lostfound: {
        getLostItems: '/app/lostfound/{university}/lost',
        getFoundItems: '/app/lostfound/{university}/found',
        postReportItemAsFound: '/app/lostfound/{university}/foundObject/{deviceid}',
        postReportItemAsLost: '/app/lostfound/{university}/lostObject/{deviceid}'
    },
    officeHours: {
        getOfficeHours: '/app/officehours/{university}/all'
    },
    occupancy: {
        getOccupancies: '/app/occupancy/{university}/all',
        getOccupanciesOfPoi: '/app/occupancy/{university}/occupancy/{poiid}'
    },
    telephone: {
        getSearchForName: '/app/telephone/{university}/search/{name}'
    },
    library: {
        getSearchForBooks: '/app/library/{university}/find/{search}',
        getSearchExtended: '/app/library/{university}/findExtended',
        getSearchDetailsByBookId: '/app/library/{university}/details/{bookId}'
    },
    tucrooms: {
        getSearchForRooms: '/tucrooms/api/v1/room/?search={search}',
    },
    rooms: {
        getSearchForRooms: '/app/{university}/rooms?search={search}',
    },
    poi: {
        getPointsOfInterest: '/app/poi/{university}/all'
    },
    survey: {
        postCreateSurvey: '/app/survey/{university}/create/{courseid}',
        postAttendSurvey: '/app/survey/{university}/attend/{code}',
        postCloseSurvey: '/app/survey/{university}/close/{code}',
        getSurveys: '/app/survey/{university}/results/{code}',
        getSurveyByCode: '/app/survey/{university}/surveys/single/{surveycode}/{deviceid}',
        getSurveysByCode: '/app/survey/{university}/surveys/{code}/{deviceid}'

    },
    device: {
        postRegisterDevice: '/app/device/{university}/register/{type}',
        postLMS: '/app/device/{university}/lms/{pushuid}',
        postSettings: '/app/device/{university}/settings/{module}/{value}'
    },
    job:{
      getJobs:'/app/{university}/jobs',
      getJobCategories: '/app/{university}/jobs/categories'
    },
    corona: {
        getCoronaMenu: 'app/{university}/app-menu-entries'
    },

    /**
     * Returns the given route with correct university and root url prefix
     *
     * @param route
     * @returns {string}
     */
    getApiUrl: (route) => {
        const {rootUrl, rootStgUrl ,university} = store.getState().settingReducer.api;
        const useStaging = store.getState().settingReducer.settingsDevelop.useStaging;

        // Use Staging Url if development setting is active
        if(useStaging && rootStgUrl && university) {
            route = route.replace('{university}', university);
            return rootStgUrl + route;
        }

        if(rootUrl && university) {
            route = route.replace('{university}', university);
            return rootUrl + route;
        }
        return '';
    },
};
