import { useMutation,useQueryClient } from "@tanstack/react-query";
import { deletePlan } from "../api/adminAuth";
export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePlan(id),
      onSuccess: () => {
        queryClient.invalidateQueries(["plans"]);
      },
      onError: (error) => {
        console.error("Error deleting user:", error);
      },
    }
  );
};