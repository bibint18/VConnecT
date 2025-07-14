
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, blockUser, unblockUser, deleteUser } from "../api/adminAuth";
import { UserActionResponseDTO, UsersResponseDTO } from "@/types/AdminUserDTO";

export const useUsers = (
  page: number,
  limit: number,
  searchTerm: string,
  sortOption: string
) => {
  return useQuery<UsersResponseDTO, Error>(
    ["users", page, limit, searchTerm, sortOption],
    async (): Promise<UsersResponseDTO> => {
      const response = await fetchUsers(page, limit, searchTerm, sortOption);
      return response;
    },
    {
      placeholderData: () => ({ users: [], totalUsers: 0 }),
    }
  );
};

export const useBlockUser = (
  page: number,
  limit: number,
  searchTerm: string,
  sortOption: string
) => {
  const queryClient = useQueryClient();
  return useMutation<UserActionResponseDTO,Error,string>({
    mutationFn: blockUser,
    onSuccess: ( data) => {
      queryClient.setQueryData<UsersResponseDTO>(
        ["users", page, limit, searchTerm, sortOption],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            users: old.users.map((user) =>
              user._id === data.user._id ? data.user : user
            ),
          };
        }
      );
    },
  });
};

export const useUnblockUser = (
  page: number,
  limit: number,
  searchTerm: string,
  sortOption: string
) => {
  const queryClient = useQueryClient();
  return useMutation<UserActionResponseDTO, Error, string>({
    mutationFn: unblockUser,
    onSuccess: (data) => {
      queryClient.setQueryData<UsersResponseDTO>(
        ["users", page, limit, searchTerm, sortOption],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            users: old.users.map((user) =>
              user._id === data.user._id ? data.user : user
            ),
          };
        }
      );
    },
  });
};


export const useDeleteUser = (
  page: number,
  limit: number,
  searchTerm: string,
  sortOption: string
) => {
  const queryClient = useQueryClient();
  return useMutation<UserActionResponseDTO, Error, string>({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      queryClient.setQueryData<UsersResponseDTO>(
        ["users", page, limit, searchTerm, sortOption],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            users: old.users.filter((user) => user._id !== data.user._id),
            totalUsers: old.totalUsers - 1,
          };
        }
      );
    },
  });
};
