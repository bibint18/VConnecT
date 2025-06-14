

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
      return response;
    },
    {
      placeholderData: () => ({ users: [], totalUsers: 0 }),
    }
  );
};


// export const useBlockUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: blockUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     },
//   });
// };

// export const useBlockUser = () => {
//   const queryClient = useQueryClient();

// return useMutation({
//   mutationFn: blockUser,
//   onSuccess: (data, userId: string) => {
//     queryClient.setQueryData<UsersResponse>(["users"], (old) => {
//       if (!old) return old;
//       return {
//         ...old,
//         users: old.users.map((user) =>
//           user._id === userId ? { ...user, isBlocked: true } : user
//         ),
//       };
//     });
//   },
// });
// };


export const useBlockUser = (
  page: number,
  limit: number,
  searchTerm: string,
  sortOption: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blockUser,
    onSuccess: (data, userId: string) => {
      queryClient.setQueryData<UsersResponse>(
        ["users", page, limit, searchTerm, sortOption],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            users: old.users.map((user) =>
              user._id === userId ? { ...user, isBlocked: true } : user
            ),
          };
        }
      );
    },
  });
};

// export const useUnblockUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: unblockUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     },
//   });
// };

export const useUnblockUser = (
  page: number,
  limit: number,
  searchTerm: string,
  sortOption: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unblockUser,
    onSuccess: (data, userId: string) => {
      queryClient.setQueryData<UsersResponse>(
        ["users", page, limit, searchTerm, sortOption],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            users: old.users.map((user) =>
              user._id === userId ? { ...user, isBlocked: false } : user
            ),
          };
        }
      );
    },
  });
};


// export const useDeleteUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deleteUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     },
//   });
// };

export const useDeleteUser = (
  page: number,
  limit: number,
  searchTerm: string,
  sortOption: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (data, userId: string) => {
      queryClient.setQueryData<UsersResponse>(
        ["users", page, limit, searchTerm, sortOption],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            users: old.users.filter((user) => user._id !== userId),
            totalUsers: old.totalUsers - 1,
          };
        }
      );
    },
  });
};
