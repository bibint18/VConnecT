// import axios from "axios";
export {};
// const adminAxios = axios.create({baseURL: "http://localhost:3000/api/admin",withCredentials:true})
// adminAxios.interceptors.request.use(
//   async (config) => {
//     const adminToken = document.cookie.replace(/(?:(?:^|.*;\s*)adminToken\s*=\s*([^;]*).*$)|^.*$/, "$1")
//     if(adminToken){
//       config.headers["Authorization"] = `Bearer ${adminToken}` 
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )
// adminAxios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if(error.response && error.response.status === 403){
//       console.log("admin session expired....refreshing token")
//       await axios.post('/refreshAdmin')
//       return adminAxios(error.config)
//     }
//     return Promise.reject(error)
//   }
// )
// export default adminAxios
