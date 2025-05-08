import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "../api/adminAuth";
// export const usePlans = (page:number,limit:number,search:string,sort:string) => {
//   return useQuery({
//     queryKey:["subscriptionPlans",page,limit,search,sort],
//     queryFn:() => fetchPlans(page,limit,search,sort),
//     placeholderData: (previousData) => previousData ?? { plans: [], total: 0 },
//   })
// }
export const usePlans = (page, limit, search, sort) => {
    return useQuery(["subscriptionPlans", page, limit, search, sort], () => fetchPlans(page, limit, search, sort), {
        placeholderData: () => ({ plans: [], total: 0 }),
    });
};
