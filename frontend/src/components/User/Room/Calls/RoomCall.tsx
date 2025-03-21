// // // frontend/src/components/RoomCall.tsx
// // import React, { useEffect, useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { motion } from 'framer-motion';
// // import { CallManager } from '@/services/CallManager';
// // import toast from 'react-hot-toast';

// // const RoomCall: React.FC = () => {
// //   const { roomId } = useParams<{ roomId: string }>();
// //   const navigate = useNavigate();
// //   const [callManager, setCallManager] = useState<CallManager | null>(null);
// //   const [streams, setStreams] = useState<Map<string, MediaStream>>(new Map());
// //   const [videoEnabled, setVideoEnabled] = useState(true);

// //   useEffect(() => {
// //     if (!roomId) return;

// //     // Replace with actual userId from auth (e.g., localStorage.getItem('userId'))
// //     const userId = 'test-user'; // Temporary; update with your auth system

// //     const manager = new CallManager(roomId, userId, (newStreams) => setStreams(new Map(newStreams)));
// //     setCallManager(manager);
// //     manager.startCall();

// //     return () => {
// //       manager.leaveCall();
// //     };
// //   }, [roomId]);

// //   const handleToggleVideo = () => {
// //     if (callManager) {
// //       setVideoEnabled(!videoEnabled);
// //       callManager.toggleVideo(!videoEnabled);
// //     }
// //   };

// //   const handleLeaveCall = () => {
// //     if (callManager) {
// //       callManager.leaveCall();
// //       navigate('/rooms');
// //       toast.success('Left the call');
// //     }
// //   };

// //   const buttonVariants = {
// //     hover: { scale: 1.1, transition: { duration: 0.2 } },
// //     tap: { scale: 0.95 },
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-4">
// //       <h1 className="text-2xl font-bold text-center mb-4">Room Call: {roomId}</h1>
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //         {Array.from(streams.entries()).map(([userId, stream]) => (
// //           <div key={userId} className="relative">
// //             <video
// //               ref={(video) => {
// //                 if (video) video.srcObject = stream;
// //               }}
// //               autoPlay
// //               playsInline
// //               className="w-full h-64 bg-black rounded-lg"
// //             />
// //             <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">
// //               User: {userId}
// //             </p>
// //           </div>
// //         ))}
// //       </div>
// //       <div className="flex justify-center gap-4 mt-6">
// //         <motion.button
// //           onClick={handleToggleVideo}
// //           className={`px-4 py-2 rounded-md text-white ${videoEnabled ? 'bg-red-600' : 'bg-green-600'}`}
// //           variants={buttonVariants}
// //           whileHover="hover"
// //           whileTap="tap"
// //         >
// //           {videoEnabled ? 'Turn Off Video' : 'Turn On Video'}
// //         </motion.button>
// //         <motion.button
// //           onClick={handleLeaveCall}
// //           className="px-4 py-2 bg-gray-600 text-white rounded-md"
// //           variants={buttonVariants}
// //           whileHover="hover"
// //           whileTap="tap"
// //         >
// //           Leave Call
// //         </motion.button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default RoomCall;





// // frontend/src/components/RoomCall.tsx
// import React, { useEffect, useState, useRef } from 'react'; // Add useRef
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { CallManager } from '@/services/rrrrrr';
// import { useAppSelector } from '@/redux/store';
// import toast from 'react-hot-toast';


// const RoomCall: React.FC = () => {
//   const { roomId } = useParams<{ roomId: string }>();
//   const navigate = useNavigate();
//   const [callManager, setCallManager] = useState<CallManager | null>(null);
//   const [streams, setStreams] = useState<Map<string, MediaStream>>(new Map());
//   const [videoEnabled, setVideoEnabled] = useState(true);
//   const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map()); // Ref for video elements
//   const {userId,isAuthenticated} = useAppSelector((state) => state.user)
//   useEffect(() => {
//     if (!roomId || !userId || !isAuthenticated){
//       if (!isAuthenticated || !userId) {
//         toast.error('Please log in to join the call');
//         navigate('/login');
//       }
//       return
//     }
//     const manager = new CallManager(roomId, userId, (newStreams) => setStreams(new Map(newStreams)));
//     setCallManager(manager);
//     manager.startCall();

//     return () => {
//       manager.leaveCall();
//     };
//   }, [roomId,userId,isAuthenticated,navigate]);

//   // Update video elements when streams change
//   // useEffect(() => {
//   //   streams.forEach((stream, userId) => {
//   //     const video = videoRefs.current.get(userId);
//   //     if (video && video.srcObject !== stream) {
//   //       video.srcObject = stream;
//   //     }
//   //   });
//   // }, [streams]);

