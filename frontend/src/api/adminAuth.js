import axiosInstance from "../utils/axiosInterceptor";
//USERS API
export const fetchUsers = async (page, limit, searchTerm, sortOption) => {
    const response = await axiosInstance.get(`/admin/users`, {
        params: { page, limit, searchTerm, sortOption },
        withCredentials: true
    });
    console.log("from auth", response.data);
    return response.data;
};
export const blockUser = async (id) => {
    console.log(id);
    const response = await axiosInstance.post(`/admin/users/block/${id}`);
    return response.data;
};
export const unblockUser = async (id) => {
    const response = await axiosInstance.post(`/admin/users/unblock/${id}`);
    return response.data;
};
export const deleteUser = async (id) => {
    const response = await axiosInstance.post(`/admin/users/delete/${id}`);
    return response.data;
};
export const addNewPlan = async (PlanData) => {
    const response = await axiosInstance.post(`/admin/plans/add`, PlanData);
    return response.data;
};
export const fetchPlans = async (page = 1, limit = 4, search = '', sort = 'A-Z') => {
    const response = await axiosInstance.get(`/admin/plans`, { params: { page, limit, search, sort } });
    console.log("fetching plans response api ", response.data);
    return response.data;
};
export const findPlanById = async (id) => {
    const response = await axiosInstance.get(`/admin/plans/${id}`);
    return response.data;
};
export const updatePlan = async (id, planData) => {
    console.log("update api ", id, planData);
    const response = await axiosInstance.put(`/admin/plans/edit/${id}`, planData);
    return response.data;
};
export const deletePlan = async (id) => {
    const response = await axiosInstance.post(`/admin/plans/delete/${id}`);
    return response.data;
};
export const fetchRooms = async (page, limit, searchTerm, sortOption) => {
    const response = await axiosInstance.get(`/admin/rooms`, {
        params: { page, limit, searchTerm, sortOption },
        withCredentials: true,
    });
    return response.data;
};
export const blockRoom = async (id) => {
    const response = await axiosInstance.post(`/admin/rooms/block/${id}`);
    return response.data;
};
export const unblockRoom = async (id) => {
    const response = await axiosInstance.post(`/admin/rooms/unblock/${id}`);
    return response.data;
};
export const deleteRoom = async (id) => {
    const response = await axiosInstance.post(`/admin/rooms/delete/${id}`);
    return response.data;
};
export const addTriviaQuestion = async (data) => {
    const response = await axiosInstance.post('/admin/trivia', data);
    return response.data;
};
export const fetchTriviaQuestions = async (page, limit, searchTerm) => {
    const response = await axiosInstance.get('/admin/trivia', { params: { page, limit, searchTerm }, withCredentials: true });
    return response.data;
};
export const fetchTriviaQuestionById = async (id) => {
    const response = await axiosInstance.get(`/admin/trivia/${id}`);
    console.log('data from frontend', response.data);
    return response.data.trivia;
};
export const updateTriviaQuestion = async (id, data) => {
    const response = await axiosInstance.put(`/admin/trivia/update/${id}`, data);
    return response.data;
};
export const deleteTriviaQuestion = async (id) => {
    const response = await axiosInstance.delete(`/admin/trivia/delete/${id}`);
    return response.data;
};
