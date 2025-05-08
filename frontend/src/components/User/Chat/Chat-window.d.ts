import type React from "react";
interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
    isEmoji?: boolean;
}
interface User {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
}
interface ChatWindowProps {
    currentUser: User;
    activeChat: User | null;
    messages: Message[];
    onSendMessage: (text: string) => void;
}
declare const ChatWindow: React.FC<ChatWindowProps>;
export default ChatWindow;
