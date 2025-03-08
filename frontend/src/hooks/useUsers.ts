// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios, { AxiosError } from "axios";

// // Define the API base URL
// const API_BASE_URL = "http://localhost:5000/api/admin"; // Adjust as needed

// // Define User Type
// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   plan: string;
//   access: boolean;
//   avatar: string;
// }

// // Fetch Users Function
// const fetchUsers = async (page: number): Promise<User[]> => {
//   const { data } = await axios.get(`${API_BASE_URL}/users?page=${page}`);
//   return data;
// };

// // Hook to Fetch Users
// export const useUsers = (page: number) => {
//   return useQuery<User[], AxiosError>({
//     queryKey: ["users", page],
//     queryFn: () => fetchUsers(page),
//     keepPreviousData: true, // Keeps previous data for smoother pagination
//   });
// };

// // Hook to Block/Unblock User
// export const useToggleAccess = () => {
//   const queryClient = useQueryClient();

//   return useMutation<void, AxiosError, string>({
//     mutationFn: async (userId: string) => {
//       await axios.patch(`${API_BASE_URL}/users/${userId}/toggle-access`);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["users"]);
//       console.log("User access toggled successfully.");
//     },
//     onError: (error) => {
//       console.error("Error toggling user access:", error);
//     },
//   });
// };

// // Hook to Delete User
// export const useDeleteUser = () => {
//   const queryClient = useQueryClient();

//   return useMutation<void, AxiosError, string>({
//     mutationFn: async (userId: string) => {
//       await axios.delete(`${API_BASE_URL}/users/${userId}`);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["users"]);
//       console.log("User deleted successfully.");
//     },
//     onError: (error) => {
//       console.error("Error deleting user:", error);
//     },
//   });
// };







import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, blockUser, unblockUser, deleteUser } from "../api/adminAuth";

// Fetch users with pagination
export const useUsers = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => fetchUsers(page, limit),
    keepPreviousData: true,
  });
};

// Block user
export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Unblock user
export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
