import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { loginUser } from "../services/authService";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { loginTheUser } from "../redux/userSlice";
import { toast } from "react-toastify";
import './styles.css';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/Setup";
import GoogleLoginButton from "../pages/GoogleLoginButton";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captchaToken, setCaptchaToken] = useState(null);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAppSelector((state) => state.user);
    const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    console.log("sitekey", sitekey);
    // const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);
    console.log(password);
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
                console.log(response);
                dispatch(loginTheUser({ userId: response.user._id, name: response.user.name, email: response.user.email, accessToken: response.accessToken }));
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
    return (_jsx("div", { className: "min-h-screen bg-black flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-gray-900 rounded-lg shadow-2xl p-8 max-w-md w-full border border-purple-500", children: [_jsx("h2", { className: "text-3xl font-bold text-purple-500 mb-6 text-center", children: "User Login" }), _jsxs("form", { onSubmit: handleLogin, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-300", children: "Email" }), _jsx("input", { type: "email", id: "email", placeholder: "Enter your email", value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-300", children: "Password" }), _jsx("input", { type: "password", id: "password", placeholder: "Enter your password", value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" })] }), _jsx("div", { className: "flex justify-center", children: _jsx(ReCAPTCHA, { sitekey: sitekey, onChange: setCaptchaToken, theme: "dark" }) }), _jsx("button", { type: "submit", className: "w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-purple-900 transition-all duration-300", children: "Login" })] }), _jsxs("p", { className: "mt-6 text-center text-gray-400", children: ["New user?", " ", _jsx("span", { onClick: () => navigate("/signup"), className: "text-purple-500 cursor-pointer hover:underline", children: "Signup" })] }), _jsxs("p", { className: "mt-6 text-center text-gray-400", children: ["Sign in", " ", _jsx("span", { onClick: googleSignIn, className: "text-purple-500 cursor-pointer hover:underline", children: "with Google" })] }), _jsx("div", { onClick: handleGoogleLogin, children: _jsx(GoogleLoginButton, {}) }), error && _jsx("p", { style: { color: 'red' }, children: error })] }) }));
};
export default Login;
