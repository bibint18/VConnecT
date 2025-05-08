import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import axiosInstance from "@/utils/axiosInterceptor";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

interface FriendRequest {
  id: string;
  from: { _id: string; name: string; username: string; profileImage?: string };
  createdAt: string;
}

const FriendRequests: React.FC = () => {
  const { userId, isAuthenticated } = useAppSelector((state) => state.user);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const socketUrl = import.meta.env.VITE_WEB_SOCKET_URL;
  const socket = io(socketUrl, {
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    socket.emit("register-user", { userId });

    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get("/user/friend/requests");
        setRequests(response.data.requests);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load friend requests");
      }
    };
    fetchRequests();

    socket.on(
      "friend-request-received",
      (data: { requestId: string; from: string }) => {
        fetchRequests(); // Refresh list on new request
        toast.info(`New friend request from user ${data.from}`);
      }
    );

    socket.on("friend-request-accepted", () => {
      fetchRequests(); // Refresh on acceptance
    });

    return () => {
      socket.off("friend-request-received");
      socket.off("friend-request-accepted");
    };
  }, [userId, isAuthenticated, socket]);

  const handleRespond = async (requestId: string, accept: boolean) => {
    socket.emit(
      "respond-friend-request",
      { requestId, accept },
      (response: { success?: boolean; error?: string }) => {
        if (response.success) {
          toast.success(`Friend request ${accept ? "accepted" : "rejected"}`);
          setRequests((prev) => prev.filter((req) => req.id !== requestId));
        } else {
          toast.error(response.error || "Failed to respond to friend request");
        }
      }
    );
  };

  return (
    // <div className="min-h-screen bg-gray-100 p-4">
    //   <h1 className="text-2xl font-bold text-center mb-4">Friend Requests</h1>
    //   <ul className="bg-white shadow rounded-lg p-4 max-w-2xl mx-auto">
    //     {requests.map((req) => (
    //       <li key={req.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
    //         <span className="text-gray-800">
    //           {req.from.name} (@{req.from.username})
    //         </span>
    //         <div className="space-x-2">
    //           <button
    //             onClick={() => handleRespond(req.id, true)}
    //             className="bg-green-500 text-white px-2 py-1 rounded"
    //           >
    //             Accept
    //           </button>
    //           <button
    //             onClick={() => handleRespond(req.id, false)}
    //             className="bg-red-500 text-white px-2 py-1 rounded"
    //           >
    //             Reject
    //           </button>
    //         </div>
    //       </li>
    //     ))}
    //     {requests.length === 0 && <li className="text-gray-500 text-center py-2">No pending requests</li>}
    //   </ul>
    // </div>

    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-semibold text-gray-900 text-center mb-6">
        Friend Requests
      </h1>
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-2xl mx-auto">
        <ul className="divide-y divide-gray-200">
          {requests.map((req) => (
            <li
              key={req.id}
              className="flex justify-between items-center py-4 first:pt-0 last:pb-0 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <span className="text-gray-900 font-medium">
                  {req.from.name}
                </span>
                <span className="text-gray-500 text-sm">
                  (@{req.from.username})
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleRespond(req.id, true)}
                  className="bg-green-600 text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRespond(req.id, false)}
                  className="bg-red-600 text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
          {requests.length === 0 && (
            <li className="text-gray-500 text-center py-4 text-sm font-medium">
              No pending requests
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FriendRequests;
