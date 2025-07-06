import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CallManager } from "@/services/CallManager";
import { useAppSelector } from "@/redux/store";
import { toast } from "react-toastify";
import { getFriends } from "@/services/FriendService";
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhone,
  FaUserPlus,
  FaUsers,
  FaCog,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const RoomCall: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [streams, setStreams] = useState<
    Map<string, { stream: MediaStream; username: string }>
  >(new Map());
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [friends, setFriends] = useState<string[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const callManagerRef = useRef<CallManager | null>(null);
  const { userId, isAuthenticated, name } = useAppSelector(
    (state) => state.user
  );
  const username = name;
  const [showSettings, setShowSettings] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);

  useEffect(() => {
    if (!roomId || !isAuthenticated || !userId || !username) {
      if (!isAuthenticated || !userId) {
        toast.error("Please log in to join the call");
        navigate("/login");
      }
      return;
    }

    const fetchFriends = async () => {
      try {
        const friendList = await getFriends();
        console.log("friends from frontend", friendList);
        setFriends(friendList.map((f) => f.id));
      } catch (err) {
        console.error("Failed to fetch friends:", err);
        toast.error("Failed to load friends list");
      } finally {
        setIsLoadingFriends(false);
      }
    };

    fetchFriends();

    const manager = new CallManager(roomId, userId, username, (newStreams) =>
      setStreams(new Map(newStreams))
    );
    callManagerRef.current = manager;
    manager.startCall();

    manager.getAudioDevices().then((devices) => {
      setAudioDevices(devices);
      if (devices.length > 0) setSelectedAudioDevice(devices[0].deviceId);
    });

    return () => {
      if (callManagerRef.current) {
        callManagerRef.current.leaveCall();
      }
    };
  }, [roomId, userId, isAuthenticated, username, navigate]);

  useEffect(() => {
    console.log("Streams in RoomCall:", Array.from(streams.entries()));
    streams.forEach(({ stream }, streamUserId) => {
      const video = videoRefs.current.get(streamUserId);
      if (!video) {
        const newVideo = document.createElement("video");
        newVideo.muted = streamUserId === userId; // Mute self
        newVideo.autoplay = true;
        newVideo.playsInline = true;
        newVideo.className = "!w-full !h-full !object-cover !rounded-lg";
        videoRefs.current.set(streamUserId, newVideo);
        const container = document.getElementById(
          `video-container-${streamUserId}`
        );
        if (container) container.appendChild(newVideo);
      }
      const existingVideo = videoRefs.current.get(streamUserId)!;
      if (existingVideo.srcObject !== stream) {
        existingVideo.srcObject = stream;
        console.log("Set srcObject for:", streamUserId);
        existingVideo
          .play()
          .catch((err) =>
            console.error("Video play error for", streamUserId, ":", err)
          );
      }
    });

    // Clean up removed streams
    videoRefs.current.forEach((video, vidUserId) => {
      if (!streams.has(vidUserId)) {
        video.remove();
        videoRefs.current.delete(vidUserId);
      }
    });
  }, [streams, userId]);

  const handleToggleVideo = () => {
    if (callManagerRef.current) {
      setVideoEnabled(!videoEnabled);
      callManagerRef.current.toggleVideo(!videoEnabled);
    }
  };

  const handleToggleAudio = () => {
    if (callManagerRef.current) {
      setAudioEnabled(!audioEnabled);
      callManagerRef.current.toggleAudio(!audioEnabled);
    }
  };

  const handleLeaveCall = () => {
    if (callManagerRef.current) {
      callManagerRef.current.leaveCall();
      navigate("/rooms");
      toast.success("Left the call");
    }
  };

  const handleAudioDeviceChange = (deviceId: string) => {
    if (callManagerRef.current) {
      setSelectedAudioDevice(deviceId);
      callManagerRef.current.switchAudioDevice(deviceId);
    }
  };

  const handlePlusButtonClick = (
    participantId: string,
    participantName: string
  ) => {
    if (callManagerRef.current && participantId !== userId) {
      callManagerRef.current.sendFriendRequest(participantId);
      console.log(participantName);
    } else {
      toast.error("Cannot send friend request to yourself");
    }
  };

  // Animation variants
  const buttonVariants = {
    hover: {
      scale: 1.1,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const videoVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  const participantsVariants = {
    hidden: {
      x: "100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    mobileHidden: {
      y: "100%",
      opacity: 0,
    },
    mobileVisible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const getVideoGridClass = () => {
    const count = streams.size;
    if (count === 1) return "!grid-cols-1";
    if (count === 2) return "md:!grid-cols-2 !grid-cols-1";
    if (count === 3) return "sm:!grid-cols-2 !grid-cols-2 !auto-rows-fr"; 
    if (count === 4) return "!grid-cols-2"; 
    return "lg:!grid-cols-3 !grid-cols-2"; 
  };

  return (
    <div className="!min-h-screen !bg-black !text-white !p-4 sm:!p-6">
      <style>
        {`
          /* Small screens: Adjust grid for 1-2 users */
          @media (max-width: 767px) {
            .video-grid-container {
              display: flex !important;
              flex-direction: column !important;
              overflow: hidden !important;
            }
            .video-grid-item {
              width: 100% !important;
              height: auto !important;
              aspect-ratio: 16 / 9 !important;
              margin-bottom: 0.75rem !important;
            }
            /* For 3 users, override to grid with 3 columns */
            .video-grid-container:has(.video-grid-item:nth-child(3):not(:nth-child(n+4))) {
              display: grid !important;
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            }
            .video-grid-container:has(.video-grid-item:nth-child(3):not(:nth-child(n+4))) .video-grid-item {
              min-height: 200px !important; //here
              aspect-ratio: 16 / 9 !important;
              margin-bottom: 0.75rem !important;
            }
            /* For 4+ users, override to grid with 2 columns and increased height */
            .video-grid-container:has(.video-grid-item:nth-child(4)) {
              display: grid !important;
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
            .video-grid-container:has(.video-grid-item:nth-child(4)) .video-grid-item {
              min-height: 200px !important;
              aspect-ratio: 16 / 9 !important;
              margin-bottom: 0.75rem !important;
            }
          }
          /* Larger screens: Use grid layout */
          @media (min-width: 768px) {
            .video-grid-container {
              display: grid !important;
              overflow: hidden !important;
            }
            .video-grid-item {
              width: 100% !important;
              height: 100% !important;
              aspect-ratio: 16 / 9 !important;
            }
          }
        `}
      </style>
      <div className="!max-w-7xl !mx-auto !flex !flex-col lg:!flex-row !gap-4 sm:!gap-6 !h-[calc(100vh-2rem)] sm:!h-[calc(100vh-3rem)]">
        {/* Main video area */}
        <div className="!flex-1 !flex !flex-col !h-full">
          <div className="!bg-gray-900 !rounded-xl !p-3 sm:!p-4 !mb-4 !shadow-lg !border !border-gray-700">
            <h1 className="!text-lg sm:!text-xl !font-bold !flex !items-center !gap-2">
              <FaVideo className="!text-gray-200" /> Room: {roomId}
            </h1>
          </div>

          {/* Video grid */}
          <div
            className={`video-grid-container ${getVideoGridClass()} !gap-3 sm:!gap-4 !flex-1 !h-full !rounded-xl`}
          >
            {Array.from(streams.entries()).map(
              ([streamUserId, { username }], index) => (
                <motion.div
                  key={streamUserId}
                  className={`video-grid-item !relative !bg-gray-900 !rounded-xl !overflow-hidden !aspect-video !shadow-lg !border-2 !border-white ${
                    (streams.size === 3 && index === 2 && window.innerWidth >= 768) || 
                    (streams.size % 2 === 1 && index === streams.size - 1)
                      ? "!col-start-1 !col-span-2 !mx-auto !w-1/2"
                      : ""
                  }`} // Center the last user if odd count on larger screens
                  variants={videoVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <div
                    id={`video-container-${streamUserId}`}
                    className="!w-full !h-full"
                  />
                  <div className="!absolute !bottom-0 !left-0 !right-0 !bg-gradient-to-t !from-black/80 !to-transparent !p-2 sm:!p-3">
                    <p className="!text-white !font-medium !text-sm sm:!text-base">
                      {username} {streamUserId === userId && "(You)"}
                    </p>
                  </div>
                  {!videoEnabled && streamUserId === userId && (
                    <div className="!absolute !inset-0 !bg-gray-800 !flex !items-center !justify-center">
                      <div className="!w-16 sm:!w-24 !h-16 sm:!h-24 !rounded-full !bg-gray-700 !flex !items-center !justify-center">
                        <span className="!text-xl sm:!text-2xl !font-bold !text-white">
                          {username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            )}
          </div>

          {/* Controls */}
          <div className="!bg-gray-900 !rounded-xl !p-3 sm:!p-4 !mt-4 !shadow-lg !border !border-gray-700">
            <div className="!flex !justify-center !gap-3 sm:!gap-4">
              <motion.button
                onClick={handleToggleVideo}
                className={`!p-2 sm:!p-3 !rounded-full !bg-white !text-black !flex !items-center !justify-center !shadow-md hover:!bg-gray-200 !transition-all !duration-200`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                title={videoEnabled ? "Turn Off Video" : "Turn On Video"}
              >
                {videoEnabled ? (
                  <FaVideo size={20} className="!text-black" />
                ) : (
                  <FaVideoSlash size={20} className="!text-black" />
                )}
              </motion.button>

              <motion.button
                onClick={handleToggleAudio}
                className={`!p-2 sm:!p-3 !rounded-full !bg-white !text-black !flex !items-center !justify-center !shadow-md hover:!bg-gray-200 !transition-all !duration-200`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                title={audioEnabled ? "Mute Audio" : "Unmute Audio"}
              >
                {audioEnabled ? (
                  <FaMicrophone size={20} className="!text-black" />
                ) : (
                  <FaMicrophoneSlash size={20} className="!text-black" />
                )}
              </motion.button>

              <motion.button
                onClick={() => setShowSettings(!showSettings)}
                className={`!p-2 sm:!p-3 !rounded-full !bg-white !text-black !flex !items-center !justify-center !shadow-md hover:!bg-gray-200 !transition-all !duration-200`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                title="Settings"
              >
                <FaCog size={20} className="!text-black" />
              </motion.button>

              <motion.button
                onClick={handleLeaveCall}
                className="!p-2 sm:!p-3 !rounded-full !bg-white !text-black !flex !items-center !justify-center !shadow-md hover:!bg-gray-200 !transition-all !duration-200"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                title="Leave Call"
              >
                <FaPhone size={20} className="!text-black" />
              </motion.button>

              <motion.button
                onClick={() => setShowParticipants(!showParticipants)}
                className="!p-2 sm:!p-3 !rounded-full !bg-white !text-black !flex !items-center !justify-center !shadow-md hover:!bg-gray-200 !transition-all !duration-200 lg:!hidden"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                title={showParticipants ? "Hide Participants" : "Show Participants"}
              >
                {showParticipants ? (
                  <FaArrowLeft size={20} className="!text-black" />
                ) : (
                  <FaArrowRight size={20} className="!text-black" />
                )}
              </motion.button>
            </div>

            {/* Settings panel */}
            {showSettings && (
              <motion.div
                className="!mt-4 !p-4 !bg-gray-800 !rounded-lg !shadow-md !border !border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="!mb-4">
                  <label
                    htmlFor="audio-device"
                    className="!block !text-sm !font-medium !mb-2 !flex !items-center !gap-2 !text-gray-200"
                  >
                    <FaMicrophone className="!text-gray-300" /> Microphone
                  </label>
                  <select
                    id="audio-device"
                    value={selectedAudioDevice}
                    onChange={(e) => handleAudioDeviceChange(e.target.value)}
                    className="!w-full !p-2 !bg-gray-900 !border !border-gray-700 !rounded-md !text-white focus:!ring-gray-500 focus:!border-gray-500"
                  >
                    {audioDevices.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label ||
                          `Microphone ${device.deviceId.slice(0, 5)}`}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Participants sidebar */}
        <motion.div
          className={`!fixed lg:!static !top-0 !right-0 !h-full lg:!h-fit !w-full sm:!w-80 !bg-gray-900 !rounded-xl !p-4 !shadow-lg lg:!shadow-md !z-50 lg:!flex lg:!flex-col !transform lg:!transform-none ${
            showParticipants ? "!block" : "!hidden lg:!block"
          }`}
          variants={participantsVariants}
          initial={{ x: "100%", y: "100%" }}
          animate={
            showParticipants
              ? { x: 0, y: 0 }
              : { x: "100%", y: "100%" }
          }
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="!flex !items-center !justify-between !mb-4">
            <div className="!flex !items-center !gap-2">
              <FaUsers className="!text-gray-300" />
              <h2 className="!text-lg !font-bold !text-white">
                Participants ({streams.size})
              </h2>
            </div>
            <motion.button
              onClick={() => setShowParticipants(false)}
              className="!p-2 !rounded-full !bg-white !text-black !flex !items-center !justify-center lg:!hidden !shadow-md hover:!bg-gray-200 !transition-all !duration-200"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaArrowLeft size={16} className="!text-black" />
            </motion.button>
          </div>

          <ul className="!space-y-2 !max-h-[calc(100vh-8rem)] !overflow-y-auto">
            {isLoadingFriends ? (
              <li className="!text-gray-400 !text-center !py-4">
                Loading participants...
              </li>
            ) : (
              Array.from(streams.entries()).map(
                ([participantId, { username }]) => {
                  console.log(
                    "Participant ID:",
                    participantId,
                    "Friends:",
                    friends,
                    "Is Friend:",
                    friends.includes(participantId)
                  );
                  return (
                    <li
                      key={participantId}
                      className="!flex !justify-between !items-center !p-3 !bg-gray-800 !rounded-lg !shadow-sm !border !border-gray-700"
                    >
                      <div className="!flex !items-center !gap-3">
                        <div className="!w-8 !h-8 !rounded-full !bg-gray-700 !flex !items-center !justify-center">
                          <span className="!text-sm !font-bold !text-white">
                            {username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="!font-medium !text-gray-200">
                          {username} {participantId === userId && "(You)"}
                        </span>
                      </div>
                      {participantId !== userId &&
                        !friends.includes(participantId) && (
                          <motion.button
                            onClick={() =>
                              handlePlusButtonClick(participantId, username)
                            }
                            className="!text-gray-300 hover:!text-gray-100 !p-1 !rounded-full"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            title="Add friend"
                          >
                            <FaUserPlus size={16} />
                          </motion.button>
                        )}
                    </li>
                  );
                }
              )
            )}
            {streams.size === 0 && !isLoadingFriends && (
              <li className="!text-gray-400 !text-center !py-4">
                No other participants yet
              </li>
            )}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default RoomCall;