import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useVerifyOTP } from "../hooks/useVerifyOTP"; // Updated import
import { useNavigate } from "react-router-dom";
import { useResendOTP } from "../hooks/useResendOTP";
import { AxiosError } from "axios";
import "./VerifyOTP.css";
import toast from "react-hot-toast";
const VerifyOTP = ({ email, name, password }) => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60);
    const [resendDisabled, setResendDisabled] = useState(true);
    const verifyMutation = useVerifyOTP(); // Uses the correct hook
    const resendMutation = useResendOTP();
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
        else {
            setResendDisabled(false);
        }
    }, [timer]);
    const handleSubmit = (e) => {
        e.preventDefault();
        verifyMutation.mutate({ email, otp, name, password }, {
            onSuccess: () => {
                toast.success("OTP Verified! Redirecting to login.");
                navigate("/login");
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
    const handleResendOTP = () => {
        setResendDisabled(true);
        setTimer(60);
        if (!email) {
            alert("Email is required to resend OTP.");
            return;
        }
        resendMutation.mutate({ email }, {
            onSuccess: () => {
                alert("New OTP sent to your email.");
            },
            onError: (error) => {
                if (error instanceof AxiosError && error.response?.data?.message) {
                    alert(error.response.data.message);
                }
                else {
                    alert("failed to resend otp");
                }
            }
        });
    };
    return (_jsx("div", { className: "otp-container", children: _jsxs("div", { className: "otp-box", children: [_jsx("h2", { children: "Verify OTP" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { type: "text", placeholder: "Enter OTP", value: otp, onChange: (e) => setOtp(e.target.value), required: true }), _jsx("button", { type: "submit", disabled: verifyMutation.isLoading, children: verifyMutation.isLoading ? "Verifying..." : "Verify OTP" })] }), _jsxs("p", { children: ["Resend OTP in ", timer, "s"] }), _jsx("button", { onClick: handleResendOTP, disabled: resendDisabled || resendMutation.isLoading, children: resendMutation.isLoading ? "Resending..." : "Resend OTP" })] }) }));
};
export default VerifyOTP;
