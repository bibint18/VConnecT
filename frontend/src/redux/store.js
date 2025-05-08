import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import userReducer from './userSlice';
const persistConfig = {
    key: "root",
    storage,
};
const rootReducer = combineReducers({
    auth: persistReducer({ ...persistConfig, key: "auth" }, authReducer),
    user: persistReducer({ ...persistConfig, key: "user" }, userReducer)
});
export const store = configureStore({
    reducer: rootReducer,
});
export const persistor = persistStore(store);
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
