import { useMutation } from "@tanstack/react-query";
import { addNewPlan } from "../api/adminAuth";
import {toast} from 'react-toastify'

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
  const mutation = useMutation<unknown, Error, PlanFormData>({
    mutationFn: addNewPlan,
    onSuccess: (data) => {
      console.log("Plan added successfully:", data);
      toast.success("Plan added successfully!");
    },
    onError: (error) => {
      console.error("Error adding plan:", error);
      toast.error("Failed to add plan.");
    },
  });
  return {...mutation}
};