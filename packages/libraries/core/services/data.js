/**
 * This service requests the data from the server to
 * fill the redux store with new informations to use it offline.
 *
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RESET_STATE } from '@olea/redux-offline/src/constants';

import {store} from './../redux/store';
import {updateFeeds, updateTopNews} from './../api/feed';
import {updateAllMeals} from './../api/canteens';
import {updateCourses} from './../api/courses';
import {updateCoronaMenu} from "../api/corona";


export class DataService {


    constructor(){
        // ToDo - Functions
        // - Interval Request for Updates
        // - Force Request for Updates

        // ToDo - Functionality Description
        // - Use api to receive new informatons
        // - Fill redux store with new informations
        // - Remove old data from redux store

    }

    /**
     * Triggers a refresh of the server data
     */
    refresh() {
        store.dispatch({type: RESET_STATE});
        store.dispatch( updateFeeds() );
        store.dispatch( updateTopNews() );
        store.dispatch( updateAllMeals() );
        store.dispatch( updateCoronaMenu() );
        this.checkCourses(false, true);
    }


    /**
     * Check for course update by the stored course timetableCode
     *
     * @param resetState
     *
     * @returns {Promise<void>}
     */
    checkCourses = async (resetState, hideErrors = false) => {
        try {
            const timetableCode = await AsyncStorage.getItem('OLEA:courses_timetableCode');
            if (timetableCode !== null) {
                store.dispatch( updateCourses(timetableCode, hideErrors) );
                if (resetState) {
                    store.dispatch({type: RESET_STATE});
                }
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    /**
     * Updates the date in the set interval
     */
    pollUpdate() {
       // setInterval(() => {
            //store.dispatch( updateWeather());
       // }, 15000);

        //store.dispatch( updateWeather());
    }
/*
    _updateFeeds = () => {
        feedApi.getFeeds((feeds) => {
            if(feeds != null) {
                // Update redux store
                store.dispatch(onUpdateFeeds(feeds));

                // Request feed items
                let feedItems = [];
                feeds.forEach((feed, index) => {
                    feedApi.getFeedById(feed.feedid, (feedItems) => {
                        if (feedItems != null) {
                            store.dispatch(onUpdateFeedItems({'id': feed.feedid, 'items': feedItems}));
                        }
                    });
                });
            }
        });

    }*/

}
