import { useMutation} from "@tanstack/react-query"
import { AxiosError } from "axios"
import { signup } from "../api/auth"


export const useSignup = (setIsEmailVerified: (verified: boolean) => void) => {
  const mutation = useMutation({
    mutationFn: (userData: { name: string; email: string; password: string }) => signup(userData),
    onSuccess: (data) => {
      setIsEmailVerified(true);
      console.log("Signup successful, OTP sent",data);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        console.log(error)
        alert(error.response.data.message);
      } else {
        alert("Signup failed");
      }
    },
  });

  return { ...mutation };
};