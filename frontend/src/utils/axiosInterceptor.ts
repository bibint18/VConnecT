
import axios, { InternalAxiosRequestConfig } from 'axios';
import { store } from '../redux/store';
import { login, logout } from '../redux/authSlice';
import { loginTheUser, logoutTheUser } from '../redux/userSlice';
import toast from 'react-hot-toast';
const BaseUrl = import.meta.env.VITE_API_URL
const axiosInstance = axios.create({
  baseURL: BaseUrl,
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue: { resolve: (value: string | null) => void; reject: (reason: Error) => void }[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    console.log("state in the axiosInstance ",state)
    const isAdminRoute = config.url?.includes('admin');
    const accessToken = isAdminRoute ? state.auth.accessToken : state.user.accessToken;
    console.log("accessToken added")
    console.log('Redux state:', state);
    console.log('isAdminRoute:', isAdminRoute);
    console.log('accessToken:', accessToken);
    console.log('Cookies: on request ', document.cookie);
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("on response use")
    const originalRequest = error.config;
    console.log("original request",originalRequest)
    console.log('Cookies: on response', document.cookie);
    if (error.response?.status === 403 && error.response?.data?.message === 'User is blocked') {
      console.log('User is blocked. Preventing logout.');
      toast.error('Your account is blocked. Please contact support.',{duration:3000});
      setTimeout(() => {
        store.dispatch(logoutTheUser())
      window.location.href='/login'
      },3000)
      
      return Promise.reject(error);
    }
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const isAdminRoute = originalRequest.url.includes('admin');
      try {
        const state = store.getState();
        console.log('state from axiosInstance ',state)
        console.log('Cookies: posting to refresh', document.cookie);
        const refreshResponse = await axiosInstance.post(
          'refresh',
          {},
          { withCredentials: true }
        );
        const newAccessToken = refreshResponse.data.accessToken;
        console.log("new access token from rerfrsh")
        
        if (isAdminRoute) {
          store.dispatch(login({ accessToken: newAccessToken }));
        } else {
          store.dispatch(
            loginTheUser({
              userId:state.user.userId || '',
              name: state.user.name || '',
              email: state.user.email || '',
              accessToken: newAccessToken,
            })
          );
        }

        processQueue(null, newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError instanceof Error ? refreshError : new Error(String(refreshError)), null);;
        isRefreshing = false;
        if (error.response?.status !== 403 || error.response?.data?.message !== 'User is blocked') {
          store.dispatch(isAdminRoute ? logout() : logoutTheUser());
        }
        // Logout on refresh failure
        store.dispatch(isAdminRoute ? logout() : logoutTheUser());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;