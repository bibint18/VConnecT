import { useMutation } from "@tanstack/react-query";
import { addNewPlan } from "../api/adminAuth";
import {toast} from 'react-toastify'
import { AxiosError } from "axios";
interface PlanFormData {
  name: string;
  type: string;
  description: string;
  regularAmount: number;
  discountAmount: number;
  benefits: string[];
  isListed: boolean;
  duration: string;
}

export const useAddPlan = () => {
  const mutation = useMutation<unknown, AxiosError, PlanFormData>({
    mutationFn: addNewPlan,
    onSuccess: (data) => {
      console.log("Plan added successfully:", data);
      toast.success("Plan added successfully!");
    },
    onError: (error) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message || "Add Plan Failed";

      toast.error(errorMessage);
    },
  });
  return {...mutation}
};