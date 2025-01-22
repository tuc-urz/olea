const initialState = {
    view: 'home',
    refreshing: false,
    searchTopic: '',
    searchResults: {
        books: [],
        contacts: [],
        rooms: [],
        news: []
    },
    modalContent: '',
    newNewPushMessageShown: false
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'VIEW_UPDATE':
            return {
                ...state,
                view: action.view
            };

        case 'UPDATE_REFRESHING_FLAG':
            return {
                ...state,
                refreshing: action.refreshing
            };

            /**
             * @deprecated
             *

        case 'UPDATE_FEED_ITEMS':
            const feedItems = state.feedItems.map(feedItem => {
                if(feedItem.id === action.feedItems.id) {
                    return { ...feedItem, ...action.feedItems.items}
                }
                return feedItem;
            });

            if(feedItems.length === 0 || !feedItems.find(item => item.id === action.feedItems.id)) {
                feedItems.push(action.feedItems);
            }

            return {
                ...state,
                feedItems: feedItems
            };
*/
        case 'UPDATE_SEARCH_TOPIC':
            return {
                ...state,
                searchTopic: action.searchTopic
            };

        case 'UPDATE_SEARCH_RESULTS_BOOKS':
            return {
                ...state,
                searchResults: {
                    ...state.searchResults,
                    books: action.books
                }
            };

        case 'UPDATE_SEARCH_RESULTS_CONTACTS':
            return {
                ...state,
                searchResults: {
                    ...state.searchResults,
                    contacts: action.contacts
                }
            };

        case 'UPDATE_SEARCH_RESULTS_ROOMS':
            return {
                ...state,
                searchResults: {
                    ...state.searchResults,
                    rooms: action.rooms
                }
            };

        case 'UPDATE_SEARCH_RESULTS_NEWS':
            return {
                ...state,
                searchResults: {
                    ...state.searchResults,
                    news: action.news
                }
            };

        case 'UPDATE_MODAL_CONTENT':
            return {
                ...state,
                modalContent: action.modalContent
            };
        case 'UPDATE_PUSH_MESSAGE_SHOWN':
            return {
                ...state,
                newNewPushMessageShown: action.newNewPushMessageShown
            };

        default:
            return state;
    }
};


const updateObjectInArray = (array, action) => {
    return array.map((item, index) => {
        if (index !== action.index) {
            // This isn't the item we care about - keep it as-is
            return item
        }

        // Otherwise, this is the one we want - return an updated value
        return {
            ...item,
            ...action.item
        }
    })
}
