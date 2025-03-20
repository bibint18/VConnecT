// "use client"

// import { useState } from "react"
// import {
//   Bell,
//   ChevronDown,
//   Mic,
//   MicOff,
//   MoreHorizontal,
//   Hand,
//   FiX,
//   FiCheck,
//   FiMinus,
//   FiUserPlus,
//   FiVideoOff,
//   FiMessageSquare,
// } from "react-icons/fi"
// import "./index.css"

// const App = () => {
//   const [showChat, setShowChat] = useState(true)
//   const [participants, setParticipants] = useState([
//     {
//       id: 1,
//       name: "Christina",
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VconnectRoomCall-hy1v73C4FEWZIE40awzxkNOhc9UUMG.png",
//       muted: false,
//     },
//     {
//       id: 2,
//       name: "Alice Wong",
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VconnectRoomCall-hy1v73C4FEWZIE40awzxkNOhc9UUMG.png",
//       muted: false,
//     },
//     {
//       id: 3,
//       name: "Theresa Webb",
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VconnectRoomCall-hy1v73C4FEWZIE40awzxkNOhc9UUMG.png",
//       muted: true,
//     },
//     {
//       id: 4,
//       name: "Christina",
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VconnectRoomCall-hy1v73C4FEWZIE40awzxkNOhc9UUMG.png",
//       muted: true,
//     },
//     {
//       id: 5,
//       name: "Alice Wong",
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VconnectRoomCall-hy1v73C4FEWZIE40awzxkNOhc9UUMG.png",
//       muted: false,
//     },
//     {
//       id: 6,
//       name: "Theresa Webb",
//       image:
//         "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VconnectRoomCall-hy1v73C4FEWZIE40awzxkNOhc9UUMG.png",
//       muted: true,
//     },
//   ])

//   const [requests, setRequests] = useState([
//     { id: 1, name: "Elmer Laverty", image: "/placeholder.svg?height=40&width=40", approved: true },
//     { id: 2, name: "Elmer Laverty", image: "/placeholder.svg?height=40&width=40", approved: true },
//   ])

//   const [messages, setMessages] = useState([
//     { id: 1, sender: "Kathryn Murphy", message: "Good afternoon, everyone.", time: "11:01 AM" },
//     { id: 2, sender: "Joshua Abraham", message: "Yes, Let's start this meeting", time: "11:02 AM" },
//     { id: 3, sender: "Kathryn Murphy", message: "Good afternoon, everyone.", time: "11:01 AM" },
//   ])

//   const [participantsList, setParticipantsList] = useState([
//     { id: 1, name: "Dianne Russell", image: "/placeholder.svg?height=40&width=40" },
//     { id: 2, name: "Guy Hawkins", image: "/placeholder.svg?height=40&width=40" },
//     { id: 3, name: "Kathryn Murphy", image: "/placeholder.svg?height=40&width=40" },
//     { id: 4, name: "Dianne Russell", image: "/placeholder.svg?height=40&width=40" },
//     { id: 5, name: "Guy Hawkins", image: "/placeholder.svg?height=40&width=40" },
//     { id: 6, name: "Kathryn Murphy", image: "/placeholder.svg?height=40&width=40" },
//   ])

//   const [showParticipants, setShowParticipants] = useState(true)
//   const [isMuted, setIsMuted] = useState(false)
//   const [isHandRaised, setIsHandRaised] = useState(false)

//   const toggleChat = () => setShowChat(!showChat)
//   const toggleParticipants = () => setShowParticipants(!showParticipants)
//   const toggleMute = () => setIsMuted(!isMuted)
//   const toggleHandRaise = () => setIsHandRaised(!isHandRaised)

//   return (
//     <div className="flex h-screen bg-black text-white overflow-hidden">
//       {/* Left Sidebar */}
//       <div className="w-60 bg-[#1a1a2e] flex-shrink-0 flex flex-col border-r border-gray-800 hidden md:flex">
//         <div className="p-4 flex flex-col gap-2">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-sm">ID: 00001101</p>
//               <p className="text-sm">password: 5555</p>
//             </div>
//             <button className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">END ROOM</button>
//           </div>
//         </div>

//         {/* Requests Section */}
//         <div className="mt-4 px-4">
//           <div className="flex items-center gap-2 bg-indigo-600 p-3 rounded-md">
//             <Bell size={18} />
//             <span>Requests</span>
//           </div>

//           <div className="mt-4 space-y-3">
//             {requests.map((request) => (
//               <div key={request.id} className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <img src={request.image || "/placeholder.svg"} alt={request.name} className="w-8 h-8 rounded-full" />
//                   <span className="text-sm">{request.name}</span>
//                 </div>
//                 <div className="flex gap-1">
//                   <button className="text-green-500">
//                     <Check size={16} />
//                   </button>
//                   <button className="text-gray-400">
//                     <Minus size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Chats Section */}
//         <div className="mt-6 px-4 flex-grow overflow-hidden flex flex-col">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <span>Chats</span>
//               <ChevronDown size={16} />
//             </div>
//           </div>

