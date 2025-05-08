import { RoomsResponse } from "../api/adminAuth";
export declare const useRooms: (page: number, limit: number, searchTerm: string, sortOption: string) => import("@tanstack/react-query").UseQueryResult<RoomsResponse, Error>;
export declare const useBlockRoom: () => import("@tanstack/react-query").UseMutationResult<any, unknown, string, unknown>;
export declare const useUnblockRoom: () => import("@tanstack/react-query").UseMutationResult<any, unknown, string, unknown>;
export declare const useDeleteRoom: () => import("@tanstack/react-query").UseMutationResult<any, unknown, string, unknown>;
