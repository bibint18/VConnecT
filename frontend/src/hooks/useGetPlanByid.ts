import { useQuery } from "@tanstack/react-query";
import { findPlanById } from "../api/adminAuth";

export const useGetPlanById = (id: string) => {
  return useQuery({
    queryKey: ["plan", id],
    queryFn: () => findPlanById(id),
    enabled: !!id,
  });
};
