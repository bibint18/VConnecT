import { useMutation } from "@tanstack/react-query";
import { addNewPlan } from "../api/adminAuth";
import { toast } from 'react-toastify';
export const useAddPlan = () => {
    const mutation = useMutation({
        mutationFn: addNewPlan,
        onSuccess: (data) => {
            console.log("Plan added successfully:", data);
            toast.success("Plan added successfully!");
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || "Add Plan Failed";
            toast.error(errorMessage);
        },
    });
    return { ...mutation };
};
