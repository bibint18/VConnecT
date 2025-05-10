import axiosInstance from "@/utils/axiosInterceptor";
import { useMutation } from "@tanstack/react-query";
export const useResendOTP = () => {
    return useMutation({
        mutationFn: async ({ email }) => {
            const response = await axiosInstance.post("/resend-otp", { email });
            return response.data;
        },
    });
};
