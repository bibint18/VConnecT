"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, Plus } from "react-feather";
import { toast } from "react-toastify";
import { ChatService } from "@/services/ChatService";
import { useAppSelector } from "@/redux/store";
const FriendsList = ({ activeChat, onSelectFriend }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useAppSelector((state) => state.user);
    useEffect(() => {
        if (!userId) {
            console.error("User ID is null, cannot load friends");
            toast.error("Please log in to view friends");
            setLoading(false);
            return;
        }
        // const chatService = new ChatService(userId, () => {});
        const chatService = ChatService.getInstance(userId, (message) => {
            console.log("Message recieved in friendList", message);
        });
        const socket = chatService['socket'];
        socket.on('update-last-message', ({ friendId, lastMessage, unreadCount }) => {
            console.log('update event data', friendId, lastMessage, unreadCount);
            setFriends((prevFriends) => {
                const updatedFriends = prevFriends.map((friend) => friend.id === friendId
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
                    : friend);
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
                const sortedFriendList = friendList.sort((a, b) => new Date(b.fullTimestamp).getTime() - new Date(a.fullTimestamp).getTime());
                // setFriends(friendList);
                setFriends(sortedFriendList);
                console.log("friendList fetched", friendList);
                if (friendList.length > 0 && !activeChat) {
                    onSelectFriend(friendList[0].id);
                }
            }
            catch (error) {
                console.error("Error fetching friends:", error);
                toast.error(error.message || "Failed to load friends list");
            }
            finally {
                setLoading(false);
            }
        };
        loadFriends();
        return () => {
            socket.off("update-last-message");
        };
    }, [activeChat, onSelectFriend, userId]);
    const filteredFriends = friends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => new Date(b.fullTimestamp).getTime() - new Date(a.fullTimestamp).getTime());
    return (_jsxs("div", { className: "flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("h2", { className: "text-xl font-bold", children: "Messages" }), _jsx("span", { className: "ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full", children: friends.length })] }), _jsx("button", { className: "w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white", children: _jsx(Plus, { size: 18 }) })] }), _jsx("div", { className: "p-4", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Search Friends", className: "w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), _jsx(Search, { className: "absolute left-3 top-2.5 text-gray-400", size: 18 })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto", children: loading ? (_jsx("div", { className: "p-4 text-center text-gray-500", children: "Loading friends..." })) : filteredFriends.length === 0 ? (_jsx("div", { className: "p-4 text-center text-gray-500", children: "No friends found" })) : (filteredFriends.map((friend) => (_jsxs("div", { className: `flex items-center p-4 cursor-pointer hover:bg-gray-50 ${activeChat === friend.id ? "bg-gray-100" : ""}`, onClick: () => onSelectFriend(friend.id), children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: friend.avatar, alt: friend.name, className: "w-12 h-12 rounded-full object-cover" }), friend.isOnline && (_jsx("div", { className: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" }))] }), _jsxs("div", { className: "ml-3 flex-1", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "font-medium", children: friend.name }), _jsx("span", { className: "text-xs text-gray-500", children: friend.timestamp }), friend.unreadCount > 0 && (_jsx("span", { className: "bg-red-500 text-white text-xs px-2 py-1 rounded-full", children: friend.unreadCount }))] }), _jsx("p", { className: "text-sm text-gray-500 truncate", children: friend.lastMessage })] })] }, friend.id)))) })] }));
};
export default FriendsList;
