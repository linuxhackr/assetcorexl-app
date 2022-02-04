import {combineReducers, configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist'
import auth from './authSlice'
const middlewares = []

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
};



const createReducer = asyncReducers => (state, action) => {
  const combinedReducer = combineReducers({
    auth,
    ...asyncReducers
  });
  return combinedReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, createReducer());


const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    }).concat(middlewares),
});

export default store;

// todo redux persist