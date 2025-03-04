import { useState } from "react";
import { useVerifyOTP } from "../hooks/useVerifyOTP"; // Updated import
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import "./VerifyOTP.css";

const VerifyOTP = ({ email,name,password }: { email: string;name:string;password:string }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const verifyMutation = useVerifyOTP(); // Uses the correct hook

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
      </div>
    </div>
  );
};

export default VerifyOTP;