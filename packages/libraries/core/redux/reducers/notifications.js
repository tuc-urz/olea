const initialState = {
    subscriberId: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'NOTIFICATIONS_SUBSCRIBER_UPDATE':
            return {
                ...state,
                subscriberId: action.subscriberId
            };
    }
    return state;
}


