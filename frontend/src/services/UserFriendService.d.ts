export interface IFriend {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    isOnline: boolean;
    unreadCount: number;
    fullTimestamp: Date;
}
export declare const fetchUserFriends: () => Promise<IFriend[]>;
