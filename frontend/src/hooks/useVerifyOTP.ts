import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "../api/auth";
import { AxiosError } from "axios";

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: (data: { email: string; otp: string,name:string,password:string }) => verifyOtp(data),
    onSuccess: () => {
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
        console.log(error.response.data.message);
      } else {
        console.log("Otp verificarion failed")
      }
    },
  });
};
