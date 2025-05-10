import axiosInstance from "@/utils/axiosInterceptor";
import { useMutation } from "@tanstack/react-query";

interface ResendOTPParams {
  email: string;
}

export const useResendOTP = () => {
  return useMutation<unknown, Error, ResendOTPParams>({
    mutationFn: async ({ email }) => {
      const response = await axiosInstance.post("/resend-otp", { email });
      return response.data;
    },
  });
};