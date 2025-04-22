"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatService } from "@/services/ChatService";
import { FriendCallManager } from "@/services/FriendCallManager";
import { IFriend } from "./FriendList";
import { toast } from "react-hot-toast";
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
  const [isConnected, setIsConnected] = useState(false);
  const [friend, setFriend] = useState<IFriend | null>(null);
  const [callState, setCallState] = useState<"idle" | "ringing" | "active">(
    "idle"
  );
  const [localStream, setLocalStream] = useState<MediaStream | null>(null); 
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null); 
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatServiceRef = useRef<ChatService | null>(null);
  const callManagerRef = useRef<FriendCallManager | null>(null); 
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null); 
  const { userId } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is null, cannot load friends");
      toast.error("Please log in to view friends");
      return;
    }


    const handleMessageReceived = (message: IMessage) => {
      if (message.senderId === userId || message.receiverId === userId) {
        if (message.senderId === friendId || message.receiverId === friendId) {
          setMessages((prev) => {
            const updatedMessages = [...prev, message];
            return updatedMessages.sort(
              (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
            );
          });
        }
      }
    };

    chatServiceRef.current = ChatService.getInstance(
      userId,
      handleMessageReceived
    );


    callManagerRef.current = new FriendCallManager(
      chatServiceRef.current,
      (local, remote) => {
        console.log("Stream update - Local:", local, "Remote:", remote);
        setLocalStream(local);
        setRemoteStream(remote);
        setCallState(
          remote ? "active" : callState === "ringing" ? "ringing" : "idle"
        );
      }
    );

   
    const socket  = chatServiceRef.current?.['socket'];
    socket?.emit('join-chat',{userId},(response:unknown) => {
      console.log("Join room response ",response)
    })

    socket?.on("connect_error", (err) => {
      console.error("Connection error:", err);
      toast.error("Connection failed: " + err.message);
    });

    socket?.on("friend-call-error", ({ message }) => {
      console.error("Friend call error:", message);
      toast.error(message);
      setCallState("idle");
    });

    socket?.on(
      "friend-call-incoming",
      ({ callId, callerId }) => {
        console.log("Incoming call:", callId, "from:", callerId);
        setCallState("ringing");
        toast.custom(
          (t) => (
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
              <span>Incoming call from {callerId}</span>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => {
                    chatServiceRef.current?.acceptFriendCall(callId);
                    toast.dismiss(t.id);
                    setCallState("active");
                  }}
                >
                  Accept
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => {
                    chatServiceRef.current?.rejectFriendCall(callId);
                    toast.dismiss(t.id);
                    setCallState("idle");
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ),
          {
            id: callId,
            duration: Infinity,
            position: "top-center",
          }
        );
      }
    );

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
        setMessages(
          history.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
        );
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error((error as Error).message || "Failed to load chat data");
      }
    };

    loadInitialData();

    return () => {
      callManagerRef.current?.endCall();
      socket.off("friend-call-incoming");
      socket.off("friend-call-error");
    };
  }, [userId,friendId]);

  useEffect(() => {
    const socket = chatServiceRef.current?.["socket"];
    if (socket) {
      socket.on("connect", () => setIsConnected(true));
      socket.on("disconnect", () => setIsConnected(false));
    }
  }, []);

  useEffect(() => {
    const socket = chatServiceRef.current?.["socket"];
    
    socket?.on("friend-call-accepted", ({ callId }) => {
      console.log("Call accepted, setting call state to active",callId);
      setCallState("active");
    });
  
    socket?.on("friend-call-incoming", ({ callId, callerId }) => {
      console.log("Incoming call from:", callerId ,callId);
      setCallState("ringing");
    });
  
    return () => {
      socket?.off("friend-call-accepted");
      socket?.off("friend-call-incoming");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- New: Update video refs when streams change ---
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      console.log("Binding local stream to video element:", localStream);
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(e => console.error("Local video play error:", e));
    }
    if (remoteVideoRef.current && remoteStream) {
      console.log("Binding remote stream to video element:", remoteStream);
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(e => console.error("Remote video play error:", e));
    }
  }, [localStream, remoteStream]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatServiceRef.current) {
      if (!chatServiceRef.current || !userId) {
        toast.error("Chat service unavailable or not logged in");
      }
      return;
    }
    const tempMessage: IMessage = {
      id: Date.now().toString(),
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
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error((error as Error).message || "Failed to send message");
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
    }
  };

  // --- New: Handle call button click ---
  const handleCallButton = async () => {
    if (callState === "idle") {
      try {
        setCallState("ringing");
        await callManagerRef.current?.startCall(friendId);
      } catch (error) {
        setCallState("idle");
        toast.error((error as Error).message || "Failed to load chat data");
      }
    } else if (callState === "active") {
      callManagerRef.current?.endCall();
      setCallState("idle");
    }
  };

  // --- New: Toggle audio/video ---
  const toggleAudio = () =>
    callManagerRef.current?.toggleAudio(
      !localStream?.getAudioTracks()[0]?.enabled
    );
  const toggleVideo = () =>
    callManagerRef.current?.toggleVideo(
      !localStream?.getVideoTracks()[0]?.enabled
    );

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b flex justify-between items-center">
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
        {/* --- New: Call Button --- */}

        <button
          onClick={handleCallButton}
          disabled={!isConnected}
          className={`px-3 py-1 rounded-lg text-white ${
            callState === "idle"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          } ${!isConnected && "opacity-50 cursor-not-allowed"}`}
        >
          {!isConnected
            ? "Connecting..."
            : callState === "idle"
            ? "Call"
            : callState === "ringing"
            ? "Ringing..."
            : "End Call"}
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 flex ${
              msg.senderId.toString() === userId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.senderId.toString() === userId
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
              <span className="block text-xs opacity-75">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* --- New: Video Call Overlay --- */}

{(callState === "active" || localStream || remoteStream) && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-gray-900 p-4 rounded-lg w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localStream && (
                <div className="relative">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-full rounded-lg border-2 border-gray-600"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    You
                  </div>
                </div>
              )}
              {remoteStream && (
                <div className="relative">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    className="w-full rounded-lg border-2 border-gray-600"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {friend?.name || "Friend"}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={toggleAudio}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
              >
                {localStream?.getAudioTracks()[0]?.enabled ? (
                  <>
                    <span className="mr-2">🔊</span> Mute
                  </>
                ) : (
                  <>
                    <span className="mr-2">🔇</span> Unmute
                  </>
                )}
              </button>
              <button
                onClick={toggleVideo}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
              >
                {localStream?.getVideoTracks()[0]?.enabled ? (
                  <>
                    <span className="mr-2">📹</span> Stop Video
                  </>
                ) : (
                  <>
                    <span className="mr-2">📷</span> Start Video
                  </>
                )}
              </button>
              <button
                onClick={handleCallButton}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
              >
                <span className="mr-2">📞</span> End Call
              </button>
            </div>
          </div>
        </div>
      )}


{/* message input */}
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
