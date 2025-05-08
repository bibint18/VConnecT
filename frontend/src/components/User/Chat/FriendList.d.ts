import React from "react";
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
interface FriendsListProps {
    activeChat: string | null;
    onSelectFriend: (friendId: string) => void;
}
declare const FriendsList: React.FC<FriendsListProps>;
export default FriendsList;
