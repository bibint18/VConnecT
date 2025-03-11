import React, { useState } from "react";
import { loginUser } from "../services/authService";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify"
import './styles.css'
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // const [error, setError] = useState("");
  const navigate = useNavigate();
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
      await loginUser(email, password, captchaToken);
      navigate("/home");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Login failed");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      {/* {error && <p className="error">{error}</p>} */}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}  />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  />
        <ReCAPTCHA sitekey="6LeVJOoqAAAAAAsZ76PPRouIZJ_fmV3Ag31sD3xi" onChange={setCaptchaToken} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
