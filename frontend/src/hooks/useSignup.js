import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signup } from "../api/auth";
import { toast } from 'react-toastify';
export const useSignup = (setIsEmailVerified) => {
    const mutation = useMutation({
        mutationFn: (userData) => signup(userData),
        onSuccess: (data) => {
            setIsEmailVerified(true);
            console.log("Signup successful, OTP sent", data);
        },
        onError: (error) => {
            if (error instanceof AxiosError && error.response?.data?.message) {
                console.log(error);
                toast.error(error.response.data.message);
            }
            else {
                toast.error("Signup failed");
            }
        },
    });
    return { ...mutation };
};
