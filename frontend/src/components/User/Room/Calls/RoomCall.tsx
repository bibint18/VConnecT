
// frontend/src/components/RoomCall.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CallManager } from '@/services/CallManager';
import { useAppSelector } from '@/redux/store';
import { toast } from 'react-toastify';

const RoomCall: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [streams, setStreams] = useState<Map<string, { stream: MediaStream; username: string }>>(new Map());(new Map());
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled,setAudioEnabled] = useState(true)
  const [audioDevices,setAudioDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedAudioDevice,setSelectedAudioDevice] = useState<string>('')
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const callManagerRef = useRef<CallManager | null>(null);
  const { userId, isAuthenticated ,name} = useAppSelector((state) => state.user);
  const username=name
  useEffect(() => {
    if (!roomId || !isAuthenticated || !userId || !username) {
      if (!isAuthenticated || !userId) {
        toast.error('Please log in to join the call');
        navigate('/login');
      }
      return;
    }

    const manager = new CallManager(roomId, userId,username, (newStreams) => setStreams(new Map(newStreams)));
    callManagerRef.current = manager;
    manager.startCall();

    manager.getAudioDevices().then((devices) => {
      setAudioDevices(devices);
      if(devices.length > 0) setSelectedAudioDevice(devices[0].deviceId)
    })
    return () => {
      if (callManagerRef.current) {
        callManagerRef.current.leaveCall();
      }
    };
  }, [roomId, userId, isAuthenticated,username, navigate]);

  useEffect(() => {
    console.log('Streams in RoomCall:', Array.from(streams.entries()));
    streams.forEach(({stream}, streamUserId) => {
      const video = videoRefs.current.get(streamUserId);
      if (!video) {
        const newVideo = document.createElement('video');
        newVideo.muted = streamUserId === userId; // Mute self
        newVideo.autoplay = true;
        newVideo.playsInline = true;
        newVideo.className = 'w-full h-64 bg-black rounded-lg';
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
    if(callManagerRef.current){
      setAudioEnabled(!audioEnabled);
      callManagerRef.current.toggleAudio(!audioEnabled)
    }
  }

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

  // const handlePlusButtonClick = (participantId: string, participantName: string) => {
  //   // Placeholder action - customize this as needed
  //   console.log(`Clicked + button for participant: ${participantName} (ID: ${participantId})`);
  //   toast.info(`Action for ${participantName} clicked!`);
  // };

  const handlePlusButtonClick = (participantId: string, participantName: string) => {
    if (callManagerRef.current && participantId !== userId) {
      callManagerRef.current.sendFriendRequest(participantId);
      console.log(participantName)
    } else {
      toast.error("Cannot send friend request to yourself");
    }
  };
  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Room Call: {roomId}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from(streams.entries()).map(([streamUserId,{username}]) => (
          <div key={streamUserId} className="relative">
            <div id={`video-container-${streamUserId}`} />
            <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">
              User: {username}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <motion.button
          onClick={handleToggleVideo}
          className={`px-4 py-2 rounded-md text-white ${videoEnabled ? 'bg-red-600' : 'bg-green-600'}`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {videoEnabled ? 'Turn Off Video' : 'Turn On Video'}
        </motion.button>

        <motion.button
          onClick={handleToggleAudio}
          className={`px-4 py-2 rounded-md text-white ${audioEnabled ? 'bg-red-600' : 'bg-green-600'}`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {audioEnabled ? 'Mute Audio' : 'Unmute Audio'}
        </motion.button>

        <motion.button
          onClick={handleLeaveCall}
          className="px-4 py-2 bg-gray-600 text-white rounded-md"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Leave Call
        </motion.button>
      </div>
      <div className="w-64">
          <label htmlFor="audio-device" className="block text-sm font-medium text-gray-700">
            Select Microphone:
          </label>
          <select
            id="audio-device"
            value={selectedAudioDevice}
            onChange={(e) => handleAudioDeviceChange(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            {audioDevices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 w-full max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Participants ({streams.size})</h2>
        <ul className="bg-white shadow rounded-lg p-4">
        {Array.from(streams.entries()).map(([participantId, { username }]) => (
            <li key={participantId} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="text-gray-800">{username}</span>
              <motion.button
                onClick={() => handlePlusButtonClick(participantId, username)}
                className="text-blue-500 hover:text-blue-700 font-bold text-lg"
                variants={{ hover: { scale: 1.1 }, tap: { scale: 0.95 } }}
                whileHover="hover"
                whileTap="tap"
              >
                +
              </motion.button>
            </li>
          ))}
          {streams.size === 0 && (
            <li className="text-gray-500 text-center py-2">No participants yet</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RoomCall;