
interface User{
  _id:string;
  name:string,
  email:string,
  password:string,
  otp?:string,
  otpExpiry?:Date,
  isVerified:boolean
  isAdmin:boolean
  failedLoginAttempts: number;
  lockUntil: Date | null;
  plan:string;
  isDeleted:boolean;
  isBlocked:boolean
}

interface UsersResponse {
  users: User[];
  totalUsers: number;
}


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, blockUser, unblockUser, deleteUser } from "../api/adminAuth";

export const useUsers = (page: number, limit: number,searchTerm:string,sortOption:string) => {
  return useQuery<UsersResponse,Error>({
    queryKey: ["users", page, limit,searchTerm,sortOption],
    queryFn: async ():Promise<UsersResponse> => {
      const response = await fetchUsers(page, limit, searchTerm, sortOption);
      console.log('hook data ',response)
      return response; 
    },
    placeholderData: (previousData) => previousData ?? { users: [], totalUsers: 0 },
  });
};


export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};


export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};


export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
