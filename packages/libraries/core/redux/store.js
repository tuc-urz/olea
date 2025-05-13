import { createStore, applyMiddleware, compose } from 'redux';
import { offline } from '@olea/redux-offline';
import offlineConfig from '@olea/redux-offline/lib/defaults';

import asyncDispatchMiddleware from './asyncDispatch';
import rootReducer from './reducers';


export const store = createStore(rootReducer, compose(offline(offlineConfig), applyMiddleware(asyncDispatchMiddleware)));