//   // useEffect(() => {
//   //   console.log('Streams in RoomCall:', Array.from(streams.entries()));
//   //   streams.forEach((stream, userId) => {
//   //     const video = videoRefs.current.get(userId);
//   //     if (video && video.srcObject !== stream) {
//   //       video.srcObject = stream;
//   //       video.play().catch((err) => console.error('Video play error:', err)); // Force play
//   //     }
//   //   });
//   // }, [streams]);


//   useEffect(() => {
//     console.log('Streams in RoomCall:', Array.from(streams.entries()));
//     streams.forEach((stream, userId) => {
//       const video = videoRefs.current.get(userId);
//       if (video) {
//         if (video.srcObject !== stream) {
//           video.srcObject = stream;
//           console.log('Set srcObject for:', userId);
//         }
//         video.play().catch((err) => console.error('Video play error for', userId, ':', err));
//       }
//     });
//   }, [streams]);

//   const handleToggleVideo = () => {
//     if (callManager) {
//       setVideoEnabled(!videoEnabled);
//       callManager.toggleVideo(!videoEnabled);
//     }
//   };

//   const handleLeaveCall = () => {
//     if (callManager) {
//       callManager.leaveCall();
//       navigate('/rooms');
//       toast.success('Left the call');
//     }
//   };

//   const buttonVariants = {
//     hover: { scale: 1.1, transition: { duration: 0.2 } },
//     tap: { scale: 0.95 },
//   };

//   return (
//     // <div className="min-h-screen bg-gray-100 p-4">
//     //   <h1 className="text-2xl font-bold text-center mb-4">Room Call: {roomId}</h1>
//     //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//     //     {Array.from(streams.entries()).map(([userId, stream]) => (
//     //       <div key={userId} className="relative">
//     //         <video
//     //           ref={(el) => {
//     //             if (el) {
//     //               videoRefs.current.set(userId, el);
//     //               if (el.srcObject !== stream) el.srcObject = stream;
//     //             }
//     //           }}
//     //           autoPlay
//     //           playsInline
//     //           className="w-full h-64 bg-black rounded-lg"
//     //         />
//     //         <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">
//     //           User: {userId}
//     //         </p>
//     //       </div>
//     //     ))}

