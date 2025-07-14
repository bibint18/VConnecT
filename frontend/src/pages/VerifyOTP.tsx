
import { useEffect, useState } from "react";
import { useVerifyOTP } from "../hooks/useVerifyOTP";
import { useNavigate } from "react-router-dom";
import { useResendOTP } from "../hooks/useResendOTP";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const VerifyOTP = ({ email, name, password }: { email: string; name: string; password: string }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const verifyMutation = useVerifyOTP();
  const resendMutation = useResendOTP();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate(
      { email, otp, name, password },
      {
        onSuccess: () => {
          toast.success("OTP Verified! Redirecting to login.");
          navigate("/login");
        },
        onError: (error) => {
          if (error instanceof AxiosError && error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("OTP verification failed");
          }
        },
      }
    );
  };

  const handleResendOTP = () => {
    setResendDisabled(true);
    setTimer(60);
    if (!email) {
      toast.error("Email is required to resend OTP.");
      return;
    }
    resendMutation.mutate(
      { email },
      {
        onSuccess: () => {
          toast.success("New OTP sent to your email.");
        },
        onError: (error: Error) => {
          if (error instanceof AxiosError && error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Failed to resend OTP");
          }
        },
      }
    );
  };

  return (
    <main className="!bg-black !text-white !min-h-screen !flex !items-center !justify-center !px-4 !py-16">
      <div className="!bg-gray-800 !rounded-lg !shadow-md !p-8 !max-w-md !w-full !border !border-gray-700 !animate-fade-in">
        <h2 className="!text-4xl !font-bold !text-purple-500 !mb-8 !text-center">
          Verify OTP
        </h2>
        <form onSubmit={handleSubmit} className="!space-y-6">
          <div className="!flex !flex-col !items-center">
            <label
              htmlFor="otp"
              className="!block !text-sm !font-medium !text-gray-300 !mb-2 !w-full !text-left"
            >
              OTP
            </label>
            <input
              type="text"
              id="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="!block !w-full !px-4 !py-3 !bg-gray-900 !border !border-gray-600 !rounded-md !text-white !placeholder-gray-400 !focus:outline-none !focus:ring-2 !focus:ring-purple-500 !transition-all !duration-300 !hover:border-purple-500"
            />
          </div>
          <div className="!flex !justify-center">
            <button
              type="submit"
              disabled={verifyMutation.isLoading}
              className="!w-full !bg-gradient-to-r !from-purple-600 !to-indigo-600 !text-white !py-3 !px-6 !rounded-md !font-medium !hover:from-purple-700 !hover:to-indigo-700 !hover:scale-105 !transition-all !duration-300 !shadow-md !disabled:opacity-50"
            >
              {verifyMutation.isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
        <p className="!mt-6 !text-center !text-gray-400 !text-sm">
          Resend OTP in {timer}s
        </p>
        <div className="!flex !justify-center !mt-4">
          <button
            onClick={handleResendOTP}
            disabled={resendDisabled || resendMutation.isLoading}
            className="!w-full !bg-gray-600 !text-white !py-3 !px-6 !rounded-md !font-medium !hover:bg-gray-700 !hover:scale-105 !transition-all !duration-300 !shadow-md !disabled:opacity-50"
          >
            {resendMutation.isLoading ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default VerifyOTP;