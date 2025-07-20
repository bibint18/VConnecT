"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, Send } from "react-feather";
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

const ChatWindow: React.FC<ChatWindowProps> = ({
  currentUser,
  activeChat,
  messages,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (!activeChat) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={activeChat.avatar || "/placeholder.svg"}
              alt={activeChat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {activeChat.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="ml-3">
            <h3 className="font-bold text-lg">{activeChat.name}</h3>
            {activeChat.isOnline && (
              <p className="text-xs text-green-500">Online</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full flex items-center">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              ></path>
            </svg>
            VoiceCall
          </button>
          <button className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full flex items-center">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path>
            </svg>
            VideoCall
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            return (
              <div
                key={message.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isCurrentUser && (
                  <img
                    src={activeChat.avatar || "/placeholder.svg"}
                    alt={activeChat.name}
                    className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                  />
                )}
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    isCurrentUser
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  } ${message.isEmoji ? "text-2xl bg-transparent !p-0" : ""}`}
                >
                  {message.text}
                </div>
                {isCurrentUser && (
                  <img
                    src={currentUser.avatar || "/placeholder.svg"}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ml-2 self-end"
                  />
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <Paperclip size={20} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 bg-transparent focus:outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Mic size={20} className="text-gray-500 mx-2" />
          <button
            type="submit"
            className="bg-purple-600 text-white p-2 rounded-full"
            disabled={!newMessage.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
