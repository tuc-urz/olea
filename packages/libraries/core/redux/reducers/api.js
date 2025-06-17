import { action, commitAction, rollbackAction } from '../../constants/actions';
import { onUpdateRefreshing } from '../../redux/actions/state';
import { CourseStatusEnum } from '../../constants/enums';
import { toIsoDateString } from '../../helper/date';

const selectFeeds = state => state.apiReducer.feeds;

const selectFeedById = (state, feedId) => state.apiReducer.feeds.find(feed => feed.feedid === feedId);

const initialState = {
    feeds: [],
    feedItems: [],
    topNews: [],
    weather: null,
    canteens: [],
    courses: [],
    coursesStatus: CourseStatusEnum.notImportedYet,
    jobs: [],
    menuEntries: []
};

const apiReducer = (state = initialState, reducerAction) => {
    switch(reducerAction.type) {
        case action.feedV3.getFeeds + commitAction:
            setTimeout(() => {
                reducerAction.asyncDispatch(onUpdateRefreshing(false));
            }, 2000);
            return {
                ...state,
                feeds:  Array.isArray(reducerAction.payload.feeds) ? reducerAction.payload.feeds : []
            };
        case action.feedV3.getTopNews + commitAction:
            setTimeout(() => {
                reducerAction.asyncDispatch(onUpdateRefreshing(false));
            }, 2000);
            return {
                ...state,
                topNews: Array.isArray(reducerAction.payload.items) ? reducerAction.payload.items : []
            };

        case action.corona.getCoronaMenu + commitAction:
            setTimeout(() => {
                reducerAction.asyncDispatch(onUpdateRefreshing(false));
            }, 2000);
            return {
                ...state,
                menuEntries: Array.isArray(reducerAction.payload) ? reducerAction.payload : [],
            };

        case action.canteen.getAll + commitAction:
            setTimeout(() => {
                reducerAction.asyncDispatch(onUpdateRefreshing(false));
            }, 2000);

            // Transform API payload in cache format
            let newCanteens = reducerAction?.payload?.canteens
                // Create list of canteens
                ?.map(apiCanteen => ({
                    id: apiCanteen.id,
                    title: apiCanteen.title,
                    type: apiCanteen.type,
                    // Create json-object with key as date string and value as meal list
                    meals: apiCanteen?.menuItems?.reduce((mealMapObject, meal) => {
                        let meals = mealMapObject[meal.date] ?? []; // Get already grouped meals of current meal date. Is date unkown, create empty array
                        meals.push(meal);
                        mealMapObject[meal.date] = meals;
                        return mealMapObject;
                    }, {}) ?? {},
                }))
                // Create object with key of canteen id and value of canteen
                ?.reduce((canteensMapObject, apiCanteen) => {
                    canteensMapObject[apiCanteen.id] = apiCanteen;
                    return canteensMapObject;
                }, {});

            // merge cached/old canteen information into new canteens
            currentDateTime = new Date();
            lowerCacheAllowDate = new Date(
                currentDateTime.getFullYear(),
                currentDateTime.getMonth()+1,
                currentDateTime.getDate() - 14, // Create datetime 2 weeks in passt
                currentDateTime.getHours(),
                currentDateTime.getMinutes(),
                currentDateTime.getSeconds(),
                currentDateTime.getMilliseconds()
            )
            lowerCacheAllowDate = toIsoDateString(lowerCacheAllowDate);
            cachedCanteens = state.canteens;
            // Is canteen cache in old array format?
            if (!Array.isArray(cachedCanteens)) {
                for (const [cachedCanteenId, cachedCanteen] of Object.entries(cachedCanteens)) {
                    // If cached canteen id is not in new canteens, do not merge. Cause this canteen do not exist anymore.
                    newCanteen = newCanteens?.[cachedCanteenId];
                    if (newCanteen) {
                        for (const [cachedCanteenMealsDate, cachedCanteenMeals] of Object.entries(cachedCanteen.meals).filter(([cachedCanteenMealsDate]) => cachedCanteenMealsDate >= lowerCacheAllowDate)) {
                            // if date is not in new canteen meals, add the cached one to new canteen
                            if (!newCanteen.meals.hasOwnProperty(cachedCanteenMealsDate)) {
                                newCanteen.meals[cachedCanteenMealsDate] = cachedCanteenMeals;
                            }
                        }
                    }
                }
            }

            return {
                ...state,
                canteens: newCanteens,
            };

        case action.device.postRegisterDevice + commitAction:
            return state;

        case 'RESET_COURSES':
            return {
                ...state,
                courses: [],
                coursesStatus: CourseStatusEnum.notImportedYet
            };
        case action.coursesV2.getCourses + commitAction:
            setTimeout(() => {
                reducerAction.asyncDispatch(onUpdateRefreshing(false));
            }, 2000);
            if(reducerAction.payload) {
                return {
                    ...state,
                    courses: Array.isArray(reducerAction.payload) ? reducerAction.payload : [],
                    coursesStatus: CourseStatusEnum.importSuccessful
                };
            } else {
                return {
                    ...state,
                    courses: [],
                    coursesStatus: CourseStatusEnum.importSuccessful
                };
            }

        case action.job.getJobCategories + commitAction:
          return state;


        case action.coursesV2.getCourses + rollbackAction:
            if(!reducerAction.hideErrors) {
                if(reducerAction.payload.response && reducerAction.payload.response.message) {
                    alert(reducerAction.payload.response.message);
                } else {
                    alert('Zu diesem Code wurde kein gültiger Stundenplan gefunden!');
                }
                return {
                    ...state,
                    courses: [],
                    coursesStatus: CourseStatusEnum.error
                };
            }
            setTimeout(() => {
                reducerAction.asyncDispatch(onUpdateRefreshing(false));
            }, 2000);
            return state;

        case action.feedV3.getFeeds + rollbackAction:
        case action.feedV3.getTopNews + rollbackAction:
        case action.corona.getCoronaMenu + rollbackAction:
            setTimeout(() => {
                reducerAction.asyncDispatch(onUpdateRefreshing(false));
            }, 2000);
            return state;

        case action.canteen.getAll + rollbackAction:
            setTimeout(() => {
                reducerAction.asyncDispatch(onUpdateRefreshing(false));
            }, 2000);
            return state;

        case action.job.getJobCategories + rollbackAction:

        default:
            return state;
    }
};

const getSortOrderPrices = (title) => {
    switch (title) {
        case 'S': return 0;
        case 'E': return 1;
        case 'G': return 2;
    }
};

export {selectFeeds, selectFeedById, apiReducer as reducer};

export default apiReducer;