//           <div className="mt-4 space-y-4 overflow-y-auto flex-grow">
//             {messages.map((message) => (
//               <div key={message.id} className="border-b border-gray-800 pb-2">
//                 <div className="flex items-center gap-2 mb-1">
//                   <img
//                     src="/placeholder.svg?height=24&width=24"
//                     alt={message.sender}
//                     className="w-6 h-6 rounded-full"
//                   />
//                   <span className="text-xs text-gray-400">{message.sender}</span>
//                 </div>
//                 <p className="text-sm">{message.message}</p>
//                 <p className="text-xs text-gray-500 mt-1">{message.time}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-grow flex flex-col">
//         {/* Video Grid */}
//         <div className="flex-grow p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {participants.map((participant) => (
//             <div key={participant.id} className="relative rounded-lg overflow-hidden">
//               <img
//                 src={participant.image || "/placeholder.svg"}
//                 alt={participant.name}
//                 className="w-full h-full object-cover aspect-video"
//               />
//               <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm">{participant.name}</span>
//                   {!participant.muted && (
//                     <div className="bg-blue-600 rounded-full p-1">
//                       <Mic size={14} />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Bottom Controls */}
//         <div className="p-4 flex justify-center">
//           <div className="bg-[#1a1a2e] rounded-lg p-2 flex items-center gap-4">
//             <button className={`p-3 rounded-full ${isMuted ? "bg-gray-700" : "bg-blue-600"}`} onClick={toggleMute}>
//               {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
//             </button>
//             <button
//               className={`p-3 rounded-full ${isHandRaised ? "bg-gray-700" : "bg-gray-600"}`}
//               onClick={toggleHandRaise}
//             >
//               <Hand size={20} />
//             </button>
//             <button className="p-3 rounded-full bg-gray-600">
//               <MoreHorizontal size={20} />
//             </button>
//             <button className="bg-red-500 text-white px-6 py-2 rounded-md">End Call</button>
//           </div>
//         </div>
//       </div>

//       {/* Right Sidebar - Participants */}
//       <div className="w-64 bg-indigo-700 flex-shrink-0 flex flex-col border-l border-indigo-800 hidden lg:flex">
//         <div className="p-4 flex items-center justify-center">
//           <div className="flex items-center gap-2">
//             <FiMessageSquare size={18} />
//             <span className="font-medium">Participants</span>
//           </div>
//         </div>

//         <div className="flex-grow overflow-y-auto p-4 space-y-3">
//           {participantsList.map((participant) => (
//             <div key={participant.id} className="bg-white/10 rounded-full p-2 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <img
//                   src={participant.image || "/placeholder.svg"}
//                   alt={participant.name}
//                   className="w-8 h-8 rounded-full"
//                 />
//                 <span className="text-sm">{participant.name}</span>
//               </div>
//               <div className="flex gap-1">
//                 <button className="text-white bg-white/10 rounded-full p-1">
//                   <FiUserPlus size={14} />
//                 </button>
//                 <button className="text-white bg-white/10 rounded-full p-1">
//                   <MicOff size={14} />
//                 </button>
//                 <button className="text-white bg-white/10 rounded-full p-1">
//                   <FiVideoOff size={14} />
//                 </button>
//                 <button className="text-white bg-white/10 rounded-full p-1">
//                   <X size={14} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Mobile Controls */}
//       <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e] p-3 flex justify-between items-center md:hidden">
//         <button className={`p-2 rounded-full ${isMuted ? "bg-gray-700" : "bg-blue-600"}`} onClick={toggleMute}>
//           {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
//         </button>
//         <button
//           className={`p-2 rounded-full ${isHandRaised ? "bg-gray-700" : "bg-gray-600"}`}
//           onClick={toggleHandRaise}
//         >
//           <Hand size={18} />
//         </button>
//         <button className="bg-red-500 text-white px-4 py-1 rounded-md text-sm">End Call</button>
//         <button className="p-2 rounded-full bg-gray-600" onClick={toggleChat}>
//           <FiMessageSquare size={18} />
//         </button>
//         <button className="p-2 rounded-full bg-gray-600" onClick={toggleParticipants}>
//           <FiUserPlus size={18} />
//         </button>
//       </div>

//       {/* Mobile Sidebar Overlay */}
//       {(showChat || showParticipants) && (
//         <div
//           className="fixed inset-0 bg-black/70 z-10 md:hidden"
//           onClick={() => {
//             setShowChat(false)
//             setShowParticipants(false)
//           }}
//         >
//           {showChat && (
//             <div
//               className="absolute right-0 top-0 bottom-0 w-3/4 bg-[#1a1a2e] p-4"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="font-medium">Chat</h3>
//                 <button onClick={() => setShowChat(false)}>
//                   <X size={20} />
//                 </button>
//               </div>
//               <div className="space-y-4 overflow-y-auto h-[calc(100%-60px)]">
//                 {messages.map((message) => (
//                   <div key={message.id} className="border-b border-gray-800 pb-2">
//                     <div className="flex items-center gap-2 mb-1">
//                       <img
//                         src="/placeholder.svg?height=24&width=24"
//                         alt={message.sender}
//                         className="w-6 h-6 rounded-full"
//                       />
//                       <span className="text-xs text-gray-400">{message.sender}</span>
//                     </div>
//                     <p className="text-sm">{message.message}</p>
//                     <p className="text-xs text-gray-500 mt-1">{message.time}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {showParticipants && (
//             <div
//               className="absolute right-0 top-0 bottom-0 w-3/4 bg-indigo-700 p-4"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="font-medium">Participants</h3>
//                 <button onClick={() => setShowParticipants(false)}>
//                   <X size={20} />
//                 </button>
//               </div>
//               <div className="space-y-3 overflow-y-auto h-[calc(100%-60px)]">
//                 {participantsList.map((participant) => (
//                   <div key={participant.id} className="bg-white/10 rounded-full p-2 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <img
//                         src={participant.image || "/placeholder.svg"}
//                         alt={participant.name}
//                         className="w-8 h-8 rounded-full"
//                       />
//                       <span className="text-sm">{participant.name}</span>
//                     </div>
//                     <div className="flex gap-1">
//                       <button className="text-white bg-white/10 rounded-full p-1">
//                         <X size={14} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default App

