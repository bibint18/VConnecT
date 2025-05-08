export interface UserState {
    userId: string | null;
    name: string | null;
    email: string | null;
    isAuthenticated: boolean;
    accessToken: string | null;
}
export declare const loginTheUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    userId: string;
    name: string;
    email: string;
    accessToken: string;
}, "user/loginTheUser">, logoutTheUser: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"user/logoutTheUser">, updateProfile: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    name: string;
}, "user/updateProfile">;
declare const _default: import("redux").Reducer<UserState>;
export default _default;
