// import { useState } from "react"
// import "./Signup.css";
// import { useSignup } from "../hooks/useSignup";
// import VerifyOTP from "./VerifyOTP";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// const Signup = () => {
//   const [formData,setFormData] = useState({name:"",email:"",password:"",confirmpsw:''});
//   const [isEmailVerified,setIsEmailVerified] = useState(false);
//   const navigate = useNavigate()
//   const handleChange =(e:React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({...formData,[e.target.name]:e.target.value})
//   }

//   const {mutate:signupMutation,isLoading} = useSignup(setIsEmailVerified)
//   const validateForm = () => {
//     const { name, email, password, confirmpsw } = formData;

//     if (!name || !email || !password || !confirmpsw) {
//       toast.error("All fields are required");
//       return false;
//     }

//     if (/\s/.test(name) || /\s/.test(email) || /\s/.test(password) || /\s/.test(confirmpsw)) {
//       toast.error("Spaces are not allowed in any field");
//       return false;
//     }

//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!passwordRegex.test(password)) {
//       toast.error("Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character");
//       return false;
//     }

//     if (password !== confirmpsw) {
//       toast.error("Passwords do not match");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     signupMutation(formData)
//   };

//   return (
//     <>
//       {isEmailVerified ? (
//         <VerifyOTP email={formData.email} name={formData.name} password={formData.password} />
//       ) : (
//         <div className="min-h-screen bg-black flex items-center justify-center p-4">
//           <div className="bg-gray-900 rounded-lg shadow-2xl p-8 max-w-md w-full border border-purple-500">
//             <h2 className="text-3xl font-bold text-purple-500 mb-6 text-center">Sign Up</h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-300">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   placeholder="Enter your name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                
//                 />
//               </div>
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                
//                 />
//               </div>
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  
//                 />
//               </div>
//               <div>
//                 <label htmlFor="confirmpsw" className="block text-sm font-medium text-gray-300">
//                   Confirm Password
//                 </label>
//                 <input
//                   type="password"
//                   id="confirmpsw"
//                   name="confirmpsw"
//                   placeholder="Confirm your password"
//                   value={formData.confirmpsw}
//                   onChange={handleChange}
//                   className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-purple-900 transition-all duration-300"
//               >
//                 {isLoading ? "Signing up..." : "Sign Up"}
//               </button>
//             </form>
//             <p className="mt-6 text-center text-gray-400">
//               Already have an account?{" "}
//               <span
//                 onClick={() => navigate("/login")}
//                 className="text-purple-500 cursor-pointer hover:underline"
//               >
//                 Login
//               </span>
//             </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Signup;


import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import VerifyOTP from "./VerifyOTP";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Eye,EyeOff } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmpsw: "" });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { mutate: signupMutation, isLoading } = useSignup(setIsEmailVerified);
  const validateForm = () => {
    const { name, email, password, confirmpsw } = formData;

    if (!name || !email || !password || !confirmpsw) {
      toast.error("All fields are required");
      return false;
    }

    if (/\s/.test(name) || /\s/.test(email) || /\s/.test(password) || /\s/.test(confirmpsw)) {
      toast.error("Spaces are not allowed in any field");
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character");
      return false;
    }

    if (password !== confirmpsw) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    signupMutation(formData);
  };

  return (
    <>
      {isEmailVerified ? (
        <VerifyOTP email={formData.email} name={formData.name} password={formData.password} />
      ) : (
        <main className="!bg-black !text-white !min-h-screen !flex !items-center !justify-center !px-4 !py-16">
          <div className="!bg-gray-800 !rounded-lg !shadow-md !p-8 !max-w-md !w-full !border !border-gray-700 !animate-fade-in">
            <h2 className="!text-4xl !font-bold !text-purple-500 !mb-8 !text-center">
              Sign Up to VConnect
            </h2>
            <form onSubmit={handleSubmit} className="!space-y-6">
              <div className="!flex !flex-col !items-center">
                <label
                  htmlFor="name"
                  className="!block !text-sm !font-medium !text-gray-300 !mb-2 !w-full !text-left"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="!block !w-full !px-4 !py-3 !bg-gray-900 !border !border-gray-600 !rounded-md !text-white !placeholder-gray-400 !focus:outline-none !focus:ring-2 !focus:ring-purple-500 !transition-all !duration-300 !hover:border-purple-500"
                />
              </div>
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
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
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
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
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
              <div className="!flex !flex-col !items-center">
                <label
                  htmlFor="confirmpsw"
                  className="!block !text-sm !font-medium !text-gray-300 !mb-2 !w-full !text-left"
                >
                  Confirm Password
                </label>
                <div className="!relative !w-full">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmpsw"
                    name="confirmpsw"
                    placeholder="Confirm your password"
                    value={formData.confirmpsw}
                    onChange={handleChange}
                    className="!block !w-full !px-4 !py-3 !bg-gray-900 !border !border-gray-600 !rounded-md !text-white !placeholder-gray-400 !focus:outline-none !focus:ring-2 !focus:ring-purple-500 !transition-all !duration-300 !hover:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="!absolute !right-3 !top-1/2 !-translate-y-1/2 !text-gray-400 !hover:text-purple-500 !transition-colors !duration-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="!h-5 !w-5" />
                    ) : (
                      <Eye className="!h-5 !w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="!flex !justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="!w-full !bg-gradient-to-r !from-purple-600 !to-indigo-600 !text-white !py-3 !px-6 !rounded-md !font-medium !hover:from-purple-700 !hover:to-indigo-700 !hover:scale-105 !transition-all !duration-300 !shadow-md disabled:opacity-50"
                >
                  {isLoading ? "Signing up..." : "Sign Up"}
                </button>
              </div>
            </form>
            <p className="!mt-6 !text-center !text-gray-400 !text-sm">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="!text-purple-500 !cursor-pointer !hover:underline !hover:text-purple-400 !transition-colors !duration-300"
              >
                Login
              </span>
            </p>
          </div>
        </main>
      )}
    </>
  );
};

export default Signup;