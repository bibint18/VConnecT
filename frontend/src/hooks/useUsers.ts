
// interface User{
//   _id:string;
//   name:string,
//   email:string,
//   password:string,
//   otp?:string,
//   otpExpiry?:Date,
//   isVerified:boolean
//   isAdmin:boolean
//   failedLoginAttempts: number;
//   lockUntil: Date | null;
//   plan?: {
//     planId: string;
//     planName: string;
//     status: "active" | "expired" | "cancelled";
//     startDate: Date;
//     endDate?: Date;
//     transactionId?: string;
//   }[];
//   isDeleted:boolean;
//   isBlocked:boolean
// }

interface UsersResponse {
  users: IUser[];
  totalUsers: number;
}


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, blockUser, unblockUser, deleteUser } from "../api/adminAuth";
import { IUser } from "@/components/admin/dashboard/CustomerDashboard";

export const useUsers = (
  page: number,
  limit: number,
  searchTerm: string,
  sortOption: string
) => {
  return useQuery<UsersResponse, Error>(
    ["users", page, limit, searchTerm, sortOption],
    async (): Promise<UsersResponse> => {
      const response = await fetchUsers(page, limit, searchTerm, sortOption);
      console.log("hook data", response);
      return response;
    },
    {
      placeholderData: () => ({ users: [], totalUsers: 0 }),
    }
  );
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
