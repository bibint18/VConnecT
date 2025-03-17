
import React, { useEffect } from 'react';
import { Edit, Check } from 'react-feather';
import { useState } from 'react';
import { getUserProfile,updateUserProfile } from '@/services/ProfileService';
import { useAppDispatch } from '@/redux/store';
import { updateProfile } from '@/redux/userSlice';
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
interface User {
  name:string;
  email:string;
  googleId?:string;
  mobile?:string;
  username?:string;
  country?:string;
  description?:string;
  gender?:string
}
export const ProfileContent = () => {
  const dispatch = useAppDispatch()
  const [user,setUser] = useState<User | null>(null)
  const [error,setError] = useState<string | null>(null)
  const [loading,setLoading] = useState(true)
  const [formData,setFormData] = useState<User | null>(null)
  const [isEditing,setIsEditing] = useState(false)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getUserProfile()

        const userProfile ={
          name: userData.name || '',
          email: userData.email || '',
          googleId:userData.googleId || '',
          mobile: userData.mobile || '',
          username: userData.username || '',
          country: userData.country || '',
          description: userData.description || '',
          gender: userData.gender || '',
        }
        setUser(userProfile)
        setFormData(userProfile)
      } catch (error:unknown) {
        if (error instanceof Error) {
          setError(error.message);
      } else {
          setError("Failed to load profile");
      }
      }finally{
        setLoading(false)
      }
    };
    fetchProfile();
  },[])

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError(null)
  }

  const handleChange= (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name,value} = e.target
    setFormData((prev) => prev ? {...prev,[name]:value}: null)
  }

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!formData) return
    try {
      const updatedUser = await updateUserProfile(formData)
      console.log("updatedUser ",updatedUser)
      setUser(updatedUser)
      setIsEditing(false)
      console.log('updatedUser Name',updatedUser.user.name)
      dispatch(updateProfile({name:updatedUser.user.name}))
      window.location.reload()
    } catch (error) {
      if(error instanceof Error){
        setError(error.message)
      }else{
        setError("Failed to update")
      } 
    }
  }

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="min-h-screen bg-black text-white px-6 py-6 pl-24 md:pl-72">
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
            src={user?.googleId ? `https://lh3.googleusercontent.com/a/${user.googleId}` : '/placeholder.svg?height=80&width=80'}
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-semibold">{user?.name || ''}</h1>
            <p className="text-gray-400">{user?.email || ''}</p>
          </div>
        </div>
        <button onClick={handleEditToggle} className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>

      {/* Form Grid */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white"
                value={formData?.name || ''}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white appearance-none"
                  value={formData?.gender || ''}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <input
                  type="text"
                  name="gender"
                  className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white"
                  value={formData?.gender || ''}
                  readOnly
                />
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Mobile</label>
              <input
                type="tel"
                name="mobile"
                className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white"
                value={formData?.mobile || ''}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">User Name</label>
              <input
                type="text"
                name="username"
                className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white"
                value={formData?.username || ''}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Country</label>
              <input
                type="text"
                name="country"
                className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white"
                value={formData?.country || ''}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Description</label>
              <textarea
                name="description"
                className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white resize-none"
                rows={3}
                value={formData?.description || ''}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Submit
            </button>
          </div>
        )}
      </form>

      {/* Verified Information */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Verified Information</h2>
        <VerifiedItem value={user?.email || ''} timestamp="Verified" />
        {user?.mobile && <VerifiedItem value={user.mobile} timestamp="Verified" />}
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};