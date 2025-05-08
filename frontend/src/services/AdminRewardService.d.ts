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
export declare const fetchRewards: (page: number, limit: number, searchTerm: string) => Promise<any>;
export declare const deleteReward: (rewardId: string) => Promise<void>;
export declare const fetchReward: (rewardId: string) => Promise<any>;
export declare const saveReward: (rewardId: string | undefined, payload: any) => Promise<void>;
