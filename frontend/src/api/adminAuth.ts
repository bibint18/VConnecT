import axios from "axios";


const API_URL = "http://localhost:3000/api/auth"; // Adjust as needed



export const fetchUsers = async (page: number, limit: number) => {
  const response = await axios.get(`${API_URL}/admin/users`, {
    params: { page, limit },
  });
  console.log(response)
  return response.data;
  
};

// Block a user
export const blockUser = async (id: string) => {
  console.log(id)
  const response = await axios.post(`${API_URL}/admin/users/block/${id}`);
  return response.data;
};

// Unblock a user
export const unblockUser = async (id: string) => {
  const response = await axios.post(`${API_URL}/admin/users/unblock/${id}`);
  return response.data;
};

// Delete a user
export const deleteUser = async (id: string) => {
  const response = await axios.post(`${API_URL}/delete/${id}`);
  return response.data;
};





// export const getUsers = async (page: number): Promise<User[]> => {
//   const { data } = await axios.get(`${API_BASE_URL}/admin/users?page=${page}`);
//   return data;
// };

// export const toggleUserAccess = async (userId: string): Promise<void> => {
//   await axios.patch(`${API_BASE_URL}/users/${userId}/toggle-access`);
// };

// export const deleteUser = async (userId: string): Promise<void> => {
//   await axios.delete(`${API_BASE_URL}/users/${userId}`);
// };
