export const onViewUpdate = (view) => {
    return {
        type: 'VIEW_UPDATE',
        view
    }
};


export const onUpdateFeeds = (feeds) => {
    return {
        type: 'UPDATE_FEEDS',
        feeds
    }
};
export const onUpdateFeedItems = (feedItems) => {
    return {
        type: 'UPDATE_FEED_ITEMS',
        feedItems
    }
};
export const onUpdateTopNews = (topNews) => {
    return {
        type: 'UPDATE_TOP_NEWS',
        topNews
    }
};
export const onUpdateRefreshing = (refreshing) => {
    return {
        type: 'UPDATE_REFRESHING_FLAG',
        refreshing
    }
};
export const onUpdateSearchResults = (searchResults) => {
    return {
        type: 'UPDATE_SEARCH_RESULTS',
        searchResults
    }
};
export const onUpdateSearchTopic = (searchTopic) => {
    return {
        type: 'UPDATE_SEARCH_TOPIC',
        searchTopic
    }
};
export const onUpdateSearchResultsBooks = (books) => {
    return {
        type: 'UPDATE_SEARCH_RESULTS_BOOKS',
        books
    }
};
export const onUpdateSearchResultsContacts = (contacts) => {
    return {
        type: 'UPDATE_SEARCH_RESULTS_CONTACTS',
        contacts
    }
};
export const onUpdateSearchResultsRooms = (rooms) => {
    return {
        type: 'UPDATE_SEARCH_RESULTS_ROOMS',
        rooms
    }
};
export const onUpdateSearchResultsNews = (news) => {
    return {
        type: 'UPDATE_SEARCH_RESULTS_NEWS',
        news
    }
};
export const onUpdateModalContent= (modalContent) => {
    return {
        type: 'UPDATE_MODAL_CONTENT',
        modalContent
    }
};
