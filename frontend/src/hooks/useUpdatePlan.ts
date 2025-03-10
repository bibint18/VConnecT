import { useMutation,useQueryClient } from "@tanstack/react-query";
import { updatePlan ,PlanFormData} from "../api/adminAuth";


export const useUpdatePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({id,planData} : {id:string,planData:Partial<PlanFormData>}) => updatePlan(id,planData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["plans"]})
    },
    onError: (error) => {
      console.log("error updating plan",error)
    }
  })
}