import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

export const OtpVerification = mongoose.model("OtpVerification", otpVerificationSchema);
