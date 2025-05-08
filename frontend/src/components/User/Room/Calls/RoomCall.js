import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CallManager } from "@/services/CallManager";
import { useAppSelector } from "@/redux/store";
import { toast } from "react-toastify";
import { getFriends } from "@/services/FriendService";
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhone, FaUserPlus, FaUsers, FaCog, FaArrowLeft, FaArrowRight, } from "react-icons/fa";
const RoomCall = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [streams, setStreams] = useState(new Map());
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [audioDevices, setAudioDevices] = useState([]);
    const [selectedAudioDevice, setSelectedAudioDevice] = useState("");
    const [friends, setFriends] = useState([]);
    const [showParticipants, setShowParticipants] = useState(false);
    const videoRefs = useRef(new Map());
    const callManagerRef = useRef(null);
    const { userId, isAuthenticated, name } = useAppSelector((state) => state.user);
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
            }
            catch (err) {
                console.error("Failed to fetch friends:", err);
                toast.error("Failed to load friends list");
            }
            finally {
                setIsLoadingFriends(false);
            }
        };
        fetchFriends();
        const manager = new CallManager(roomId, userId, username, (newStreams) => setStreams(new Map(newStreams)));
        callManagerRef.current = manager;
        manager.startCall();
        manager.getAudioDevices().then((devices) => {
            setAudioDevices(devices);
            if (devices.length > 0)
                setSelectedAudioDevice(devices[0].deviceId);
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
                const container = document.getElementById(`video-container-${streamUserId}`);
                if (container)
                    container.appendChild(newVideo);
            }
            const existingVideo = videoRefs.current.get(streamUserId);
            if (existingVideo.srcObject !== stream) {
                existingVideo.srcObject = stream;
                console.log("Set srcObject for:", streamUserId);
                existingVideo
                    .play()
                    .catch((err) => console.error("Video play error for", streamUserId, ":", err));
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
    const handleAudioDeviceChange = (deviceId) => {
        if (callManagerRef.current) {
            setSelectedAudioDevice(deviceId);
            callManagerRef.current.switchAudioDevice(deviceId);
        }
    };
    const handlePlusButtonClick = (participantId, participantName) => {
        if (callManagerRef.current && participantId !== userId) {
            callManagerRef.current.sendFriendRequest(participantId);
            console.log(participantName);
        }
        else {
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
        visible: (i) => ({
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
        if (count === 1)
            return "!grid-cols-1";
        if (count === 2)
            return "md:!grid-cols-2 !grid-cols-1"; // 2 users: 1 per row on small screens, 2 per row on larger screens
        if (count === 3)
            return "sm:!grid-cols-2 !grid-cols-2 !auto-rows-fr"; // 3 users: 3 per row on small screens, 2+1 on medium/large screens
        if (count === 4)
            return "!grid-cols-2"; // 4 users: 2 per row (all screen sizes)
        return "lg:!grid-cols-3 !grid-cols-2"; // 5+ users: 2 per row on small/medium screens, 3 per row on large screens
    };
    return (_jsxs("div", { className: "!min-h-screen !bg-black !text-white !p-4 sm:!p-6", children: [_jsx("style", { children: `
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
        ` }), _jsxs("div", { className: "!max-w-7xl !mx-auto !flex !flex-col lg:!flex-row !gap-4 sm:!gap-6 !h-[calc(100vh-2rem)] sm:!h-[calc(100vh-3rem)]", children: [_jsxs("div", { className: "!flex-1 !flex !flex-col !h-full", children: [_jsx("div", { className: "!bg-gray-900 !rounded-xl !p-3 sm:!p-4 !mb-4 !shadow-lg !border !border-gray-700", children: _jsxs("h1", { className: "!text-lg sm:!text-xl !font-bold !flex !items-center !gap-2", children: [_jsx(FaVideo, { className: "!text-gray-200" }), " Room: ", roomId] }) }), _jsx("div", { className: `video-grid-container ${getVideoGridClass()} !gap-3 sm:!gap-4 !flex-1 !h-full !rounded-xl`, children: Array.from(streams.entries()).map(([streamUserId, { username }], index) => (_jsxs(motion.div, { className: `video-grid-item !relative !bg-gray-900 !rounded-xl !overflow-hidden !aspect-video !shadow-lg !border-2 !border-white ${(streams.size === 3 && index === 2 && window.innerWidth >= 768) ||
                                        (streams.size % 2 === 1 && index === streams.size - 1)
                                        ? "!col-start-1 !col-span-2 !mx-auto !w-1/2"
                                        : ""}`, variants: videoVariants, initial: "hidden", animate: "visible", custom: index, children: [_jsx("div", { id: `video-container-${streamUserId}`, className: "!w-full !h-full" }), _jsx("div", { className: "!absolute !bottom-0 !left-0 !right-0 !bg-gradient-to-t !from-black/80 !to-transparent !p-2 sm:!p-3", children: _jsxs("p", { className: "!text-white !font-medium !text-sm sm:!text-base", children: [username, " ", streamUserId === userId && "(You)"] }) }), !videoEnabled && streamUserId === userId && (_jsx("div", { className: "!absolute !inset-0 !bg-gray-800 !flex !items-center !justify-center", children: _jsx("div", { className: "!w-16 sm:!w-24 !h-16 sm:!h-24 !rounded-full !bg-gray-700 !flex !items-center !justify-center", children: _jsx("span", { className: "!text-xl sm:!text-2xl !font-bold !text-white", children: username?.charAt(0).toUpperCase() }) }) }))] }, streamUserId))) }), _jsxs("div", { className: "!bg-gray-900 !rounded-xl !p-3 sm:!p-4 !mt-4 !shadow-lg !border !border-gray-700", children: [_jsxs("div", { className: "!flex !justify-center !gap-3 sm:!gap-4", children: [_jsx(motion.button, { onClick: handleToggleVideo, className: `!p-2 sm:!p-3 !rounded-full !bg-white !text-black !flex !items-center !justify-center !shadow-md hover:!bg-gray-200 !transition-all !duration-200`, variants: buttonVariants, whileHover: "hover", whileTap: "tap", title: videoEnabled ? "Turn Off Video" : "Turn On Video", children: videoEnabled ? (_jsx(FaVideo, { size: 20, className: "!text-black" })) : (_jsx(FaVideoSlash, { size: 20, className: "!text-black" })) }), _jsx(motion.button, { onClick: handleToggleAudio, className: `!p-2 sm:!p-3 !rounded-full !bg-white !text-black !flex !items-center !justify-center !shadow-md hover:!bg-gray-200 !transition-all !duration-200`, variants: buttonVariants, whileHover: "hover", whileTap: "tap", title: audioEnabled ? "Mute Audio" : "Unmute Audio", children: audioEnabled ? (_jsx(FaMicrophone, { size: 20, className: "!text-black" })) : (_jsx(FaMicrophoneSlash, { size: 20, className: "!text-black" })) }), _jsx(motion.button, { onClick: () => setShowSettings(!showSettings), className: `!p-2 sm:!p-3 !rounded-full !bg-white !text-black !flex !items-center !justify-center !shadow-md hover:!bg-gray-200 !transition-all !duration-200`, variants: buttonVariants, whileHover: "hover", whileTap: "tap", title: "Settings", children: _jsx(FaCog, { size: 20, className: "!text-black" }) }), _jsx(motion.button, { onClick: handleLeaveCall, className: "!p-2 sm:!p-3 !rounded-full !bg-white !text-black !flex !items-center !justify-center !shadow-md hover:!bg-gray-200 !transition-all !duration-200", variants: buttonVariants, whileHover: "hover", whileTap: "tap", title: "Leave Call", children: _jsx(FaPhone, { size: 20, className: "!text-black" }) }), _jsx(motion.button, { onClick: () => setShowParticipants(!showParticipants), className: "!p-2 sm:!p-3 !rounded-full !bg-white !text-black !flex !items-center !justify-center !shadow-md hover:!bg-gray-200 !transition-all !duration-200 lg:!hidden", variants: buttonVariants, whileHover: "hover", whileTap: "tap", title: showParticipants ? "Hide Participants" : "Show Participants", children: showParticipants ? (_jsx(FaArrowLeft, { size: 20, className: "!text-black" })) : (_jsx(FaArrowRight, { size: 20, className: "!text-black" })) })] }), showSettings && (_jsx(motion.div, { className: "!mt-4 !p-4 !bg-gray-800 !rounded-lg !shadow-md !border !border-gray-700", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: _jsxs("div", { className: "!mb-4", children: [_jsxs("label", { htmlFor: "audio-device", className: "!block !text-sm !font-medium !mb-2 !flex !items-center !gap-2 !text-gray-200", children: [_jsx(FaMicrophone, { className: "!text-gray-300" }), " Microphone"] }), _jsx("select", { id: "audio-device", value: selectedAudioDevice, onChange: (e) => handleAudioDeviceChange(e.target.value), className: "!w-full !p-2 !bg-gray-900 !border !border-gray-700 !rounded-md !text-white focus:!ring-gray-500 focus:!border-gray-500", children: audioDevices.map((device) => (_jsx("option", { value: device.deviceId, children: device.label ||
                                                            `Microphone ${device.deviceId.slice(0, 5)}` }, device.deviceId))) })] }) }))] })] }), _jsxs(motion.div, { className: `!fixed lg:!static !top-0 !right-0 !h-full lg:!h-fit !w-full sm:!w-80 !bg-gray-900 !rounded-xl !p-4 !shadow-lg lg:!shadow-md !z-50 lg:!flex lg:!flex-col !transform lg:!transform-none ${showParticipants ? "!block" : "!hidden lg:!block"}`, variants: participantsVariants, initial: { x: "100%", y: "100%" }, animate: showParticipants
                            ? { x: 0, y: 0 }
                            : { x: "100%", y: "100%" }, transition: { duration: 0.4, ease: "easeOut" }, children: [_jsxs("div", { className: "!flex !items-center !justify-between !mb-4", children: [_jsxs("div", { className: "!flex !items-center !gap-2", children: [_jsx(FaUsers, { className: "!text-gray-300" }), _jsxs("h2", { className: "!text-lg !font-bold !text-white", children: ["Participants (", streams.size, ")"] })] }), _jsx(motion.button, { onClick: () => setShowParticipants(false), className: "!p-2 !rounded-full !bg-white !text-black !flex !items-center !justify-center lg:!hidden !shadow-md hover:!bg-gray-200 !transition-all !duration-200", variants: buttonVariants, whileHover: "hover", whileTap: "tap", children: _jsx(FaArrowLeft, { size: 16, className: "!text-black" }) })] }), _jsxs("ul", { className: "!space-y-2 !max-h-[calc(100vh-8rem)] !overflow-y-auto", children: [isLoadingFriends ? (_jsx("li", { className: "!text-gray-400 !text-center !py-4", children: "Loading participants..." })) : (Array.from(streams.entries()).map(([participantId, { username }]) => {
                                        console.log("Participant ID:", participantId, "Friends:", friends, "Is Friend:", friends.includes(participantId));
                                        return (_jsxs("li", { className: "!flex !justify-between !items-center !p-3 !bg-gray-800 !rounded-lg !shadow-sm !border !border-gray-700", children: [_jsxs("div", { className: "!flex !items-center !gap-3", children: [_jsx("div", { className: "!w-8 !h-8 !rounded-full !bg-gray-700 !flex !items-center !justify-center", children: _jsx("span", { className: "!text-sm !font-bold !text-white", children: username?.charAt(0).toUpperCase() }) }), _jsxs("span", { className: "!font-medium !text-gray-200", children: [username, " ", participantId === userId && "(You)"] })] }), participantId !== userId &&
                                                    !friends.includes(participantId) && (_jsx(motion.button, { onClick: () => handlePlusButtonClick(participantId, username), className: "!text-gray-300 hover:!text-gray-100 !p-1 !rounded-full", variants: buttonVariants, whileHover: "hover", whileTap: "tap", title: "Add friend", children: _jsx(FaUserPlus, { size: 16 }) }))] }, participantId));
                                    })), streams.size === 0 && !isLoadingFriends && (_jsx("li", { className: "!text-gray-400 !text-center !py-4", children: "No other participants yet" }))] })] })] })] }));
};
export default RoomCall;
