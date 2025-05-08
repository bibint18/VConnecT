import { useMutation } from "@tanstack/react-query";
import axios from "axios";
export const useResendOTP = () => {
    return useMutation({
        mutationFn: async ({ email }) => {
            const response = await axios.post("http://localhost:3000/api/auth/resend-otp", { email });
            return response.data;
        },
    });
};
