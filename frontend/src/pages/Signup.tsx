import { useState } from "react"
import "./Signup.css";
import { useSignup } from "../hooks/useSignup";
import VerifyOTP from "./VerifyOTP";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [formData,setFormData] = useState({name:"",email:"",password:"",confirmpsw:''});
  const [isEmailVerified,setIsEmailVerified] = useState(false);
  const navigate = useNavigate()
  const handleChange =(e:React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const {mutate:signupMutation,isPending} = useSignup(setIsEmailVerified)
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
    // if(formData.password !== formData.confirmpsw){
    //   console.log("frontend error")
    //   toast.error("password dont match")
    //   return
    // }
    if (!validateForm()) return;
    signupMutation(formData)
  };

  console.log("formData:", formData);
  return (
    <>
      {isEmailVerified ? (
        <VerifyOTP email={formData.email} name={formData.name} password={formData.password} />
      ) : (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg shadow-2xl p-8 max-w-md w-full border border-purple-500">
            <h2 className="text-3xl font-bold text-purple-500 mb-6 text-center">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  
                />
              </div>
              <div>
                <label htmlFor="confirmpsw" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmpsw"
                  name="confirmpsw"
                  placeholder="Confirm your password"
                  value={formData.confirmpsw}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-purple-900 transition-all duration-300"
              >
                {isPending ? "Signing up..." : "Sign Up"}
              </button>
            </form>
            <p className="mt-6 text-center text-gray-400">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-purple-500 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;