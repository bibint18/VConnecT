// import axios from 'axios'
// import { store } from '../redux/store'
// const axiosInstance = axios.create({baseURL:'http://localhost:3000/api/auth',withCredentials:true})

// let isRefreshing = false
// let failedQueue : {resolve: (value:any) => void; reject: (reason:any) => void}[] = []

// const processQueue = (error:any,token:string | null = null) => {
//   failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)))
//   failedQueue=[]
// }

// axiosInstance.interceptors.request.use(async (config) => {
//   const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1")
//   if(!token) config.headers["Authorization"] = `Bearer ${token}`
//   return config
// })


// axiosInstance.interceptors.response.use((response) => response,async(error) => {
//   if(error.response.status ===401){
//    const accessToken = await axios.post("/auth/refresh",{withCredentials:true})
   
//     return axiosInstance(error.config)
//   }
//   return Promise.reject(error)
// })

// export default axiosInstance



import axios, { InternalAxiosRequestConfig } from 'axios';
import { store } from '../redux/store';
import { login, logout } from '../redux/authSlice';
import { loginTheUser, logoutTheUser } from '../redux/userSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
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
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
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
        
        const refreshResponse = await axios.post(
          'http://localhost:3000/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        const newAccessToken = refreshResponse.data.accessToken;

        // Update Redux with new access token
        if (isAdminRoute) {
          store.dispatch(login({ accessToken: newAccessToken }));
        } else {
          store.dispatch(
            loginTheUser({
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
        // Logout on refresh failure
        store.dispatch(isAdminRoute ? logout() : logoutTheUser());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;