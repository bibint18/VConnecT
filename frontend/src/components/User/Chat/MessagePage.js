// "use client"
export {};
// import type React from "react"
// import { useState, useEffect } from "react"
// import FriendsList from "./FriendList"
// import ChatWindow from "./Chat-window"
// // Mock data - in a real app, this would come from an API
// const mockCurrentUser = {
//   id: "user1",
//   name: "You",
//   avatar: "/placeholder.svg?height=200&width=200",
//   isOnline: true,
// }
// const mockFriends = [
//   {
//     id: "friend1",
//     name: "Florencio Dorrance",
//     avatar: "/placeholder.svg?height=200&width=200",
//     lastMessage: "Haha oh man 🔥",
//     timestamp: "12m",
//     isOnline: true,
//   },
//   ...Array(8)
//     .fill(null)
//     .map((_, index) => ({
//       id: `friend${index + 2}`,
//       name: "Elmer Laverty",
//       avatar: "/placeholder.svg?height=200&width=200",
//       lastMessage: "Haha oh man 🔥",
//       timestamp: "12m",
//       isOnline: Math.random() > 0.5,
//     })),
// ]
// const mockMessages = [
//   {
//     id: "msg1",
//     senderId: "friend1",
//     text: "omg, this is amazing",
//     timestamp: new Date(Date.now() - 1000 * 60 * 5),
//   },
//   {
//     id: "msg2",
//     senderId: "friend1",
//     text: "perfect! ✅",
//     timestamp: new Date(Date.now() - 1000 * 60 * 4),
//   },
//   {
//     id: "msg3",
//     senderId: "friend1",
//     text: "Wow, this is really epic",
//     timestamp: new Date(Date.now() - 1000 * 60 * 3),
//   },
//   {
//     id: "msg4",
//     senderId: "user1",
//     text: "How are you?",
//     timestamp: new Date(Date.now() - 1000 * 60 * 2),
//   },
//   {
//     id: "msg5",
//     senderId: "friend1",
//     text: "just ideas for next time",
//     timestamp: new Date(Date.now() - 1000 * 60 * 1),
//   },
//   {
//     id: "msg6",
//     senderId: "friend1",
//     text: "I'll be there in 2 mins ⏰",
//     timestamp: new Date(Date.now() - 1000 * 30),
//   },
//   {
//     id: "msg7",
//     senderId: "user1",
//     text: "woohoooo",
//     timestamp: new Date(Date.now() - 1000 * 20),
//   },
//   {
//     id: "msg8",
//     senderId: "user1",
//     text: "Haha oh man",
//     timestamp: new Date(Date.now() - 1000 * 10),
//   },
//   {
//     id: "msg9",
//     senderId: "user1",
//     text: "Haha that's terrifying 😱",
//     timestamp: new Date(),
//     isEmoji: true,
//   },
// ]
// const MessagingApp: React.FC = () => {
//   const [activeChatId, setActiveChatId] = useState<string>("friend1")
//   const [messages, setMessages] = useState(mockMessages)
//   const [friends, setFriends] = useState(mockFriends)
//   const activeChat = friends.find((friend) => friend.id === activeChatId)
//   const handleSelectFriend = (friendId: string) => {
//     setActiveChatId(friendId)
//   }
//   const handleSendMessage = (text: string) => {
//     const newMessage = {
//       id: `msg${Date.now()}`,
//       senderId: mockCurrentUser.id,
//       text,
//       timestamp: new Date(),
//       isEmoji: text.match(/[\u{1F300}-\u{1F6FF}]/u) !== null,
//     }
//     setMessages([...messages, newMessage])
//     // Update the last message in friends list
//     setFriends(
//       friends.map((friend) =>
//         friend.id === activeChatId ? { ...friend, lastMessage: text, timestamp: "now" } : friend,
//       ),
//     )
//   }
//   // In a real app, you would fetch data from an API here
//   useEffect(() => {
//     // Simulate API call
//     console.log("Fetching data from backend...")
//   }, [])
//   return (
//     <div className="flex flex-col md:flex-row h-screen bg-gray-100 p-4 gap-4">
//       <div className="w-full md:w-1/3 lg:w-1/4 h-1/2 md:h-full">
//         <FriendsList friends={friends} activeChat={activeChatId} onSelectFriend={handleSelectFriend} />
//       </div>
//       <div className="w-full md:w-2/3 lg:w-3/4 h-1/2 md:h-full">
//         <ChatWindow
//           currentUser={mockCurrentUser}
//           activeChat={
//             activeChat
//               ? {
//                   id: activeChat.id,
//                   name: activeChat.name,
//                   avatar: activeChat.avatar,
//                   isOnline: activeChat.isOnline,
//                 }
//               : null
//           }
//           messages={messages}
//           onSendMessage={handleSendMessage}
//         />
//       </div>
//     </div>
//   )
// }
// export default MessagingApp