//     <div className="min-h-screen bg-gray-100 p-4">
//     <h1 className="text-2xl font-bold text-center mb-4">Room Call: {roomId}</h1>
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {Array.from(streams.entries()).map(([userId, stream]) => (
//         <div key={userId} className="relative">
//           <video
//             ref={(el) => {
//               if (el) {
//                 videoRefs.current.set(userId, el);
//                 if (el.srcObject !== stream) el.srcObject = stream;
//               }
//             }}
//             autoPlay
//             playsInline
//             muted={userId === 'test-user'} // Mute local stream to avoid echo
//             className="w-full h-64 bg-black rounded-lg"
//           />
//           <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">
//             User: {userId}
//           </p>
//         </div>
//       ))}
//       </div>
//       <div className="flex justify-center gap-4 mt-6">
//         <motion.button
//           onClick={handleToggleVideo}
//           className={`px-4 py-2 rounded-md text-white ${videoEnabled ? 'bg-red-600' : 'bg-green-600'}`}
//           variants={buttonVariants}
//           whileHover="hover"
//           whileTap="tap"
//         >
//           {videoEnabled ? 'Turn Off Video' : 'Turn On Video'}
//         </motion.button>
//         <motion.button
//           onClick={handleLeaveCall}
//           className="px-4 py-2 bg-gray-600 text-white rounded-md"
//           variants={buttonVariants}
//           whileHover="hover"
//           whileTap="tap"
//         >
//           Leave Call
//         </motion.button>
//       </div>
//     </div>
//   );
// };

// export default RoomCall;



// frontend/src/components/RoomCall.tsx
// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { CallManager } from '@/services/CallManager'; // Adjust path as needed
// import { useAppSelector } from '@/redux/store';
// import { toast } from 'react-toastify';

// const RoomCall: React.FC = () => {
//   const { roomId } = useParams<{ roomId: string }>();
//   const navigate = useNavigate();
//   const [streams, setStreams] = useState<Map<string, MediaStream>>(new Map());
//   const [videoEnabled, setVideoEnabled] = useState(true);
//   const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
//   const callManagerRef = useRef<CallManager | null>(null);
//   const { userId, isAuthenticated } = useAppSelector((state) => state.user);

//   useEffect(() => {
//     if (!roomId || !isAuthenticated || !userId) {
//       if (!isAuthenticated || !userId) {
//         toast.error('Please log in to join the call');
//         navigate('/login');
//       }
//       return;
//     }

//     const manager = new CallManager(roomId, userId, (newStreams) => setStreams(new Map(newStreams)));
//     callManagerRef.current = manager;
//     manager.startCall();

//     return () => {
//       if (callManagerRef.current) {
//         callManagerRef.current.leaveCall();
//       }
//     };
//   }, [roomId, userId, isAuthenticated, navigate]);

//   useEffect(() => {
//     console.log('Streams in RoomCall:', Array.from(streams.entries()));
//     streams.forEach((stream, streamUserId) => {
//       const video = videoRefs.current.get(streamUserId);
//       if (!video) {
//         const newVideo = document.createElement('video');
//         newVideo.muted = streamUserId === userId; // Mute self
//         newVideo.autoplay = true;
//         newVideo.playsInline = true;
//         newVideo.className = 'w-full h-64 bg-black rounded-lg';
//         videoRefs.current.set(streamUserId, newVideo);
//         const container = document.getElementById(`video-container-${streamUserId}`);
//         if (container) container.appendChild(newVideo);
//       }
//       const existingVideo = videoRefs.current.get(streamUserId)!;
//       if (existingVideo.srcObject !== stream) {
//         existingVideo.srcObject = stream;
//         console.log('Set srcObject for:', streamUserId);
//         existingVideo.play().catch((err) => console.error('Video play error for', streamUserId, ':', err));
//       }
//     });

//     // Clean up removed streams
//     videoRefs.current.forEach((video, vidUserId) => {
//       if (!streams.has(vidUserId)) {
//         video.remove();
//         videoRefs.current.delete(vidUserId);
//       }
//     });
//   }, [streams, userId]);

//   const handleToggleVideo = () => {
//     if (callManagerRef.current) {
//       setVideoEnabled(!videoEnabled);
//       callManagerRef.current.toggleVideo(!videoEnabled);
//     }
//   };

//   const handleLeaveCall = () => {
//     if (callManagerRef.current) {
//       callManagerRef.current.leaveCall();
//       navigate('/rooms');
//       toast.success('Left the call');
//     }
//   };

//   const buttonVariants = {
//     hover: { scale: 1.1, transition: { duration: 0.2 } },
//     tap: { scale: 0.95 },
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <h1 className="text-2xl font-bold text-center mb-4">Room Call: {roomId}</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {Array.from(streams.entries()).map(([streamUserId]) => (
//           <div key={streamUserId} className="relative">
//             <div id={`video-container-${streamUserId}`} />
//             <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">
//               User: {streamUserId}
//             </p>
//           </div>
//         ))}
//       </div>
//       <div className="flex justify-center gap-4 mt-6">
//         <motion.button
//           onClick={handleToggleVideo}
//           className={`px-4 py-2 rounded-md text-white ${videoEnabled ? 'bg-red-600' : 'bg-green-600'}`}
//           variants={buttonVariants}
//           whileHover="hover"
//           whileTap="tap"
//         >
//           {videoEnabled ? 'Turn Off Video' : 'Turn On Video'}
//         </motion.button>
//         <motion.button
//           onClick={handleLeaveCall}
//           className="px-4 py-2 bg-gray-600 text-white rounded-md"
//           variants={buttonVariants}
//           whileHover="hover"
//           whileTap="tap"
//         >
//           Leave Call
//         </motion.button>
//       </div>
//     </div>
//   );
// };

// export default RoomCall;





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
  const [streams, setStreams] = useState<Map<string, MediaStream>>(new Map());
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled,setAudioEnabled] = useState(true)
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const callManagerRef = useRef<CallManager | null>(null);
  const { userId, isAuthenticated } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!roomId || !isAuthenticated || !userId) {
      if (!isAuthenticated || !userId) {
        toast.error('Please log in to join the call');
        navigate('/login');
      }
      return;
    }

    const manager = new CallManager(roomId, userId, (newStreams) => setStreams(new Map(newStreams)));
    callManagerRef.current = manager;
    manager.startCall();

    return () => {
      if (callManagerRef.current) {
        callManagerRef.current.leaveCall();
      }
    };
  }, [roomId, userId, isAuthenticated, navigate]);

  useEffect(() => {
    console.log('Streams in RoomCall:', Array.from(streams.entries()));
    streams.forEach((stream, streamUserId) => {
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

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Room Call: {roomId}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from(streams.entries()).map(([streamUserId]) => (
          <div key={streamUserId} className="relative">
            <div id={`video-container-${streamUserId}`} />
            <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 rounded">
              User: {streamUserId}
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
    </div>
  );
};

export default RoomCall;