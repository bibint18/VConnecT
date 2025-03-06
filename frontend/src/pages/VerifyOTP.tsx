import { useEffect, useState } from "react";
import { useVerifyOTP } from "../hooks/useVerifyOTP"; // Updated import
import { useNavigate } from "react-router-dom";
import { useResendOTP } from "../hooks/useResendOTP";
import { AxiosError } from "axios";
import "./VerifyOTP.css";

const VerifyOTP = ({ email,name,password }: { email: string;name:string;password:string }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [timer,setTimer] = useState(60)
  const [resendDisabled,setResendDisabled] = useState(true)
  const verifyMutation = useVerifyOTP(); // Uses the correct hook
  const resendMutation = useResendOTP()
useEffect(() => {
  if(timer>0){
    const interval = setInterval(() =>{
      setTimer((prev) => prev-1)
    },1000)
    return () => clearInterval(interval)
  }else{
    setResendDisabled(false)
  }
},[timer])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate(
      { email, otp,name,password },
      {
        onSuccess: () => {
          alert("OTP Verified! Redirecting to login.");
          navigate("/login");
        },
        onError: (error) => {
          if (error instanceof AxiosError && error.response?.data?.message) {
            alert(error.response.data.message);
          } else {
            alert("OTP verification failed");
          }
        },
      }
    );
  };

  const handleResendOTP =() => {
    setResendDisabled(true)
    setTimer(60)
    if (!email) {
      alert("Email is required to resend OTP.");
      return;
    }
    resendMutation.mutate({email},{
      onSuccess:() => {
        alert("New OTP sent to your email.")
      },
      onError: (error:Error) => {
        if(error instanceof AxiosError && error.response?.data?.message){
          alert(error.response.data.message)
        }else{
          alert("failed to resend otp")
        }
      }
    })
  } 

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          <button type="submit" disabled={verifyMutation.isPending}>
            {verifyMutation.isPending ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <p>Resend OTP in {timer}s</p>
        <button onClick={handleResendOTP} disabled={resendDisabled || resendMutation.isPending}>
          {resendMutation.isPending ? "Resending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;