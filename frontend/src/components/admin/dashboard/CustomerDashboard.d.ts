export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    profileImage?: string;
    username?: string;
    otp?: string;
    otpExpiry?: Date;
    isVerified: boolean;
    isAdmin: boolean;
    failedLoginAttempts: number;
    lockUntil: Date | null;
    plan?: {
        planId: string;
        planName: string;
        status: "active" | "expired" | "cancelled";
        startDate: Date;
        endDate?: Date;
        transactionId?: string;
    }[];
    isDeleted: boolean;
    isBlocked: boolean;
    point?: number;
    streak?: number;
    availableRoomLimit?: number;
    friends?: string[];
}
import './customerDashboard.css';
export default function CustomerDashboard(): import("react/jsx-runtime").JSX.Element;
