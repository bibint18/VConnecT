import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "../api/adminAuth";

export const usePlans = (
  page: number,
  limit: number,
  search: string,
  sort: string
) => {
  return useQuery(
    ["subscriptionPlans", page, limit, search, sort],
    () => fetchPlans(page, limit, search, sort),
    {
      placeholderData: () => ({ plans: [], total: 0 }),
    }
  );
};