import { IUser } from "@/components/admin/dashboard/CustomerDashboard";
export interface IReward {
    _id: string;
    rewardId: string;
    title: string;
    description: string;
    type: "room_creation" | "bonus_points";
    value: number;
    requiredPoints?: number;
    requiredStreak?: number;
    isActive: boolean;
    isUnlocked?: boolean;
    isClaimed?: boolean;
}
export declare class RewardService {
    getRewards(): Promise<IReward[]>;
    claimReward(rewardId: string): Promise<void>;
    checkIn(): Promise<void>;
    getUserDetails(userId: string): Promise<IUser>;
}
