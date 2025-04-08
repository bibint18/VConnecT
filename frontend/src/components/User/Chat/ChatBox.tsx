
"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatService } from "@/services/ChatService";
import { IFriend } from "./FriendList";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/store";
export interface IMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead?: boolean;
}
interface ChatBoxProps {
  friendId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ friendId }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [friend, setFriend] = useState<IFriend | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatServiceRef = useRef<ChatService | null>(null);
  const {userId} = useAppSelector((state) => state.user)
  useEffect(() => {
    if (!userId) {
      console.error("User ID is null, cannot load friends");
      toast.error("Please log in to view friends");
      return;
    }
    const handleMessageReceived = (message: IMessage) => {
      // setMessages((prev) => [...prev, message]);
      if (message.senderId === userId || message.receiverId === userId) {
        if (message.senderId === friendId || message.receiverId === friendId) {
          // setMessages((prev) => [...prev, message]);
          setMessages((prev) => {
            const updatedMessages = [...prev, message];
            return updatedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          });
        }
      }
    };
   
    
    chatServiceRef.current = ChatService.getInstance(userId,handleMessageReceived)

    const loadInitialData = async () => {
      if (!chatServiceRef.current) {
        console.error("ChatService not initialized");
        toast.error("Chat service unavailable");
        return;
      }

      try {
        console.log("Fetching friends...");
        const friends = await chatServiceRef.current.fetchFriends();
        console.log("Friends fetched:", friends);

        console.log("Looking for friend with ID:", friendId);
        const friendData = chatServiceRef.current.getFriendById(friendId);
        console.log("Friend data retrieved:", friendData);

        if (!friendData) {
          throw new Error("Friend not found in friend list");
        }

        const history = await chatServiceRef.current.fetchChatHistory(friendId);
        console.log("Chat history:", history);

        setFriend(friendData);
        // setMessages(history);
        setMessages(history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error((error as Error).message || "Failed to load chat data");
      }
    };

    loadInitialData();

    // return () => {
    //   chatServiceRef.current?.disconnect();
    // };
  }, [friendId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatServiceRef.current) {
      if (!chatServiceRef.current || !userId) {
        toast.error("Chat service unavailable or not loggedIn");
      }
      return;
    }
    const tempMessage: IMessage = {
      id: Date.now().toString(), // Temporary ID
      senderId: String(userId),
      receiverId: friendId,
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
    };
    try {
      
      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");
      await chatServiceRef.current.sendMessage(friendId, newMessage);
      // setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error((error as Error).message || "Failed to send message");
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
    }
  };

  // useEffect(() => {
  //   return () => {
  //     chatServiceRef.current?.disconnect();
  //   };
  // }, []);
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <img
            src={friend?.avatar}
            alt={friend?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="font-medium">{friend?.name || "Loading..."}</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 flex ${msg.senderId.toString() === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.senderId.toString() === userId ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
              <span className="block text-xs opacity-75">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 !text-black"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;