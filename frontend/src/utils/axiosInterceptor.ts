import axios from 'axios'
const axiosInstance = axios.create({baseURL:'http://localhost:3000/api/auth',withCredentials:true})

axiosInstance.interceptors.request.use(async (config) => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1")
  if(!token) config.headers["Authorization"] = `Bearer ${token}`
  return config
})


axiosInstance.interceptors.response.use((response) => response,async(error) => {
  if(error.response.status ===401){
   const accessToken = await axios.post("/auth/refresh",{withCredentials:true})
   
    return axiosInstance(error.config)
  }
  return Promise.reject(error)
})

export default axiosInstance