import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "../api/adminAuth";

export const usePlans = () => {
  return useQuery({
    queryKey:["subscriptionPlans"],
    queryFn:fetchPlans,
    onSuccess: (data) => {
      console.log("Plans fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching plans:", error);
    }
  })
}