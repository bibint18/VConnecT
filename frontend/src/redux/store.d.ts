import { TypedUseSelectorHook } from 'react-redux';
export declare const store: import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<import("redux").EmptyObject & {
    auth: import("./authSlice").AuthState & import("redux-persist/es/persistReducer").PersistPartial;
    user: import("./userSlice").UserState & import("redux-persist/es/persistReducer").PersistPartial;
}, import("redux").AnyAction, [import("@reduxjs/toolkit").ThunkMiddleware<import("redux").CombinedState<{
    auth: import("./authSlice").AuthState & import("redux-persist/es/persistReducer").PersistPartial;
    user: import("./userSlice").UserState & import("redux-persist/es/persistReducer").PersistPartial;
}>, import("redux").AnyAction>]>;
export declare const persistor: import("redux-persist").Persistor;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export declare const useAppDispatch: () => import("@reduxjs/toolkit").ThunkDispatch<import("redux").CombinedState<{
    auth: import("./authSlice").AuthState & import("redux-persist/es/persistReducer").PersistPartial;
    user: import("./userSlice").UserState & import("redux-persist/es/persistReducer").PersistPartial;
}>, undefined, import("redux").AnyAction> & import("redux").Dispatch<import("redux").AnyAction>;
export declare const useAppSelector: TypedUseSelectorHook<RootState>;
