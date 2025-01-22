export const commitAction = '_COMMIT';
export const rollbackAction = '_ROLLBACK';

export const action = {
    canteen: {
        getAll:     'UPDATE_CANTEENS',
        getByDate:  'UPDATE_CANTEENS_BY_DATE',
    },
    pts: {
        getNearbyStations: 'UPDATE_PTS_NEARBY_STATIONS',
        getFavoritesStations: 'UPDATE_PTS_FAVORITES_STATIONS',
        getStations: 'UPDATE_PTS_STATIONS'
    },
    coursesV2: {
        getCourses: 'UPDATE_COURSES'
    },
    feedback: {
        getFeedback: 'UPDATE_FEEDBACK_GET',
        getSpeed: 'UPDATE_FEEDBACK_SPEED',
        getQuestion: 'UPDATE_FEEDBACK_QUESTION',
        postFeedback: 'POST_FEEDBACK',
        postSpeed: 'POST_FEEDBACK_SPEED',
        postQuestion: 'POST_FEEDBACK_QUESTION'
    },
    feedV3: {
        getFeedById: 'UPDATE_FEED_BY_ID',
        getFeeds: 'UPDATE_FEEDS',
        getTopNews: 'UPDATE_TOP_NEWS',
    },
    lostfound: {
        getLostItems: '',
        getFoundItems: '',
        postReportItemAsFound: '',
        postReportItemAsLost: ''
    },
    officeHours: {
        getOfficeHours: ''
    },
    occupancy: {
        getOccupancies: '',
        getOccupanciesOfPoi: ''
    },
    telephone: {
        getSearchForName: ''
    },
    library: {
        getSearchForBooks: '',
        getSearchExtended: '',
        getSearchDetailsByBookId: ''
    },
    poi: {
        getPointsOfInterest: ''
    },
    survey: {
        postCreateSurvey: '',
        postAttendSurvey: '',
        postCloseSurvey: '',
        getSurveys: '',
        getSurveyByCode: '',
        getSurveysByCode: ''

    },
    device: {
        postRegisterDevice: 'REGISTER_DEVICE',
        postLMS: '',
        postSettings: ''
    },
    job: {
      getJobs: '',
      getJobCategories: ''
    },
    corona: {
        getCoronaMenu: 'UPDATE_CORONA_MENU'
    }
};
