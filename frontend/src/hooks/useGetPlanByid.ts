import { useQuery } from "@tanstack/react-query";
import { findPlanById } from "../api/adminAuth";

export const useGetPlanById = (id: string) => {
  return useQuery({
    queryKey: ["plan", id], // Query key
    queryFn: () => findPlanById(id), // Query function
    enabled: !!id, // Fetch only if id is provided
  });
};