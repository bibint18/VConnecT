import React from "react";
export interface IMessage {
    id: string;
    senderId: string;
    receiverId: string;
    content?: string;
    mediaUrl?: string;
    mediaType?: 'text' | 'image' | 'video';
    timestamp: Date;
    isRead?: boolean;
}
interface ChatBoxProps {
    friendId: string;
}
declare const ChatBox: React.FC<ChatBoxProps>;
export default ChatBox;
