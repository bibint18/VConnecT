import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePlan } from "../api/adminAuth";
import { toast } from 'react-toastify';
export const useUpdatePlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, planData }) => updatePlan(id, planData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
        onError: (error) => {
            console.log("error updating plan", error);
            if (error.response?.status === 400) {
                toast.error(error.response.data.error);
            }
            else {
                toast.error("Failed to update plan");
            }
        },
    });
};
