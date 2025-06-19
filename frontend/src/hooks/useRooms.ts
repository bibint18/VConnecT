import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRooms, blockRoom, unblockRoom, deleteRoom } from "../api/adminAuth";
import { RoomsResponse } from "../api/adminAuth";

// export const useRooms = (page: number, limit: number, searchTerm: string, sortOption: string) => {
//   return useQuery<RoomsResponse, Error>({
//     queryKey: ["rooms", page, limit, searchTerm, sortOption],
//     queryFn: async (): Promise<RoomsResponse> => {
//       const response = await fetchRooms(page, limit, searchTerm, sortOption);
//       return response;
//     },
//     placeholderData: (previousData) => previousData ?? { rooms: [], totalRooms: 0 },
//   });
// };

export const useRooms = (
  page: number,
  limit: number,
  searchTerm: string,
  sortOption: string
) => {
  return useQuery<RoomsResponse, Error>(
    ["rooms", page, limit, searchTerm, sortOption],
    async (): Promise<RoomsResponse> => {
      const response = await fetchRooms(page, limit, searchTerm, sortOption);
      return response;
    },
    {
      placeholderData: () => ({ rooms: [], totalRooms: 0 }),
    }
  );
};

// export const useBlockRoom = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: blockRoom,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["rooms"] });
//     },
//   });
// };
export const useBlockRoom = (
  page: number,
  limit: number,
  searchTerm: string,
  sortOption: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blockRoom, // should return success data (e.g. roomId)
    onSuccess: (_data, roomId: string) => {
      queryClient.setQueryData(
        ["rooms", page, limit, searchTerm, sortOption],
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            rooms: old.rooms.map((room: any) =>
              room._id === roomId ? { ...room, isBlocked: true } : room
            ),
          };
        }
      );
    },
  });
};



// export const useUnblockRoom = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: unblockRoom,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["rooms"] });
//     },
//   });
// };

export const useUnblockRoom = (
  page: number,
  limit: number,
  searchTerm: string,
  sortOption: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unblockRoom,
    onSuccess: (_data, roomId: string) => {
      queryClient.setQueryData(
        ["rooms", page, limit, searchTerm, sortOption],
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            rooms: old.rooms.map((room: any) =>
              room._id === roomId ? { ...room, isBlocked: false } : room
            ),
          };
        }
      );
    },
  });
};



export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};