import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { loginUser } from "@/services/authService";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { loginTheUser } from "@/redux/userSlice";
import { toast } from "react-toastify";
import './styles.css';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/Setup";
import GoogleLoginButton from "@/pages/GoogleLoginButton";
const DemoLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captchaToken, setCaptchaToken] = useState(null);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { isAuthenticated } = useAppSelector((state) => state.user);
    const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Email and password are required");
            return;
        }
        if (!captchaToken) {
            toast.error("Please complete the CAPTCHA");
            return;
        }
        try {
            const response = await loginUser(email, password, captchaToken);
            if (response && response.user) {
                dispatch(loginTheUser({
                    userId: response.user._id,
                    name: response.user.name,
                    email: response.user.email,
                    accessToken: response.accessToken
                }));
                navigate("/");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
            else {
                toast.error("Login failed");
            }
        }
    };
    const googleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        }
        catch (error) {
            console.error(error);
        }
    };
    const handleGoogleLogin = async () => {
        try {
            setError(null);
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
            else {
                setError('An unknown error occurred');
            }
        }
    };
    return (_jsxs("div", { className: "!min-h-screen !bg-black !flex !items-center !justify-center !p-4 !transition-all !duration-500 !ease-in-out", children: [_jsxs("div", { className: "!bg-gray-900 !rounded-xl !shadow-2xl !p-8 !max-w-md !w-full !border !border-gray-700 !transform !hover:scale-105 !transition-transform !duration-300", children: [_jsx("h2", { className: "!text-3xl !font-extrabold !text-white !mb-6 !text-center !tracking-tight !animate-fadeIn", children: "User Login" }), _jsxs("form", { onSubmit: handleLogin, className: "!space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "!block !text-sm !font-medium !text-gray-300 !mb-1", children: "Email" }), _jsx("input", { type: "email", id: "email", placeholder: "Enter your email", value: email, onChange: (e) => setEmail(e.target.value), className: "!block !w-full !px-4 !py-2 !bg-gray-800 !border !border-gray-600 !rounded-md !text-white !placeholder-gray-500 !focus:outline-none !focus:ring-2 !focus:ring-gray-400 !transition-all !duration-200 !hover:border-gray-500" })] }), _jsxs("div", { className: "!relative", children: [_jsx("label", { htmlFor: "password", className: "!block !text-sm !font-medium !text-gray-300 !mb-1", children: "Password" }), _jsx("input", { type: showPassword ? "text" : "password", id: "password", placeholder: "Enter your password", value: password, onChange: (e) => setPassword(e.target.value), className: "!block !w-full !px-4 !py-2 !bg-gray-800 !border !border-gray-600 !rounded-md !text-white !placeholder-gray-500 !focus:outline-none !focus:ring-2 !focus:ring-gray-400 !transition-all !duration-200 !hover:border-gray-500 !pr-10" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "!absolute !right-3 !top-9 !text-gray-400 !hover:text-gray-200 !transition-colors !duration-200", children: showPassword ? (_jsx("svg", { className: "!w-5 !h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" }) })) : (_jsxs("svg", { className: "!w-5 !h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] })) })] }), _jsx("div", { className: "!flex !justify-center !animate-slideIn", children: _jsx(ReCAPTCHA, { sitekey: sitekey, onChange: setCaptchaToken, theme: "dark" }) }), _jsx("button", { type: "submit", className: "!w-full !bg-gray-200 !text-black !py-2 !px-4 !rounded-md !hover:bg-gray-300 !transition-all !duration-300 !font-semibold !animate-pulseHover", children: "Login" })] }), _jsxs("p", { className: "!mt-6 !text-center !text-gray-400 !text-sm", children: ["New user?", " ", _jsx("span", { onClick: () => navigate("/signup"), className: "!text-gray-200 !cursor-pointer !hover:underline !transition-colors !duration-200", children: "Signup" })] }), _jsxs("p", { className: "!mt-4 !text-center !text-gray-400 !text-sm", children: ["Sign in", " ", _jsx("span", { onClick: googleSignIn, className: "!text-gray-200 !cursor-pointer !hover:underline !transition-colors !duration-200", children: "with Google" })] }), _jsx("div", { onClick: handleGoogleLogin, className: "!mt-4 !flex !justify-center", children: _jsx(GoogleLoginButton, {}) }), error && _jsx("p", { className: "!mt-4 !text-center !text-red-500 !text-sm", children: error })] }), _jsx("style", { children: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulseHover {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out;
          }
          .animate-slideIn {
            animation: slideIn 0.5s ease-in-out;
          }
          .animate-pulseHover:hover {
            animation: pulseHover 0.3s ease-in-out;
          }
        ` })] }));
};
export default DemoLoginPage;
