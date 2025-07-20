
import React, { useEffect } from 'react';
import { Edit, Check } from 'react-feather';
import { useState } from 'react';
import { changePassword, getUserProfile,updateUserProfile ,userCheckin} from '@/services/ProfileService';
import { useAppDispatch } from '@/redux/store';
import { updateProfile } from '@/redux/userSlice';
import axiosInstance from '@/utils/axiosInterceptor';
import toast from 'react-hot-toast';
interface VerifiedItemProps {
  value: string;
  timestamp: string;
  icon?: React.ReactNode;
}

interface CloudinaryUploadResult {
  event: string;
  info: {
    secure_url: string;
    [key: string]:string | number | boolean | undefined;
  };
}
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: {
          cloudName: string;
          apiKey: string;
          uploadSignature: string;
          uploadSignatureTimestamp: number;
          cropping: boolean;
          croppingAspectRatio: number;
          croppingShowDimensions: boolean;
          multiple: boolean;
          maxFileSize: number;
          resourceType: string;
          folder: string;
          sources: string[];
        },
        callback: (error: Error | null, result: CloudinaryUploadResult) => void
      ) => { open: () => void; close: () => void };
    };
  }
}

interface PasswordFormData{
  currentPassword:string;
  newPassword:string;
  confirmPassword:string
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
  profileImage?: string;
  googleId?:string;
  mobile?:string;
  username?:string;
  country?:string;
  description?:string;
  gender?:string;
  streak?:number;
  lastStreakUpdate?:string;
}
export const ProfileContent = () => {
  const dispatch = useAppDispatch()
  const [user,setUser] = useState<User | null>(null)
  const [error,setError] = useState<string | null>(null)
  const [loading,setLoading] = useState(true)
  const [formData,setFormData] = useState<User | null>(null)
  const [isEditing,setIsEditing] = useState(false)
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getUserProfile()
        const userProfile ={
          name: userData.name || '',
          email: userData.email || '',
          googleId:userData.googleId || '',
          profileImage: userData.profileImage || '',
          mobile: userData.mobile || '',
          username: userData.username || '',
          country: userData.country || '',
          description: userData.description || '',
          gender: userData.gender || '',
          streak: userData.streak || 0,
          lastStreakUpdate:userData.lastStreakUpdate || ''
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

  const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name,value} = e.target
    setPasswordForm((prev) => ({...prev,[name]: value}))
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;


    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }
    if (!passwordRegex.test(passwordForm.newPassword)) {
      toast.error("New password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, and one symbol");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setError(null);
      toast.success("Password updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update password");
      }
    }
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!formData || Object.keys(formData).length === 0) {
    setError("At least one field must be provided");
    return;
  }
  console.log("[ProfileContent] Sending formData to /user/profile/edit:", formData);
    try {
      const updatedUser = await updateUserProfile(formData)
      console.log("Updated user",updatedUser)
      setUser((prev) => prev ? { ...prev, ...updatedUser.user } : updatedUser.user);
    setFormData((prev) => prev ? { ...prev, ...updatedUser.user } : updatedUser.user);
      setIsEditing(false)
      dispatch(updateProfile({name:updatedUser.user.name}))
    } catch (error) {
      console.error("[ProfileContent] Update profile error:", error); 
      if(error instanceof Error){
        setError(error.message)
      }else{
        setError("Failed to update")
      } 
    }
  }

  

const handleImageUpload = async () => {
  try {
    if (!window.cloudinary) {
      setError('Cloudinary widget not loaded. Please try again later.');
      return;
    }

    const { data } = await axiosInstance.get('/user/profile/signature');
    const { signature, timestamp } = data;

    const cloudinaryWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string,
        apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY as string,
        uploadSignature: signature,
        uploadSignatureTimestamp: timestamp,
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,
        multiple: false,
        maxFileSize: 5 * 1024 * 1024,
        resourceType: 'image',
        folder: 'profile_images',
        sources: ['local'],
      },
      (error: Error | null, result) => {
        if (!error && result && result.event === 'success') {
          const imageUrl = result.info.secure_url;
          axiosInstance
            .post('/user/profile/image',{imageUrl})
            .then((response) => {
              setUser(response.data.user);
              setFormData(response.data.user);
            })
            .catch((err) => {
              setError(err.message || 'Failed to update image');
            });
        } else if (error) {
          setError(error.message || 'Image upload failed');
        }
      }
    );

    cloudinaryWidget.open();
  } catch (error: unknown) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('Failed to initiate upload');
    }
  }
};

const handleCheckin = async () => {
  try{
  const updatedUser = await userCheckin()
  setUser((prev) => prev ? {...prev,streak:updatedUser.streak,lastStreakUpdate:updatedUser.lastStreakUpdate} : null)
  setFormData((prev) => prev ? {...prev,streak:updatedUser.streak,lastStreakUpdate: updatedUser.lastStreakUpdate} : null)
  }catch(error){
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Failed to update streak");
    }
  }
}

const isCheckInDisabled = () => {
  if (!user?.lastStreakUpdate) return false; // Enable if no previous check-in
  const now = new Date();
  const lastUpdate = new Date(user.lastStreakUpdate);
  const timeDiff = now.getTime() - lastUpdate.getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  return timeDiff < twentyFourHours; // Disable if less than 24 hours
};

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
  <div className="min-h-screen bg-black text-white px-6 py-6 pl-24 md:pl-72">
      {/* Check-in Banner */}
      <div className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-xl p-4 mb-8">
        <div className="flex items-start space-x-4">
          <div onClick={handleCheckin} className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-lg cursor-pointer">
            Check in
          </div  >
          <div>
            <p className="text-gray-300 text-sm">
              ⭐ Check in daily to maintain your streak and stay on the leaderboard!
            </p>
            <p className="text-gray-400 text-xs">
              Keep your progress going and secure your top spot.
            </p>
            <p>Streaks:{user?.streak || 0} ⚡</p>
            {isCheckInDisabled() && (
              <p className="text-gray-500 text-xs">
                Next check-in available: {new Date(new Date(user!.lastStreakUpdate!).getTime() + 24 * 60 * 60 * 1000).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={
                user?.profileImage ||
                (user?.googleId ? `https://lh3.googleusercontent.com/a/${user.googleId}` : '/placeholder.svg?height=80&width=80')
              }
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <button
              onClick={handleImageUpload}
              className="absolute bottom-0 right-0 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
            >
              +
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{user?.name || ''}</h1>
            <p className="text-gray-400">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleEditToggle}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>{isEditing ? 'Cancel' : 'Edit'}</span>
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
                disabled
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
<br />
<div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Reset Your Password</h3>
        <form onSubmit={handleResetPassword}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Reset Password</span>
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Verified Information</h2>
        <VerifiedItem value={user?.email || ''} timestamp="Verified" />
        {user?.mobile && <VerifiedItem value={user.mobile} timestamp="Verified" />}
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
};