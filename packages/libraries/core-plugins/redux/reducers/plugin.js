const initialState = {
    appBar: {
        component: null,
        styles: null
    },
    dashboard: {
        component: null,
        styles: null
    },
    mainMenu: {
        component: null,
        styles: null
    },
    feedList: {
        component: null,
        styles: null
    },
    feedNews: {
        component: null,
        styles: null
    },
    topNews: {
        component: null,
        styles: null
    },
    newsDetail: {
        component: null,
        styles: null
    },
    mensaSlider: {
        component: null,
        styles: null
    },
    canteens: {
        component: null,
        styles: null
    },
    mealItem: {
        component: null,
        styles: null
    },
    bookDetail: {
        component: null,
        styles: null
    },
    contactDetail: {
        component: null,
        styles: null
    },
    courseInfo: {
        component: null,
        styles: null
    },
    ptsDeparture: {
        component: null,
        styles: null
    },
    ptsStation: {
        component: null,
        styles: null
    },
    search: {
        component: null,
        styles: null
    },
    searchResults: {
        component: null,
        styles: null
    },
    opal: {
        component: null,
        styles: null
    },
    poi: {
        component: null,
        styles: null
    },
    pts: {
        component: null,
        styles: null
    },
    roomDirectory: {
        component: null,
        styles: null
    },
    timetable: {
        component: null,
        styles: null
    },
    modal: {
        component: null,
        styles: null
    },
    webViews: {
        component: null,
        styles: null
    },
    settingsGeneral: {
        component: null,
        styles: null
    },
    settingsCanteens: {
        component: null,
        styles: null
    },
    settingsAccessibility: {
        component: null,
        styles: null
    },
    settingsNotifications: {
        component: null,
        styles: null
    },
    settingsWeather: {
        component: null,
        styles: null
    },
    jobPortal: {
      component: null,
      styles: null
    },
    jobFilter: {
      component: null,
      styles: null
    }
};

export default (state = initialState, action) => {
    let key = '';
    const type       = action.type.replace('_COMPONENT', '').replace('_STYLES', '');
    const replaceKey = action.type.indexOf('_COMPONENT') > 0 ? 'component' : action.type.indexOf('_STYLES') > 0 ? 'styles' : '';

    switch(type) {
        case 'RESET_STATE':
            return initialState;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_DASHBOARD':           key = 'dashboard';      break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_MAIN_MENU':           key = 'mainMenu';       break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_FEED_LIST':           key = 'feedList';       break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_FEED_NEWS':           key = 'feedNews';       break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_APP_BAR':             key = 'appBar';         break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_TOP_NEWS':            key = 'topNews';        break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_NEWS_DETAIL':         key = 'newsDetail';     break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_MENSA_SLIDER':        key = 'mensaSlider';    break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_CANTEENS':            key = 'canteens';       break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_MEAL_ITEM':           key = 'mealItem';       break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_BOOK_DETAIL':         key = 'bookDetail';     break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_CONTACT_DETAIL':      key = 'contactDetail';  break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_COURSE_INFO':         key = 'courseInfo';     break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_PTS':                 key = 'pts';            break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_PTS_DEPARTURE':       key = 'ptsDeparture';   break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_PTS_STATION':         key = 'ptsStation';     break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_SEARCH':              key = 'search';         break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_SEARCH_RESULTS':      key = 'searchResults';  break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_OPAL':                key = 'opal';           break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_POI':                 key = 'poi';            break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_ROOM_DIRECTORY':      key = 'roomDirectory';  break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_TIMETABLE':           key = 'timetable';      break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_MODAL':               key = 'modal';          break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        case 'REPLACE_WEB_VIEWS':           key = 'webViews';       break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
         case 'REPLACE_SETTINGS_GENERAL':   key = 'settingsGeneral';       break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
         case 'REPLACE_SETTINGS_CANTEENS':  key = 'settingsCanteens';       break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
         case 'REPLACE_SETTINGS_ACCESSIBILITY':  key = 'settingsAccessibility'; break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
         case 'REPLACE_SETTINGS_NOTIFICATIONS':  key = 'settingsNotifications'; break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
         case 'REPLACE_JOB_PORTAL':         key = 'jobPortal';      break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
         case 'REPLACE_JOB_FILTER':         key = 'jobFilter';      break;
        // ---------------------------------------------------------------------------------------------------------------------------------------
        default:
            return state;
    }

    if(key !== '' && replaceKey !== '') {
        return {
            ...state,
            [key]: {
                [replaceKey]: action[replaceKey]
            }
        };
    }
    return state;
};
