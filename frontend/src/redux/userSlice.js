import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    userId: null,
    name: null,
    email: null,
    isAuthenticated: false,
    accessToken: null
};
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginTheUser: (state, action) => {
            state.userId = action.payload.userId;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isAuthenticated = true;
            state.accessToken = action.payload.accessToken;
        },
        logoutTheUser: (state) => {
            state.userId = null;
            state.name = null;
            state.email = null;
            state.isAuthenticated = false;
            state.accessToken = null;
        },
        updateProfile: (state, action) => {
            state.name = action.payload.name ?? state.name;
        }
    }
});
export const { loginTheUser, logoutTheUser, updateProfile } = userSlice.actions;
export default userSlice.reducer;
