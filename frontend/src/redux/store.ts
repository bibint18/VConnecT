import {configureStore} from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import {persistReducer,persistStore} from "redux-persist"
import { combineReducers } from 'redux'
import {TypedUseSelectorHook,useDispatch,useSelector} from 'react-redux'
import authReducer from './authSlice'

const persistConfig = {
  key: "root",
  storage,
};

// Combine reducers (if needed)
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
});

// Create store
export const store = configureStore({
  reducer: rootReducer,
});

// Setup persistor
export const persistor = persistStore(store);

// TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for typed useDispatch & useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;