"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomDetails } from "@/services/roomService";
import { IDetailRoom } from "@/services/roomService";

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<IDetailRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!id) return;
      try {
        const { room } = await getRoomDetails(id);
        console.log("room details: ",room)
        setRoom(room);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch room details");
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [id]);

  if (loading) return <p className="text-center p-6">Loading room details...</p>;
  if (error) return <p className="text-red-500 text-center p-6">{error}</p>;
  if (!room) return <p className="text-center p-6">No room found</p>;

  return (
    <div className="room-details-container p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/admin/rooms")}
        className="mb-6 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
      >
        Back to Room List
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Room Details: {room.title}</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p><strong>Title:</strong> {room.title}</p>
            <p><strong>Type:</strong> {room.type}</p>
            <p><strong>Limit:</strong> {room.limit}</p>
            <p><strong>Premium:</strong> {room.premium ? "Yes" : "No"}</p>
            <p><strong>Description:</strong> {room.description}</p>
          </div>
          <div>
            <p><strong>Created By:</strong> {room.createdBy.name} ({room.createdBy.email})</p>
            <p><strong>Created At:</strong> {new Date(room.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {room.isBlocked ? "Blocked" : "Active"}</p>
            <p><strong>Secret Code:</strong> {room.secretCode || "N/A"}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Participants</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">First Join</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Last Join</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Last Leave</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Total Duration (min)</th>
              </tr>
            </thead>
            <tbody>
              {room.participants.length > 0 ? (
                room.participants.map((participant, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">{participant.userId.name}</td>
                    <td className="px-4 py-3">{participant.userId.email}</td>
                    <td className="px-4 py-3">{new Date(participant.firstJoin).toLocaleString()}</td>
                    <td className="px-4 py-3">{new Date(participant.lastJoin).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {participant.lastLeave ? new Date(participant.lastLeave).toLocaleString() : "N/A"}
                    </td>
                    <td className="px-4 py-3">{Math.round(participant.totalDuration / 60000)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No participants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}