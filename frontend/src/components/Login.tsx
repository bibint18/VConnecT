import React, { useEffect, useState } from "react";
import { loginUser } from "../services/authService";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { loginTheUser } from "../redux/userSlice";
import {toast} from "react-toastify"
import './styles.css'
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/Setup";
import GoogleLoginButton from "../pages/GoogleLoginButton";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error,setError] = useState<string | null>(null)
  const {isAuthenticated} = useAppSelector((state) => state.user)
  // const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  useEffect(() => {
    if(isAuthenticated){
      navigate('/')
    }
  },[isAuthenticated,navigate])
  console.log(password)
  const handleLogin = async (e: React.FormEvent) => {
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
      if(response && response.user){
        console.log(response)
        dispatch(loginTheUser({name:response.user.name,email:response.user.email,accessToken:response.accessToken}))
        navigate("/");
      }
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Login failed");
      }
    }
  };
  const googleSignIn = async () => {
    try {
      await signInWithPopup(auth,googleProvider)
    } catch (error) {
      console.error(error)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setError(null)
    } catch (error:unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  }
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl p-8 max-w-md w-full border border-purple-500">
        <h2 className="text-3xl font-bold text-purple-500 mb-6 text-center">User Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LeVJOoqAAAAAAsZ76PPRouIZJ_fmV3Ag31sD3xi"
              onChange={setCaptchaToken}
              theme="dark"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-purple-900 transition-all duration-300"
          >
            Login
          </button>
          
        </form>
        <p className="mt-6 text-center text-gray-400">
          New user?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-purple-500 cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
        <p className="mt-6 text-center text-gray-400">
           Sign in{" "}
          <span
            onClick={googleSignIn}
            className="text-purple-500 cursor-pointer hover:underline"
          >
           with Google
          </span>
        </p>
        <div onClick={handleGoogleLogin}>
        <GoogleLoginButton />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
