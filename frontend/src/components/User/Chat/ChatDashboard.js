"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import FriendsList from "./FriendList";
import ChatBox from "./ChatBox";
import { ChatService } from "@/services/ChatService";
import { useAppSelector } from "@/redux/store";
const ChatDashboard = () => {
    const [activeChat, setActiveChat] = useState(null);
    const { userId } = useAppSelector((state) => state.user);
    const chatServiceRef = React.useRef(null);
    const handleSelectFriend = (friendId) => {
        setActiveChat(friendId);
    };
    useEffect(() => {
        if (!userId)
            return;
        chatServiceRef.current = ChatService.getInstance(userId, (message) => {
            console.log("ChatDashboard received message for", userId, ":", message);
        });
        return () => {
            if (chatServiceRef.current) {
                // chatServiceRef.current.disconnect();
                // console.log("ChatService disconnected for user:", userId);
            }
        };
    }, [userId]);
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx("div", { className: "w-1/3", children: _jsx(FriendsList, { activeChat: activeChat, onSelectFriend: handleSelectFriend }) }), _jsx("div", { className: "w-2/3", children: activeChat ? (_jsx(ChatBox, { friendId: activeChat })) : (_jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: "Select a friend to start chatting" })) })] }));
};
export default ChatDashboard;
