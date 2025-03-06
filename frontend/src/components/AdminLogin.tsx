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
      await loginAdmin(email, password);
      dispatch(login())
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
    <div className="login-container">
      <h2>Admin Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {/* <ReCAPTCHA sitekey="YOUR_RECAPTCHA_SITE_KEY" onChange={setCaptchaToken} /> */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
