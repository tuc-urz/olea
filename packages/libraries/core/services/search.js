import { store } from '../redux/store';
import { libraryApi } from '../api/library';
import { roomsApi } from '../api/rooms';
import { telephoneApi } from '../api/telephone';
import { feedApi } from '../api/feed';

import {
    onUpdateSearchTopic,
    onUpdateSearchResultsBooks,
    onUpdateSearchResultsContacts,
    onUpdateSearchResultsRooms,
    onUpdateSearchResultsNews
} from '../redux/actions/state';

export class SearchService {
    static categories = [
        'books',
        'contacts',
        'rooms',
    ];

    constructor(){

    }

    /**
     * Search through all available search api routes
     *
     * @param searchString
     * @param finishedCallback
     * @param includedModules
     * @returns {Promise<void>}
     */
    searchAll(searchString, finishedCallback, includedModules=SearchService.categories) {
        this._clearSearchResults();

        const searchQueries = [];

        if(includedModules.includes('books')) {
            searchQueries.push(new Promise((resolve) => {
                this._searchForBooks(searchString, resolve);
            }));
        }

        if(includedModules.includes('contacts')) {
            searchQueries.push(new Promise((resolve) => {
                this._searchForContacts(searchString, resolve);
            }));
        }

        if(includedModules.includes('rooms')) {
            searchQueries.push(new Promise((resolve) => {
                this._searchForRooms(searchString, resolve);
            }));
        }

      /* TODO Not required at the moment
        const searchNews = new Promise((resolve) => {
            this._searchForNews(searchString, resolve);
        });
       */

        Promise.all(searchQueries).then(finishedCallback);
    }

    /**
     * Search by a specific type. Ignore the rest.
     *
     * @param type
     * @param searchString
     * @param finishedCallback
     */
    searchByType(type, searchString, finishedCallback) {
        this._clearSearchResults();

        const searchPromise = new Promise((resolve) => {
            switch(type){
                case 'books':
                    this._searchForBooks(searchString, resolve);
                    break;
                case 'contacts':
                    this._searchForContacts(searchString, resolve);
                    break;
                case 'rooms':
                    this._searchForRooms(searchString, resolve);
                    break;
                default:
                    finishedCallback();
            }
        });
        searchPromise.then(finishedCallback);
    }

    /**
     * Remove all results in the store
     * @private
     */
    _clearSearchResults() {
        store.dispatch(onUpdateSearchResultsBooks(null));
        store.dispatch(onUpdateSearchResultsContacts(null));
        store.dispatch(onUpdateSearchResultsRooms(null));
        store.dispatch(onUpdateSearchResultsNews(null));
    }

    /**
     * Search for books by the provided search string and save the result in the redux store
     *
     * @param search
     * @param finishedCallback
     * @private
     */
    _searchForBooks(search, finishedCallback) {
        let urlEncodedSearch = encodeURIComponent(search);
        libraryApi.getSearchForBooks(urlEncodedSearch, (results) => {
            store.dispatch(onUpdateSearchResultsBooks(results));
            finishedCallback();
        });
    }

    /**
     * Search for contacts by the provided search string and save the result in the redux store
     *
     * @param search
     * @param finishedCallback
     * @private
     */
    _searchForContacts(search, finishedCallback) {

        let urlEncodedSearch = encodeURIComponent(search);

        telephoneApi.getSearchForName(urlEncodedSearch, (results) => {
            store.dispatch(onUpdateSearchResultsContacts(results));
            finishedCallback();
        });
    }

    /**
     * Search for rooms by the provided search string and save the result in the redux store
     *
     * @param search
     * @param finishedCallback
     * @private
     */
    _searchForRooms(search, finishedCallback) {

        let urlEncodedSearch = encodeURIComponent(search);

        roomsApi.getSearchForRooms(urlEncodedSearch, (results) => {
            store.dispatch(onUpdateSearchResultsRooms(results));
            finishedCallback();
        });
    }
    /**
     * Search for news by the provided search string and save the result in the redux store
     *
     * @param search
     * @param finishedCallback
     * @private
     */
    _searchForNews(search, finishedCallback) {

        let urlEncodedSearch = encodeURIComponent(search);
        // TODO Replace with code below
        feedApi.getFeedById(3, res => {
            store.dispatch(onUpdateSearchResultsNews(res));
            finishedCallback();
        });
/*
        feedApi.getSearchForNews(urlEncodedSearch, (results) => {
            store.dispatch(onUpdateSearchResultsNews(results));
            finishedCallback();
        });
        */
    }
}
