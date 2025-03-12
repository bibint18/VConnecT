import { useMutation,useQueryClient } from "@tanstack/react-query";
import { updatePlan ,PlanFormData} from "../api/adminAuth";
import {toast} from'react-toastify'
import { AxiosError } from "axios";
export const useUpdatePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({id,planData} : {id:string,planData:Partial<PlanFormData>}) => updatePlan(id,planData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["plans"]})
    },
    onError: (error: AxiosError<{ error?: string }>) => { 
      console.log("error updating plan", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.error); 
      } else {
        toast.error("Failed to update plan");
      }
    },
  })
}