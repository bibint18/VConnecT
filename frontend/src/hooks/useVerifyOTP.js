import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "../api/auth";
import { AxiosError } from "axios";
export const useVerifyOTP = () => {
    return useMutation({
        mutationFn: (data) => verifyOtp(data),
        onSuccess: () => {
            console.log("OTP Verified Successfully");
        },
        onError: (error) => {
            if (error instanceof AxiosError && error.response?.data?.message) {
                alert(error.response.data.message);
            }
            else {
                alert("OTP verification failed");
            }
        },
    });
};
