import axiosInstance from "../utils/axiosInterceptor";
import { store } from '../redux/store';
import { AxiosError } from "axios";
import { logoutTheUser } from "../redux/userSlice";
import { logout } from "../redux/authSlice";
export const loginUser = async (email, password, recaptchaToken) => {
    try {
        console.log("hereeeeeeeeeeeeeee");
        console.log("datas: ", email, password, recaptchaToken);
        console.log("password and length", password, password.length);
        const response = await axiosInstance.post("/login", {
            email,
            password,
            recaptchaToken
        });
        console.log("passed from here");
        const { accessToken, user } = response.data;
        console.log("service folder ", accessToken, user);
        // store.dispatch(loginTheUser({name:user.name,email:user.email,accessToken}))
        return response.data;
    }
    catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message); // Forward backend error to frontend
        }
        throw new Error("Something went wrong. Please try again.");
    }
};
export const logoutUser = async () => {
    try {
        await axiosInstance.post('/logout');
        store.dispatch(logoutTheUser());
        window.location.href = '/';
    }
    catch (error) {
        console.error(error);
    }
    // document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // store.dispatch({type:"user/logoutTheuser"})
    // window.location.href='/'
};
export const loginAdmin = async (email, password) => {
    const response = await axiosInstance.post('/adminLogin', {
        email,
        password,
    });
    // const {accessToken} = response.data
    // store.dispatch(login({accessToken}))
    console.log("response on frontend service folder admin", response.data);
    return response.data;
};
export const adminLogout = async () => {
    try {
        await axiosInstance.post('/adminLogout');
        store.dispatch(logout());
        window.location.href = '/adminLogin';
    }
    catch (error) {
        console.error(error);
    }
    // document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // store.dispatch({type:"auth/logout"})
    // window.location.href='/adminLogin'
};
