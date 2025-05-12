import React, { useEffect, useState } from "react";
import { loginAdmin } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAppDispatch,useAppSelector } from "../redux/store";
import { login } from "../redux/authSlice";
const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const admin = useAppSelector((state) => state.auth.isAuthenticated)
  useEffect(() => {
    if(admin){
      navigate('/dashboard')
    }
  },[admin,navigate])
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!captchaToken) return setError("Please complete the CAPTCHA");

    try {
      const response = await loginAdmin(email, password);
      dispatch(login({accessToken: response.accessToken}))
      navigate("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Admin Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-black rounded-lg shadow-2xl p-8 max-w-md w-full border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
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
              className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
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
              className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black py-2 px-4 rounded-md hover:bg-gray-100 transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
