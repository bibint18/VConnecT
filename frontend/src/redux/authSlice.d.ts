export interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
}
export declare const login: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    accessToken: string;
}, "auth/login">, logout: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"auth/logout">;
declare const _default: import("redux").Reducer<AuthState>;
export default _default;
