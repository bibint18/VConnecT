
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CallManager } from '@/services/CallManager';
import { useAppSelector } from '@/redux/store';
import { toast } from 'react-toastify';
import { getFriends } from '@/services/FriendService';
import { 
  FaVideo, 
  FaVideoSlash, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaPhone, 
  FaUserPlus,
  FaUsers,
  FaCog
} from 'react-icons/fa';

const RoomCall: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [streams, setStreams] = useState<Map<string, { stream: MediaStream; username: string }>>(new Map());
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const [friends, setFriends] = useState<string[]>([]);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const callManagerRef = useRef<CallManager | null>(null);
  const { userId, isAuthenticated, name } = useAppSelector((state) => state.user);
  const username = name;
  const [showSettings, setShowSettings] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);
  useEffect(() => {
    if (!roomId || !isAuthenticated || !userId || !username) {
      if (!isAuthenticated || !userId) {
        toast.error('Please log in to join the call');
        navigate('/login');
      }
      return;
    }

    const fetchFriends = async () => {
      try {
        const friendList = await getFriends();
        console.log("friends from frontend",friendList)
        setFriends(friendList.map(f => f.id));
      } catch (err) {
        console.error("Failed to fetch friends:", err);
        toast.error("Failed to load friends list");
      }finally{
        setIsLoadingFriends(false)
      }
    };

    fetchFriends()

    const manager = new CallManager(roomId, userId, username, (newStreams) => setStreams(new Map(newStreams)));
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
    console.log('Streams in RoomCall:', Array.from(streams.entries()));
    streams.forEach(({ stream }, streamUserId) => {
      const video = videoRefs.current.get(streamUserId);
      if (!video) {
        const newVideo = document.createElement('video');
        newVideo.muted = streamUserId === userId; // Mute self
        newVideo.autoplay = true;
        newVideo.playsInline = true;
        newVideo.className = 'w-full h-full object-cover rounded-lg';
        videoRefs.current.set(streamUserId, newVideo);
        const container = document.getElementById(`video-container-${streamUserId}`);
        if (container) container.appendChild(newVideo);
      }
      const existingVideo = videoRefs.current.get(streamUserId)!;
      if (existingVideo.srcObject !== stream) {
        existingVideo.srcObject = stream;
        console.log('Set srcObject for:', streamUserId);
        existingVideo.play().catch((err) => console.error('Video play error for', streamUserId, ':', err));
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
      navigate('/rooms');
      toast.success('Left the call');
    }
  };

  const handleAudioDeviceChange = (deviceId: string) => {
    if (callManagerRef.current) {
      setSelectedAudioDevice(deviceId);
      callManagerRef.current.switchAudioDevice(deviceId);
    }
  };

  const handlePlusButtonClick = (participantId: string, participantName: string) => {
    if (callManagerRef.current && participantId !== userId) {
      callManagerRef.current.sendFriendRequest(participantId);
      console.log(participantName);
    } else {
      toast.error("Cannot send friend request to yourself");
    }
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };


  const getVideoGridClass = () => {
    const count = streams.size;
    if (count <= 1) return 'grid-cols-1';
    if (count <= 4) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Main video area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-800 rounded-xl p-4 mb-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FaVideo className="text-blue-400" /> Room: {roomId}
            </h1>
          </div>

          {/* Video grid */}
          <div className={`grid ${getVideoGridClass()} gap-4 flex-1`}>
            {Array.from(streams.entries()).map(([streamUserId, { username }]) => (
              <div key={streamUserId} className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video">
                <div id={`video-container-${streamUserId}`} className="w-full h-full" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-white font-medium">
                    {username} {streamUserId === userId && '(You)'}
                  </p>
                </div>
                {!videoEnabled && streamUserId === userId && (
                  <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="bg-gray-800 rounded-xl p-4 mt-4">
            <div className="flex justify-center gap-4">
              <motion.button
                onClick={handleToggleVideo}
                className={`p-3 rounded-full ${videoEnabled ? 'bg-red-600' : 'bg-gray-700'} text-white flex items-center justify-center`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                title={videoEnabled ? 'Turn Off Video' : 'Turn On Video'}
              >
                {videoEnabled ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
              </motion.button>

              <motion.button
                onClick={handleToggleAudio}
                className={`p-3 rounded-full ${audioEnabled ? 'bg-blue-600' : 'bg-gray-700'} text-white flex items-center justify-center`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                title={audioEnabled ? 'Mute Audio' : 'Unmute Audio'}
              >
                {audioEnabled ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
              </motion.button>

              <motion.button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-3 rounded-full ${showSettings ? 'bg-blue-600' : 'bg-gray-700'} text-white flex items-center justify-center`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                title="Settings"
              >
                <FaCog size={20} />
              </motion.button>

              <motion.button
                onClick={handleLeaveCall}
                className="p-3 rounded-full bg-red-600 text-white flex items-center justify-center"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                title="Leave Call"
              >
                <FaPhone size={20} />
              </motion.button>
            </div>

            {/* Settings panel */}
            {showSettings && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <div className="mb-4">
                  <label htmlFor="audio-device" className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FaMicrophone /> Microphone
                  </label>
                  <select
                    id="audio-device"
                    value={selectedAudioDevice}
                    onChange={(e) => handleAudioDeviceChange(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                  >
                    {audioDevices.map(device => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Participants sidebar */}
        <div className="lg:w-80 bg-gray-800 rounded-xl p-4 h-fit lg:sticky lg:top-4">
          <div className="flex items-center gap-2 mb-4">
            <FaUsers className="text-blue-400" />
            <h2 className="text-lg font-bold">Participants ({streams.size})</h2>
          </div>
          
          {/* <ul className="space-y-2">
            {Array.from(streams.entries()).map(([participantId, { username }]) => (
              
              <li key={participantId} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">
                    {username} {participantId === userId && '(You)'}
                  </span>
                </div>
                {/* {participantId !== userId &&   (
                  <motion.button
                    onClick={() => handlePlusButtonClick(participantId, username)}
                    className="text-blue-400 hover:text-blue-300 p-1 rounded-full"
                    variants={{ hover: { scale: 1.1 }, tap: { scale: 0.95 } }}
                    whileHover="hover"
                    whileTap="tap"
                    title="Add friend"
                  >
                    <FaUserPlus />
                  </motion.button>
                )} 

{participantId !== userId && !friends.includes(participantId) && (
                  <motion.button
                    onClick={() => handlePlusButtonClick(participantId, username)}
                    className="text-blue-400 hover:text-blue-300 p-1 rounded-full"
                    variants={{ hover: { scale: 1.1 }, tap: { scale: 0.95 } }}
                    whileHover="hover"
                    whileTap="tap"
                    title="Add friend"
                  >
                    <FaUserPlus />
                  </motion.button>
                )}
              </li>
            ))}
            {streams.size === 0 && (
              <li className="text-gray-400 text-center py-4">No other participants yet</li>
            )}
          </ul> */}



<ul className="space-y-2">
  {isLoadingFriends ? (
    <li className="text-gray-400 text-center py-4">Loading participants...</li>
  ) : (
    Array.from(streams.entries()).map(([participantId, { username }]) => {
      console.log("Participant ID:", participantId, "Friends:", friends, "Is Friend:", friends.includes(participantId));
      return (
        <li key={participantId} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-sm font-bold">
                {username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-medium">
              {username} {participantId === userId && '(You)'}
            </span>
          </div>
          {participantId !== userId && !friends.includes(participantId) && (
            <motion.button
              onClick={() => handlePlusButtonClick(participantId, username)}
              className="text-blue-400 hover:text-blue-300 p-1 rounded-full"
              variants={{ hover: { scale: 1.1 }, tap: { scale: 0.95 } }}
              whileHover="hover"
              whileTap="tap"
              title="Add friend"
            >
              <FaUserPlus />
            </motion.button>
          )}
        </li>
      );
    })
  )}
  {streams.size === 0 && !isLoadingFriends && (
    <li className="text-gray-400 text-center py-4">No other participants yet</li>
  )}
</ul>

        </div>
      </div>
    </div>
  );
};

export default RoomCall;