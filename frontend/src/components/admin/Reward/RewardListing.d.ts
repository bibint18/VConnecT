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
declare const AdminRewardsList: React.FC;
export default AdminRewardsList;
