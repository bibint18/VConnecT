import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "../api/adminAuth";

export const usePlans = (page:number,limit:number,search:string,sort:string) => {
  return useQuery({
    queryKey:["subscriptionPlans",page,limit,search,sort],
    queryFn:() => fetchPlans(page,limit,search,sort),
    placeholderData: (previousData) => previousData ?? { plans: [], total: 0 },
  })
}