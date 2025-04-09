// frontend/src/components/ChatDashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import FriendsList from "./FriendList";
import ChatBox from "./ChatBox";
import { ChatService } from "@/services/ChatService";
import { useAppSelector } from "@/redux/store";
const ChatDashboard: React.FC = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const {userId} = useAppSelector((state) => state.user)
  const chatServiceRef = React.useRef<ChatService | null>(null)
  const handleSelectFriend = (friendId: string) => {
    setActiveChat(friendId);
  };
  // useEffect(() => {
  //   return () => {
  //     if (userId) {
  //       const chatService = ChatService.getInstance(userId, () => {});
  //       chatService.disconnect(); // Disconnect socket when dashboard unmounts
  //       console.log("ChatService disconnected on ChatDashboard unmount");
  //     }
  //   };
  // }, [userId]);

  useEffect(() => {
    if (!userId) return;

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
  return (
    <div className="flex h-screen">
      <div className="w-1/3">
        <FriendsList activeChat={activeChat} onSelectFriend={handleSelectFriend} />
      </div>
      <div className="w-2/3">
        {activeChat ? (
          <ChatBox friendId={activeChat} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a friend to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;