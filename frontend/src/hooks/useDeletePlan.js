import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePlan } from "../api/adminAuth";
export const useDeletePlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deletePlan(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
        onError: (error) => {
            console.error("Error deleting user:", error);
        },
    });
};
