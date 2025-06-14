"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChatService } from "@/services/ChatService";
import { FriendCallManager } from "@/services/FriendCallManager";
import { IFriend } from "./FriendList";
import { Toast, toast } from "react-hot-toast";
import { useAppSelector } from "@/redux/store";
import { Paperclip } from "react-feather";
import axiosInstance from "@/utils/axiosInterceptor";
import { io,Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import {Check,CheckCheck,Bell,BellOff} from "lucide-react"
// import {v4 as uuidv4} from 'uuid'
interface CloudinaryChatUploadResult {
  secure_url: string;
  resource_type: "image" | "video";
}


export interface IMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content?: string;
  mediaUrl?:string;
  mediaType?:'text' | 'image' | 'video';
  timestamp: Date;
  isRead?: boolean;
}

interface ChatBoxProps {
  friendId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ friendId }) => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [friend, setFriend] = useState<IFriend | null>(null);
  const [callState, setCallState] = useState<"idle" | "ringing" | "active">(
    "idle"
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null); 
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null); 
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatServiceRef = useRef<ChatService | null>(null);
  const callManagerRef = useRef<FriendCallManager | null>(null); 
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); 
  const { userId } = useAppSelector((state) => state.user);
  const socketRef = useRef<Socket | null>(null)
  useEffect(() => {
    if (!userId) {
      
      toast.error("Please log in to view friends");
      return;
    }
      const socketUrl = import.meta.env.VITE_WEB_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      socketRef.current?.emit("join-user", { userId });
    });

    socketRef.current.on("disconnect", (reason) => {
      setIsConnected(false);
      if (reason !== "io client disconnect") {
        toast.error("Disconnected from call server, trying to reconnect...");
      }
    });

    socketRef.current.on("reconnect", () => {
      toast.success("Reconnected to call server");
      socketRef.current?.emit("join-user", { userId });
    });

    socketRef.current.on("reconnect_failed", () => {
      toast.error("Failed to reconnect to call server");
    });


    const handleMessageReceived = (message: IMessage) => {
      if (message.senderId === userId || message.receiverId === userId) {
        if (message.senderId === friendId || message.receiverId === friendId) {
          setMessages((prev) => {
            const isDuplicate = prev.some((msg) => {
              const timeDiff = Math.abs(
                new Date(msg.timestamp).getTime() - new Date(message.timestamp).getTime()
              );
              return (
                msg.senderId === message.senderId &&
                msg.receiverId === message.receiverId &&
                msg.content === message.content &&
                timeDiff < 1000 
              );
            });

            if (isDuplicate) {
              return prev.map((msg) => {
                const timeDiff = Math.abs(
                  new Date(msg.timestamp).getTime() - new Date(message.timestamp).getTime()
                );
                if (
                  msg.senderId === message.senderId &&
                  msg.receiverId === message.receiverId &&
                  msg.content === message.content &&
                  timeDiff < 1000
                ) {
                  return message; 
                }
                return msg;
              });
            }
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
      toast.error("Connection failed: " + err.message);
    });

    socket?.on("friend-call-error", ({ message }) => {
      toast.error(message);
      setCallState("idle");
    });

   
    socketRef.current.on("directCall:incoming", ({ callId, callerId }: { callId: string; callerId: string }) => {
      toast.custom(
        (t:Toast) => (
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <span>Incoming call from {callerId}</span>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {
                  socketRef.current?.emit("directCall:accept", { callId });
                  toast.dismiss(t.id);
                  navigate(`/call/${callId}`);
                }}
              >
                Accept
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  socketRef.current?.emit("directCall:reject", { callId });
                  toast.dismiss(t.id);
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
    });


socketRef.current.on("directCall:rejected", ({ callId }) => {
      console.log("Call rejected:", callId);
      toast.error("Call was rejected");
    });

    socketRef.current.on("directCall:missed", ({ callId }) => {
      console.log("Call missed:", callId);
      toast("Call was missed");
    });

socketRef.current.on("directCall:ended", ({ callId }) => {
      console.log("Call ended by peer:", callId);
      toast("Call ended by the other user");
    });

    socket?.on(
      "friend-call-incoming",
      ({ callId, callerId }) => {
        console.log("Incoming call:", callId, "from:", callerId);
        setCallState("ringing");
        toast.custom(
          (t:Toast) => (
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


    const initializeNotifications = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          console.log("going to initialixze")
          const registration = await navigator.serviceWorker.register('/service-woker.js');
          console.log('Service Worker registered:', registration);

          const permission = await Notification.requestPermission();
          setNotificationsEnabled(permission === 'granted');

          if (permission === 'granted') {
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
            });
            await chatServiceRef.current?.saveSubscription(subscription);
          }
        } catch (error) {
          console.error('Error initializing notifications:', error);
          // toast.error('Failed to initialize notifications');
        }
      }
    };

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


        await chatServiceRef.current.markMessageAsRead(userId,friendId)
        const socket = chatServiceRef.current['socket']
        const lastMessage = history.length > 0 ? history[history.length -1] : null
        const unreadCount = 0;
        socket.emit('update-last-message',{
          friendId,lastMessage,unreadCount
        })

        setFriend(friendData);
        setMessages(
          history.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
        );
        initializeNotifications();
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error((error as Error).message || "Failed to load chat data");
      }
    };

    loadInitialData();

    return () => {
      callManagerRef.current?.endCall();
      if (socketRef.current) {
        socketRef.current.off("directCall:incoming");
        socketRef.current.off("directCall:rejected");
        socketRef.current.off("directCall:missed");
        socketRef.current.off("directCall:ended");
        socketRef.current.off("connect");
        // socketRef.current.off("disconnect");
        socketRef.current.off("reconnect");
        socketRef.current.off("reconnect_failed");
        // socketRef.current.disconnect();
      }
      socket.off("friend-call-incoming");
      socket.off("friend-call-error");
    };
  }, [userId,friendId,callState,navigate]);

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
      mediaType:'text',
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

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    try {
      setIsUploading(true);
      const maxSize = file.type.startsWith("image/") ? 5 * 1024 * 1024 : 100 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`File too large. Max size: ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      const { data } = await axiosInstance.get("/chat/signature");
      const { signature, timestamp } = data;

      console.log("Uploading with parameters:", {
        file: file.name,
        timestamp,
        signature,
        folder: "chat_media",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY as string);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "chat_media");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary error:", errorData);
        throw new Error(errorData.error?.message || "Failed to upload file to Cloudinary");
      }

      const result: CloudinaryChatUploadResult = await response.json();
      const mediaUrl = result.secure_url;
      const mediaType = result.resource_type as "image" | "video";

      const tempMessage: IMessage = {
        id: Date.now().toString(),
        senderId: String(userId),
        receiverId: friendId,
        mediaUrl,
        mediaType,
        timestamp: new Date(),
        isRead: false,
      };

      setMessages((prev) => [...prev, tempMessage]);
      await chatServiceRef.current
        ?.sendMessage(friendId, "", mediaUrl, mediaType)
        .catch((err) => {
          setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
          throw err;
        });

      toast.success("Media sent");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error((error as Error).message || "Failed to upload media");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
    }
  };

  // --- New: Handle call button click ---
  const handleCallButton = () => {
    // if (!socketRef.current || !isConnected) {
    //   toast.error("Not connected to server");
    //   return;
    // }
    // const callId = uuidv4();
    // socketRef.current.emit("directCall:initiate", {
    //   callerId: userId,
    //   receiverId: friendId,
    //   callId,
    // });
    // navigate(`/call/${callId}`);
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

    function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const handleEnableNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
          });
          await chatServiceRef.current?.saveSubscription(subscription);
          setNotificationsEnabled(true);
          toast.success('Notifications enabled');
        }
      } else {
        toast.error('Notifications permission denied');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Failed to enable notifications');
    }
  };

    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <img src={friend?.avatar} alt={friend?.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="ml-3">
              <h3 className="font-medium">{friend?.name || "Loading..."}</h3>
            </div>
          </div>
          <button
            onClick={handleCallButton}
            disabled={!isConnected}
            className={` !bg-white px-3 py-1 rounded-lg text-white bg-green-500 hover:bg-green-600 ${!isConnected && "opacity-50 cursor-not-allowed"}`}
          >
            {isConnected ? "Call" : "Connecting..."}
          </button>

<button
            onClick={handleEnableNotifications}
            disabled={notificationsEnabled}
            className={`p-2 rounded-lg text-white ${notificationsEnabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            title={notificationsEnabled ? 'Notifications enabled' : 'Enable notifications'} 
          >
            {notificationsEnabled ? (
              <BellOff className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </button>
        </div>
  
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 flex ${msg.senderId.toString() === userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${msg.senderId.toString() === userId ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                {msg.mediaType === "text" && msg.content && (
                  <>
                    {msg.content}
                    <span className="block text-xs opacity-75">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    {msg.senderId.toString() === userId && (
                      msg.isRead ? (
                        <CheckCheck className="w-4 h-4 text-black-500" />
                      ) : (
                        <Check className="w-4 h-4 text-gray-400" />
                      )
                    )}
                  </>
                )}
                {msg.mediaType === "image" && msg.mediaUrl && (
                  <div>
                    <img src={msg.mediaUrl} alt="Chat image" className="max-w-full rounded-lg" />
                    <span className="block text-xs opacity-75">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    {msg.senderId.toString() === userId && (
                      msg.isRead ? (
                        <CheckCheck className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Check className="w-4 h-4 text-gray-400" />
                      )
                    )}
                  </div>
                )}
                {msg.mediaType === "video" && msg.mediaUrl && (
                  <div>
                    <video src={msg.mediaUrl} controls className="max-w-full rounded-lg" />
                    <span className="block text-xs opacity-75">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    {msg.senderId.toString() === userId && (
                      msg.isRead ? (
                        <CheckCheck className="w-4 h-4 text-dark-500" />
                      ) : (
                        <Check className="w-4 h-4 text-gray-400" />
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
  
        {(callState === "active" || localStream || remoteStream) && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative bg-gray-900 p-4 rounded-lg w-full max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localStream && (
                  <div className="relative">
                    <video ref={localVideoRef} autoPlay muted className="w-full rounded-lg border-2 border-gray-600" />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">You</div>
                  </div>
                )}
                {remoteStream && (
                  <div className="relative">
                    <video ref={remoteVideoRef} autoPlay className="w-full rounded-lg border-2 border-gray-600" />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">{friend?.name || "Friend"}</div>
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
                {/* <button
                  onClick={handleCallButton}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                >
                  <span className="mr-2">📞</span> End Call
                </button> */}
              </div>
            </div>
          </div>
        )}
  
        <div className="p-4 border-t">
          <div className="flex items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || !isConnected}
              className={`p-2 ${isUploading || !isConnected ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"} rounded-l-lg`}
            >
              <Paperclip size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaUpload}
              accept="image/jpeg,image/png,image/gif,video/mp4,video/webm,video/mov"
              className="hidden"
            />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-none focus:outline-none focus:ring-2 focus:ring-purple-500 !text-black !w-36"
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
