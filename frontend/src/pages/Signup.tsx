import { useState } from "react"
import "./Signup.css";
import { useSignup } from "../hooks/useSignup";
import VerifyOTP from "./VerifyOTP";
import { toast } from "react-toastify";
const Signup = () => {
  const [formData,setFormData] = useState({name:"",email:"",password:"",confirmpsw:''});
  const [isEmailVerified,setIsEmailVerified] = useState(false);
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
      <div className="signup-container">
        <div className="signup-box">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" onChange={handleChange}  />
            <input type="email" name="email" placeholder="Email" onChange={handleChange}  />
            <input type="password" name="password" placeholder="Password" onChange={handleChange}  />
            <input type="password" name="confirmpsw" placeholder="Confirm password" onChange={handleChange} />
            <button type="submit" disabled={isPending}>
              {isPending ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    )}
  </>
    );
};

export default Signup;