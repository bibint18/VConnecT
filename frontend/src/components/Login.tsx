// import React, { useEffect, useState } from "react";
// import { loginUser } from "../services/authService";
// import ReCAPTCHA from "react-google-recaptcha";
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../redux/store";
// import { loginTheUser } from "../redux/userSlice";
// import {toast} from "react-toastify"
// import './styles.css'
// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../firebase/Setup";
// import GoogleLoginButton from "../pages/GoogleLoginButton";
// const Login: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [captchaToken, setCaptchaToken] = useState<string | null>(null);
//   const [error,setError] = useState<string | null>(null)
//   const {isAuthenticated} = useAppSelector((state) => state.user)
//   const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
//   // const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch()
//   useEffect(() => {
//     if(isAuthenticated){
//       navigate('/')
//     }
//   },[isAuthenticated,navigate])
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!email || !password) {
//       toast.error("Email and password are required");
//       return;
//     }
//     if (!captchaToken) {
//       toast.error("Please complete the CAPTCHA");
//       return;
//     }
//     try {
//       const response = await loginUser(email, password, captchaToken);
//       if(response && response.user){
//         dispatch(loginTheUser({userId:response.user._id,name:response.user.name,email:response.user.email,accessToken:response.accessToken}))
//         navigate("/");
//       }
      
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         toast.error(error.message)
//       } else {
//         toast.error("Login failed");
//       }
//     }
//   };
//   const googleSignIn = async () => {
//     try {
//       await signInWithPopup(auth,googleProvider)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const handleGoogleLogin = async () => {
//     try {
//       setError(null)
//     } catch (error:unknown) {
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError('An unknown error occurred');
//       }
//     }
//   }
//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center p-4">
//       <div className="bg-gray-900 rounded-lg shadow-2xl p-8 max-w-md w-full border border-purple-500">
//         <h2 className="text-3xl font-bold text-purple-500 mb-6 text-center">User Login Page</h2>
//         <form onSubmit={handleLogin} className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>
//           <div className="flex justify-center">
//             <ReCAPTCHA
//               sitekey={sitekey}
//               onChange={setCaptchaToken}
//               theme="dark"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-purple-900 transition-all duration-300"
//           >
//             Login
//           </button>
          
//         </form>
//         <p className="mt-6 text-center text-gray-400">
//           New user?{" "}
//           <span
//             onClick={() => navigate("/signup")}
//             className="text-purple-500 cursor-pointer hover:underline"
//           >
//             Signup
//           </span>
//         </p>
//         <p className="mt-6 text-center text-gray-400">
//            Sign in{" "}
//           <span
//             onClick={googleSignIn}
//             className="text-purple-500 cursor-pointer hover:underline"
//           >
//            with Google
//           </span>
//         </p>
//         <div onClick={handleGoogleLogin}>
//         <GoogleLoginButton />
//       </div>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useEffect, useState } from "react";
import { loginUser } from "../services/authService";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { loginTheUser } from "../redux/userSlice";
import { toast } from "react-toastify";
import GoogleLoginButton from "../pages/GoogleLoginButton";
import { Eye,EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
      if (response && response.user) {
        dispatch(
          loginTheUser({
            userId: response.user._id,
            name: response.user.name,
            email: response.user.email,
            accessToken: response.accessToken,
          })
        );
        navigate("/");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Login failed");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="!bg-black !text-white !min-h-screen !flex !items-center !justify-center !px-4 !py-16">
      <div className="!bg-gray-800 !rounded-lg !shadow-md !p-8 !max-w-md !w-full !border !border-gray-700 !animate-fade-in">
        <h2 className="!text-4xl !font-bold !text-purple-500 !mb-8 !text-center">
          Login to VConnect
        </h2>
        <form onSubmit={handleLogin} className="!space-y-6">
          <div className="!flex !flex-col !items-center">
            <label
              htmlFor="email"
              className="!block !text-sm !font-medium !text-gray-300 !mb-2 !w-full !text-left"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="!block !w-full !px-4 !py-3 !bg-gray-900 !border !border-gray-600 !rounded-md !text-white !placeholder-gray-400 !focus:outline-none !focus:ring-2 !focus:ring-purple-500 !transition-all !duration-300 !hover:border-purple-500"
            />
          </div>
          <div className="!flex !flex-col !items-center">
            <label
              htmlFor="password"
              className="!block !text-sm !font-medium !text-gray-300 !mb-2 !w-full !text-left"
            >
              Password
            </label>
            <div className="!relative !w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!block !w-full !px-4 !py-3 !bg-gray-900 !border !border-gray-600 !rounded-md !text-white !placeholder-gray-400 !focus:outline-none !focus:ring-2 !focus:ring-purple-500 !transition-all !duration-300 !hover:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="!absolute !right-3 !top-1/2 !-translate-y-1/2 !text-gray-400 !hover:text-purple-500 !transition-colors !duration-300"
              >
                {showPassword ? (
                  <EyeOff className="!h-5 !w-5" />
                ) : (
                  <Eye className="!h-5 !w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="!flex !justify-center">
            <ReCAPTCHA
              sitekey={sitekey}
              onChange={setCaptchaToken}
              theme="dark"
            />
          </div>
          <div className="!flex !justify-center">
            <button
              type="submit"
              className="!w-full !bg-gradient-to-r !from-purple-600 !to-indigo-600 !text-white !py-3 !px-6 !rounded-md !font-medium !hover:from-purple-700 !hover:to-indigo-700 !hover:scale-105 !transition-all !duration-300 !shadow-md"
            >
              Login
            </button>
          </div>
        </form>
        <p className="!mt-6 !text-center !text-gray-400 !text-sm">
          New user?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="!text-purple-500 !cursor-pointer !hover:underline !hover:text-purple-400 !transition-colors !duration-300"
          >
            Signup
          </span>
        </p>
        <div
          onClick={handleGoogleLogin}
          className="!mt-6 !flex !justify-center"
        >
          <GoogleLoginButton />
        </div>
        {error && (
          <p className="!mt-4 !text-center !text-red-500 !text-sm">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login;