
"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus } from "react-feather";
import { toast } from "react-toastify";
import { ChatService } from "@/services/ChatService";
import { useAppSelector } from "@/redux/store";
export interface IFriend {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount:number;
  fullTimestamp: Date;
}

interface FriendsListProps {
  activeChat: string | null;
  onSelectFriend: (friendId: string) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ activeChat, onSelectFriend }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [loading, setLoading] = useState(true);
  const {userId} = useAppSelector((state) => state.user)
  
  useEffect(() => {
    if (!userId) {
      console.error("User ID is null, cannot load friends");
      toast.error("Please log in to view friends");
      setLoading(false);
      return;
    }
    // const chatService = new ChatService(userId, () => {});
    const chatService = ChatService.getInstance(userId,(message) => {
      console.log("Message recieved in friendList",message)
    })

    const socket  = chatService['socket'];
    socket.on('update-last-message', ({ friendId, lastMessage, unreadCount }) => {
      console.log('update event data', friendId, lastMessage, unreadCount);
      setFriends((prevFriends) => {
        const updatedFriends = prevFriends.map((friend) =>
          friend.id === friendId
            ? {
                ...friend,
                lastMessage: lastMessage?.content || "NO MESSAGES YET",
                timestamp: lastMessage?.timestamp
                  ? new Date(lastMessage.timestamp).toLocaleString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })
                  : friend.timestamp,
                // CHANGE: Update fullTimestamp for sorting
                fullTimestamp: lastMessage?.timestamp || friend.fullTimestamp,
                unreadCount: unreadCount || 0,
              }
            : friend
        );
        return updatedFriends.sort((a, b) => new Date(b.fullTimestamp).getTime() - new Date(a.fullTimestamp).getTime());
      });
    });
    // socket.on('update-last-message',({friendId,lastMessage,unreadCount}) => {
    //   console.log('update event data',friendId,lastMessage,unreadCount)
    //   setFriends((prevFriends) => prevFriends.map((friend) => friend.id ===friendId ? {...friend,lastMessage:lastMessage?.content || "NO MESSEGES YET",timestamp:lastMessage?.timestamp || friend.fullTimestamp,unreadCount:unreadCount || 0,} : friend))
    // })

    const loadFriends = async () => {
      try {
        const friendList = await chatService.fetchFriends();
        const sortedFriendList = friendList.sort((a,b) => new Date(b.fullTimestamp).getTime() - new Date(a.fullTimestamp).getTime())
        // setFriends(friendList);
        setFriends(sortedFriendList)
        console.log("friendList fetched",friendList)
        if (friendList.length > 0 && !activeChat) {
          onSelectFriend(friendList[0].id);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        toast.error((error as Error).message || "Failed to load friends list");
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
    //cleanup added now
    return () => {
      socket.off("update-last-message")
    }
  }, [activeChat, onSelectFriend,userId]);

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()))
  .sort((a, b) => new Date(b.fullTimestamp).getTime() - new Date(a.fullTimestamp).getTime());

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">Messages</h2>
          <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {friends.length}
          </span>
        </div>
        <button className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white">
          <Plus size={18} />
        </button>
      </div>

      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Friends"
            className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading friends...</div>
        ) : filteredFriends.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No friends found</div>
        ) : (
          filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                activeChat === friend.id ? "bg-gray-100" : ""
              }`}
              onClick={() => onSelectFriend(friend.id)}
            >
              
              
              <div className="relative">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {friend.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{friend.name}</h3>
                  <span className="text-xs text-gray-500">{friend.timestamp}</span>
                  {/* CHANGE: Display unread message count */}
                  {friend.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {friend.unreadCount}
                      </span>
                    )}
                </div>
                <p className="text-sm text-gray-500 truncate">{friend.lastMessage}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendsList;