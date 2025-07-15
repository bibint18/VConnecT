
"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { getRoomDetails, RoomDetailsResponse } from "@/services/roomService";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.03, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

export default function UserRoomDetails() {
  const { roomId } = useParams<{ roomId: string }>();
  console.log(roomId);
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomDetailsResponse["room"]| null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) return;
      try {
        const { room } = await getRoomDetails(roomId);
        setRoom(room);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch room details");
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  if (loading)
    return (
      <p className="!text-center !mt-8 !text-white !text-2xs sm:!text-xs md:!text-base">
        Loading room details...
      </p>
    );
  if (error)
    return (
      <p className="!text-red-500 !text-center !mt-8 !text-2xs sm:!text-xs md:!text-base">
        {error}
      </p>
    );
  if (!room)
    return (
      <p className="!text-center !mt-8 !text-white !text-2xs sm:!text-xs md:!text-base">
        No room found
      </p>
    );

  return (
    <div className="!bg-black !text-white !p-3 sm:!p-4 md:!p-6 !pl-20 sm:!pl-24 md:!pl-72 !min-h-screen">
      <div className="!max-w-full !w-full !mx-auto !max-w-4xl">
        <motion.div
          className="!mb-3 sm:!mb-4 md:!mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            onClick={() => navigate("/rooms")}
            className="!inline-flex !items-center !bg-indigo-600 !text-white !px-2 sm:!px-3 md:!px-4 !py-1 sm:!py-1.5 md:!py-2 !rounded-md !hover:bg-indigo-700 !transition !text-2xs sm:!text-xs md:!text-base"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Back to Room List
          </motion.button>
        </motion.div>

        <motion.div
          className="!bg-white !text-gray-800 !rounded-lg !shadow-lg !p-3 sm:!p-4 md:!p-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <div className="!flex !items-center !justify-between !mb-2 sm:!mb-3 md:!mb-4">
            <h1 className="!text-base sm:!text-lg md:!text-2xl !font-bold !italic">
              {room.title}
              {room.premium && (
                <span className="!ml-2 !text-yellow-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="!h-3 sm:!h-4 md:!h-5 !w-3 sm:!w-4 md:!w-5 !inline"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00 .951-.69l1.07-3.292z" />
                  </svg>
                </span>
              )}
            </h1>
          </div>

          <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-3 sm:!gap-4 md:!gap-6 !mb-3 sm:!mb-4 md:!mb-6">
            <div>
              <p className="!mb-1 sm:!mb-2 !text-2xs sm:!text-xs md:!text-base">
                <strong>Type:</strong>{" "}
                <span className="!inline-flex !items-center">
                  {room.type}
                  {room.type === "PUBLIC" ? (
                    <Unlock className="!h-2 sm:!h-3 md:!h-4 !w-2 sm:!w-3 md:!w-4 !ml-1 !text-gray-400" />
                  ) : (
                    <Lock className="!h-2 sm:!h-3 md:!h-4 !w-2 sm:!w-3 md:!w-4 !ml-1 !text-gray-400" />
                  )}
                </span>
              </p>
              <p className="!mb-1 sm:!mb-2 !text-2xs sm:!text-xs md:!text-base">
                <strong>Limit:</strong> {room.limit}
              </p>
              <p className="!mb-1 sm:!mb-2 !text-2xs sm:!text-xs md:!text-base">
                <strong>Premium:</strong> {room.premium ? "Yes" : "No"}
              </p>
              <p className="!mb-1 sm:!mb-2 !text-2xs sm:!text-xs md:!text-base">
                <strong>Description:</strong>{" "}
                <span className="!text-gray-600">{room.description}</span>
              </p>
            </div>
            <div>
              <p className="!mb-1 sm:!mb-2 !text-2xs sm:!text-xs md:!text-base">
                <strong>Created By:</strong> {room.createdByName} (
                {room.createdByEmail})
              </p>
              <p className="!mb-1 sm:!mb-2 !text-2xs sm:!text-xs md:!text-base">
                <strong>Created At:</strong>{" "}
                {new Date(room.createdAt).toLocaleString()}
              </p>
              {/* <p className="!mb-1 sm:!mb-2 !text-2xs sm:!text-xs md:!text-base">
                <strong>Status:</strong> {room.isBlocked ? "Blocked" : "Active"}
              </p> */}
              <p className="!mb-1 sm:!mb-2 !text-2xs sm:!text-xs md:!text-base">
                <strong>Secret Code:</strong> {room.secretCode || "N/A"}
              </p>
            </div>
          </div>

          <h2 className="!text-sm sm:!text-base md:!text-xl !font-semibold !italic !mb-2 sm:!mb-3 md:!mb-4">
            Participants
          </h2>
          <div className="!overflow-x-auto !max-w-full sm:!overflow-x-visible">
            <table className="!inline-block !w-[calc(100vw-5rem)] sm:!w-full !bg-gray-50 !rounded-lg !shadow-sm !text-[9px] sm:!text-xs md:!text-sm">
              <thead>
                <tr className="!bg-gray-200">
                  <th className="!px-0.5 sm:!px-1 md:!px-3 !py-0.25 sm:!py-0.5 md:!py-2 !text-left !text-[9px] sm:!text-xs md:!text-sm !font-semibold !min-w-[60px]">
                    Name
                  </th>
                  <th className="!px-0.5 sm:!px-1 md:!px-3 !py-0.25 sm:!py-0.5 md:!py-2 !text-left !text-[9px] sm:!text-xs md:!text-sm !font-semibold !min-w-[80px]">
                    Email
                  </th>
                  <th className="!px-0.5 sm:!px-1 md:!px-3 !py-0.25 sm:!py-0.5 md:!py-2 !text-left !text-[9px] sm:!text-xs md:!text-sm !font-semibold !min-w-[80px]">
                    Joined
                  </th>
                  <th className="!px-0.5 sm:!px-1 md:!px-3 !py-0.25 sm:!py-0.5 md:!py-2 !text-left !text-[9px] sm:!text-xs md:!text-sm !font-semibold !min-w-[80px]">
                    Rejoined
                  </th>
                  <th className="!px-0.5 sm:!px-1 md:!px-3 !py-0.25 sm:!py-0.5 md:!py-2 !text-left !text-[9px] sm:!text-xs md:!text-sm !font-semibold !min-w-[80px]">
                    Left
                  </th>
                  <th className="!px-0.5 sm:!px-1 md:!px-3 !py-0.25 sm:!py-0.5 md:!py-2 !text-left !text-[9px] sm:!text-xs md:!text-sm !font-semibold !min-w-[60px]">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {room.participants.length > 0 ? (
                  room.participants.map((participant, index) => (
                    <tr
                      key={index}
                      className="!border-b !last:border-0 !hover:bg-gray-100"
                    >
                      <td className="!px-0.5 sm:!px-1 md:!px-3 !py-0.25 sm:!py-0.5 md:!py-2 !text-[9px] sm:!text-xs md:!text-sm !truncate">
                        {participant.name}
                      </td>
                      <td className="!px-0.5 sm:!px-1 md:!px-3 !py-0.25 sm:!py-0.5 md:!py-2 !text-[9px] sm:!text-xs md:!text-sm !truncate">
                        {participant.email}
                      </td>
                      <td className="!px-0.5 sm:!px-1 md:!px-3 !py-0.25 sm:!py-0.5 md:!py-2 !text-[9px] sm:!text-xs md:!text-sm !truncate">
                        {new Date(participant.firstJoin).toLocaleString()}
                      </td>
                      <td className="!px-0.5 sm:!px-1 md:!px-3 !py-0.25 sm:!py-0.5 md:!py-2 !text-[9px] sm:!text-xs md:!text-sm !truncate">
                        {new Date(participant.lastJoin).toLocaleString()}
                      </td>
                      <td className="!px-0.5 sm:!px-1 md:!px-3 !py-0.25 sm:!py-0.5 md:!py-2 !text-[9px] sm:!text-xs md:!text-sm !truncate">
                        {participant.lastLeave
                          ? new Date(participant.lastLeave).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="!px-0.5 sm:!px-1 md:!px-3 !py-0.25 sm:!py-0.5 md:!py-2 !text-[9px] sm:!text-xs md:!text-sm">
                        {Math.round(participant.totalDuration / 60000)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="!text-center !py-1 sm:!py-2 md:!py-4 !text-gray-500 !text-[9px] sm:!text-xs md:!text-sm"
                    >
                      No participants found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}