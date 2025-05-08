import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/store";
import { DirectCallManager } from "@/services/DirectCallManager"; // CHANGE: Import CallDetails
import { toast } from "react-hot-toast";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosInterceptor";
const DirectCallPage = () => {
    const { callId } = useParams();
    const navigate = useNavigate();
    const { userId } = useAppSelector((state) => state.user);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callDetails, setCallDetails] = useState(null);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const callManagerRef = useRef(null);
    const isCallActive = useRef(false);
    const pollingInterval = useRef(null);
    useEffect(() => {
        if (!userId || !callId) {
            console.log("Invalid userId or callId:", { userId, callId });
            toast.error("Please log in to join the call");
            navigate("/login");
            return;
        }
        const fetchCallDetails = async () => {
            try {
                const { data } = await axiosInstance.get(`/call/details?callId=${callId}`);
                console.log("call data from second tab", data);
                setCallDetails(data.call);
            }
            catch (error) {
                console.error("Error fetching call details:", error);
                toast.error("Failed to load call details");
                navigate("/friends");
            }
        };
        fetchCallDetails();
        pollingInterval.current = setInterval(fetchCallDetails, 5000);
        return () => {
            if (callManagerRef.current && callManagerRef.current.isCallActiveState()) {
                console.log("Cleaning up call on unmount:", callId);
                callManagerRef.current.endCall();
            }
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, [userId, callId, navigate]);
    useEffect(() => {
        if (callDetails && !callManagerRef.current) {
            // CHANGE: Initialize DirectCallManager with callDetails
            callManagerRef.current = new DirectCallManager(callId, userId, callDetails, (local, remote) => {
                console.log("Stream update:", { local: !!local, remote: !!remote });
                // alert(remote?"Yes":"NO")
                setLocalStream(local);
                setRemoteStream(remote);
            });
        }
        if (callDetails && callManagerRef.current) {
            console.log("Call details updated:", callDetails);
            if (callDetails.status === "MISSED" || callDetails.status === "REJECTED" || callDetails.status === "COMPLETED") {
                console.log(`Call is ${callDetails.status}, redirecting to friends`);
                toast.error(`Call was ${callDetails.status.toLowerCase()}`);
                callManagerRef.current.endCall();
                navigate("/friends");
                if (pollingInterval.current) {
                    clearInterval(pollingInterval.current);
                }
                return;
            }
            if (callDetails.callerId === userId && callDetails.status === "INITIATED") {
                console.log("Starting call as caller:", callId);
                callManagerRef.current.startCall();
                isCallActive.current = true;
            }
            else if (callDetails.receiverId === userId && callDetails.status === "ACCEPTED") {
                console.log("Accepting call as receiver:", callId);
                callManagerRef.current.acceptCall();
                isCallActive.current = true;
                if (pollingInterval.current) {
                    clearInterval(pollingInterval.current);
                }
            }
        }
    }, [callDetails, userId, callId]);
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
            localVideoRef.current.play().catch((e) => console.error("Local video play error:", e));
        }
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play().catch((e) => console.error("Remote video play error:", e));
        }
    }, [localStream, remoteStream]);
    const handleToggleVideo = () => {
        if (callManagerRef.current) {
            console.log("Toggling video:", !videoEnabled);
            setVideoEnabled(!videoEnabled);
            callManagerRef.current.toggleVideo(!videoEnabled);
        }
    };
    const handleToggleAudio = () => {
        if (callManagerRef.current) {
            console.log("Toggling audio:", !audioEnabled);
            setAudioEnabled(!audioEnabled);
            callManagerRef.current.toggleAudio(!audioEnabled);
        }
    };
    const handleEndCall = () => {
        if (callManagerRef.current && isCallActive.current) {
            console.log("Ending call manually:", callId);
            callManagerRef.current.endCall();
            isCallActive.current = false;
            navigate("/friends");
            toast.success("Call ended");
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        }
    };
    const buttonVariants = {
        hover: { scale: 1.1, transition: { duration: 0.2 } },
        tap: { scale: 0.95 },
    };
    if (!callDetails) {
        return _jsx("div", { className: "min-h-screen bg-gray-900 text-white p-4", children: "Loading..." });
    }
    const otherUserId = callDetails.callerId === userId ? callDetails.receiverId : callDetails.callerId;
    return (_jsx("div", { className: "min-h-screen bg-gray-900 text-white p-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("h1", { className: "text-xl font-bold mb-4", children: ["Video Call with ", otherUserId] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "relative bg-gray-800 rounded-xl overflow-hidden aspect-video", children: [_jsx("video", { ref: localVideoRef, autoPlay: true, muted: true, className: "w-full h-full object-cover rounded-lg" }), _jsx("div", { className: "absolute bottom-0 left-0 bg-gradient-to-t from-black/80 p-2", children: _jsx("p", { className: "text-white font-medium", children: "You" }) }), !videoEnabled && (_jsx("div", { className: "absolute inset-0 bg-gray-700 flex items-center justify-center", children: _jsx("div", { className: "w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center", children: _jsx("span", { className: "text-2xl font-bold text-white", children: "You" }) }) }))] }), _jsxs("div", { className: "relative bg-gray-800 rounded-xl overflow-hidden aspect-video", children: [_jsx("video", { ref: remoteVideoRef, autoPlay: true, className: "w-full h-full object-cover rounded-lg" }), _jsx("div", { className: "absolute bottom-0 left-0 bg-gradient-to-t from-black/80 p-2", children: _jsx("p", { className: "text-white font-medium", children: otherUserId }) }), !remoteStream && (_jsx("div", { className: "absolute inset-0 bg-gray-700 flex items-center justify-center", children: _jsx("div", { className: "w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center", children: _jsx("span", { className: "text-2xl font-bold text-white", children: otherUserId[0].toUpperCase() }) }) }))] })] }), _jsxs("div", { className: "bg-gray-800 rounded-xl p-4 mt-4 flex justify-center gap-4", children: [_jsx(motion.button, { onClick: handleToggleVideo, className: `p-3 rounded-full ${videoEnabled ? "bg-red-600" : "bg-gray-700"} text-white`, variants: buttonVariants, whileHover: "hover", whileTap: "tap", title: videoEnabled ? "Turn Off Video" : "Turn On Video", children: videoEnabled ? _jsx(FaVideo, { size: 20 }) : _jsx(FaVideoSlash, { size: 20 }) }), _jsx(motion.button, { onClick: handleToggleAudio, className: `p-3 rounded-full ${audioEnabled ? "bg-blue-600" : "bg-gray-700"} text-white`, variants: buttonVariants, whileHover: "hover", whileTap: "tap", title: audioEnabled ? "Mute Audio" : "Unmute Audio", children: audioEnabled ? _jsx(FaMicrophone, { size: 20 }) : _jsx(FaMicrophoneSlash, { size: 20 }) }), _jsx(motion.button, { onClick: handleEndCall, className: "p-3 rounded-full bg-red-600 text-white", variants: buttonVariants, whileHover: "hover", whileTap: "tap", title: "End Call", children: _jsx(FaPhone, { size: 20 }) })] })] }) }));
};
export default DirectCallPage;
