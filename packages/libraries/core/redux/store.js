import { createStore, applyMiddleware, compose } from 'redux';
import { offline } from '@openasist/redux-offline';
import offlineConfig from '@openasist/redux-offline/lib/defaults';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import asyncDispatchMiddleware from './asyncDispatch';
import rootReducer from './reducers';

// Create persist config for redux-persist v6
// This will handle persisting the entire root state
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
  // Persist all state except api which might contain temporary data
  blacklist: ['apiReducer']
};

// Wrap the root reducer with persistReducer to enable persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Custom persist function that works with redux-persist v6
// This replaces redux-offline's internal persistence
const customPersist = (store, options, callback) => {
  // Since we're using persistReducer, we just need to call persistStore
  // without any additional configuration
  const persistor = persistStore(store, callback);
  return persistor;
};

// Create custom offline config that uses our custom persist function
const customOfflineConfig = {
  ...offlineConfig,
  persist: customPersist,
  persistOptions: {} // Empty since we handle persistence through persistReducer
};

export const store = createStore(persistedReducer, compose(offline(customOfflineConfig), applyMiddleware(asyncDispatchMiddleware)));
export const persistor = persistStore(store);
