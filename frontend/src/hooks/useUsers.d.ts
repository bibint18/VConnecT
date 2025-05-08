interface UsersResponse {
    users: IUser[];
    totalUsers: number;
}
import { IUser } from "@/components/admin/dashboard/CustomerDashboard";
export declare const useUsers: (page: number, limit: number, searchTerm: string, sortOption: string) => import("@tanstack/react-query").UseQueryResult<UsersResponse, Error>;
export declare const useBlockUser: () => import("@tanstack/react-query").UseMutationResult<any, unknown, string, unknown>;
export declare const useUnblockUser: () => import("@tanstack/react-query").UseMutationResult<any, unknown, string, unknown>;
export declare const useDeleteUser: () => import("@tanstack/react-query").UseMutationResult<any, unknown, string, unknown>;
export {};
