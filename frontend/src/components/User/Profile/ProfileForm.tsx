// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Check, Pencil, CalendarCheck } from "lucide-react"

// interface UserProfile {
//   name: string
//   email: string
//   avatar: string
//   fullName: string
//   userName: string
//   gender: string
//   country: string
//   mobile: string
//   description: string
// }

// interface ProfileFormProps {
//   user: UserProfile
// }

// function ProfileForm({ user }: ProfileFormProps) {
//   const [isEditing, setIsEditing] = useState(false)
//   const [formData, setFormData] = useState(user)

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   return (
//     <div className="mx-auto max-w-4xl space-y-6">
//       {/* Check-in Banner */}
//       <div className="mb-6 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-4">
//         <div className="flex items-center justify-between">
//           <div className="space-y-1">
//             <h3 className="text-lg font-semibold">Check in</h3>
//             <p className="text-sm text-gray-300">
//               Check in daily to maintain your streak and stay on the leaderboard! Keep your progress going and secure
//               your top spot.
//             </p>
//           </div>
//           <button className="rounded-md bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-medium text-white hover:from-pink-600 hover:to-purple-600 flex items-center">
//             <CalendarCheck className="mr-2 h-4 w-4" />
//             Check In
//           </button>
//         </div>
//       </div>

//       {/* Profile Card */}
//       <div className="rounded-lg border border-gray-800 bg-gray-900">
//         <div className="p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="relative h-16 w-16 overflow-hidden rounded-full">
//                 <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-full w-full object-cover" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold">{user.name}</h2>
//                 <p className="text-sm text-gray-400">{user.email}</p>
//               </div>
//             </div>
//             <button
//               className="rounded-full p-2 text-gray-300 hover:bg-gray-800"
//               onClick={() => setIsEditing(!isEditing)}
//             >
//               {isEditing ? <Check className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
//             </button>
//           </div>

//           <div className="mt-6 space-y-6">
//             <div className="grid gap-6 md:grid-cols-2">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-300">Full Name</label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   disabled={!isEditing}
//                   placeholder="Enter your full name"
//                   value={formData.fullName}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-70"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-300">User Name</label>
//                 <input
//                   type="text"
//                   name="userName"
//                   disabled={!isEditing}
//                   placeholder="Enter your username"
//                   value={formData.userName}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-70"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-300">Gender</label>
//                 <div className="relative">
//                   <select
//                     name="gender"
//                     disabled={!isEditing}
//                     value={formData.gender}
//                     onChange={handleInputChange}
//                     className="w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none disabled:opacity-70"
//                   >
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
//                     <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
//                       <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-300">Country</label>
//                 <input
//                   type="text"
//                   name="country"
//                   disabled={!isEditing}
//                   placeholder="Enter your country"
//                   value={formData.country}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-70"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-300">Mobile</label>
//                 <input
//                   type="text"
//                   name="mobile"
//                   disabled={!isEditing}
//                   placeholder="Enter your mobile number"
//                   value={formData.mobile}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-70"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-300">Description</label>
//                 <textarea
//                   name="description"
//                   disabled={!isEditing}
//                   placeholder="Enter a brief description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-70"
//                   rows={3}
//                 />
//               </div>
//             </div>

//             <div className="space-y-4 pt-4">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
//                   <Check className="h-3 w-3 text-white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">My email Address</p>
//                   <p className="text-sm text-gray-400">
//                     {user.email}
//                     <span className="ml-2 text-xs text-gray-500">1 month ago</span>
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
//                   <Check className="h-3 w-3 text-white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">My mobile number</p>
//                   <p className="text-sm text-gray-400">
//                     {user.mobile}
//                     <span className="ml-2 text-xs text-gray-500">1 month ago</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfileForm



// import { useState } from 'react';

// const ProfileForm = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     gender: '',
//     country: '',
//     description: '',
//     username: '',
//   });

//   const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="form-container min-h-screen text-white ml-[200px] p-6 w-[calc(100%-200px)]">
//       <div className="flex justify-between items-center mb-6">
//         <button className="check-in-btn py-2 px-4 rounded transition duration-300">
//           Check in
//         </button>
//         <p className="text-sm text-gray-400">
//           Keep your progress going and secure your top spot.
//         </p>
//       </div>
//       <div className="flex items-center mb-6">
//         <img
//           src="https://via.placeholder.com/50"
//           alt="Profile"
//           className="rounded-full mr-4"
//         />
//         <div>
//           <h2 className="text-xl">Alexa Rawles</h2>
//           <p className="text-gray-400">alexarawles@gmail.com</p>
//         </div>
//         <button className="edit-btn ml-auto text-white py-2 px-4 rounded transition duration-300">
//           Edit
//         </button>
//       </div>
//       <form className="space-y-6">
//         <div className="flex space-x-4">
//           <div className="w-1/2">
//             <label className="block text-sm uppercase mb-1">Full Name</label>
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               className="form-input w-full p-3 bg-white text-black rounded"
//             />
//           </div>
//           <div className="w-1/2">
//             <label className="block text-sm uppercase mb-1">User Name</label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               className="form-input w-full p-3 bg-white text-black rounded"
//             />
//           </div>
//         </div>
//         <div className="flex space-x-4">
//           <div className="w-1/2">
//             <label className="block text-sm uppercase mb-1">Gender</label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="form-input w-full p-3 bg-white text-black rounded"
//             >
//               <option value="">Select</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
//           <div className="w-1/2">
//             <label className="block text-sm uppercase mb-1">Country</label>
//             <input
//               type="text"
//               name="country"
//               value={formData.country}
//               onChange={handleChange}
//               className="form-input w-full p-3 bg-white text-black rounded"
//             />
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm uppercase mb-1">Mobile</label>
//           <input
//             type="text"
//             name="mobile"
//             value={formData.fullName}
//             onChange={handleChange}
//             className="form-input w-full p-3 bg-white text-black rounded"
//           />
//         </div>
//         <div>
//           <label className="block text-sm uppercase mb-1">Description</label>
//           <input
//             type="text"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="form-input w-full p-3 bg-white text-black rounded"
//           />
//         </div>
//         <div className="text-gray-400 space-y-2">
//           <p>
//             My email Address{' '}
//             <span className="text-blue-400">alexarawles@gmail.com</span> 1
//             month ago
//           </p>
//           <p>
//             My mobile number{' '}
//             <span className="text-blue-400">+91 8282004567</span> 1 month ago
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProfileForm;



import React from 'react';
import { Edit, Check } from 'react-feather';

interface VerifiedItemProps {
  value: string;
  timestamp: string;
  icon?: React.ReactNode;
}

const VerifiedItem: React.FC<VerifiedItemProps> = ({ value, timestamp }) => (
  <div className="mt-6">
    <div className="flex items-start space-x-2">
      <div className="flex-shrink-0 mt-1">
        <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      </div>
      <div>
        <p className="text-gray-300">{value}</p>
        <p className="text-sm text-gray-500">{timestamp}</p>
      </div>
    </div>
  </div>
);

export const ProfileContent = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-6 pl-24 md:pl-72"> {/* Increased padding */}
      {/* Check-in Banner */}
      <div className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-xl p-4 mb-8">
        <div className="flex items-start space-x-4">
          <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-lg">
            Check in
          </div>
          <div>
            <p className="text-gray-300 text-sm">
              ⭐ Check in daily to maintain your streak and stay on the leaderboard!
            </p>
            <p className="text-gray-400 text-xs">
              Keep your progress going and secure your top spot.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center space-x-4">
          <img
            src="/placeholder.svg?height=80&width=80"
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-semibold">Alexa Rawles</h1>
            <p className="text-gray-400">alexarawles@gmail.com</p>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Gender</label>
            <select className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white appearance-none">
              <option>Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Mobile</label>
            <input
              type="tel"
              className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white"
              placeholder="Enter your mobile number"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">User Name</label>
            <input
              type="text"
              className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Country</label>
            <input
              type="text"
              className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white"
              placeholder="Enter your country"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white resize-none"
              rows={3}
              placeholder="Enter a description"
            />
          </div>
        </div>
      </div>

      {/* Verified Information */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Verified Information</h2>
        <VerifiedItem value="alexarawles@gmail.com" timestamp="1 month ago" />
        <VerifiedItem value="+91 6282004567" timestamp="1 month ago" />
      </div>
    </div>
  );
};