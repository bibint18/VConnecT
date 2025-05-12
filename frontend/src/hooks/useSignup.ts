import { useMutation} from "@tanstack/react-query"
import { AxiosError } from "axios"
import { signup } from "../api/auth"
import {toast} from 'react-toastify'

export const useSignup = (setIsEmailVerified: (verified: boolean) => void) => {
  const mutation = useMutation({
    mutationFn: (userData: { name: string; email: string; password: string }) => signup(userData),
    onSuccess: (data) => {
      setIsEmailVerified(true);
      console.log("Signup successful, OTP sent",data);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Signup failed");
      }
    },
  });

  return { ...mutation };
};