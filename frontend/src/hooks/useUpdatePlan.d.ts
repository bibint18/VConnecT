import { PlanFormData } from "../api/adminAuth";
import { AxiosError } from "axios";
export declare const useUpdatePlan: () => import("@tanstack/react-query").UseMutationResult<any, AxiosError<{
    error?: string;
}, any>, {
    id: string;
    planData: Partial<PlanFormData>;
}, unknown>;
