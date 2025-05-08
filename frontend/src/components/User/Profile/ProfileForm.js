import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Edit, Check } from 'react-feather';
import { useState } from 'react';
import { changePassword, getUserProfile, updateUserProfile, userCheckin } from '@/services/ProfileService';
import { useAppDispatch } from '@/redux/store';
import { updateProfile } from '@/redux/userSlice';
import axiosInstance from '@/utils/axiosInterceptor';
import toast from 'react-hot-toast';
const VerifiedItem = ({ value, timestamp }) => (_jsx("div", { className: "mt-6", children: _jsxs("div", { className: "flex items-start space-x-2", children: [_jsx("div", { className: "flex-shrink-0 mt-1", children: _jsx("div", { className: "w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center", children: _jsx(Check, { className: "w-4 h-4 text-white" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-300", children: value }), _jsx("p", { className: "text-sm text-gray-500", children: timestamp })] })] }) }));
export const ProfileContent = () => {
    const dispatch = useAppDispatch();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await getUserProfile();
                console.log("userdta profilr", userData);
                const userProfile = {
                    name: userData.name || '',
                    email: userData.email || '',
                    googleId: userData.googleId || '',
                    profileImage: userData.profileImage || '',
                    mobile: userData.mobile || '',
                    username: userData.username || '',
                    country: userData.country || '',
                    description: userData.description || '',
                    gender: userData.gender || '',
                    streak: userData.streak || 0,
                    lastStreakUpdate: userData.lastStreakUpdate || ''
                };
                setUser(userProfile);
                setFormData(userProfile);
            }
            catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
                else {
                    setError("Failed to load profile");
                }
            }
            finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setError(null);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => prev ? { ...prev, [name]: value } : null);
    };
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleResetPassword = async (e) => {
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
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
            else {
                toast.error("Failed to update password");
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData)
            return;
        try {
            const updatedUser = await updateUserProfile(formData);
            console.log("updatedUser ", updatedUser);
            setUser(updatedUser);
            setIsEditing(false);
            console.log('updatedUser Name', updatedUser.user.name);
            dispatch(updateProfile({ name: updatedUser.user.name }));
            window.location.reload();
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
            else {
                setError("Failed to update");
            }
        }
    };
    const handleImageUpload = async () => {
        console.log('handleImageUpload triggered');
        try {
            console.log('window.cloudinary:', window.cloudinary);
            if (!window.cloudinary) {
                setError('Cloudinary widget not loaded. Please try again later.');
                console.log('Error: Cloudinary not loaded');
                return;
            }
            console.log('Cloud Name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
            console.log('API Key:', import.meta.env.VITE_CLOUDINARY_API_KEY);
            const { data } = await axiosInstance.get('/user/profile/signature');
            console.log('Signature Data:', data);
            const { signature, timestamp } = data;
            const cloudinaryWidget = window.cloudinary.createUploadWidget({
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
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
            }, (error, result) => {
                console.log('Widget callback:', { error, result });
                if (!error && result && result.event === 'success') {
                    const imageUrl = result.info.secure_url;
                    console.log('Upload success:', imageUrl);
                    axiosInstance
                        .post('/user/profile/image', { imageUrl })
                        .then((response) => {
                        console.log("post reference ", response);
                        setUser(response.data.user);
                        setFormData(response.data.user);
                    })
                        .catch((err) => {
                        setError(err.message || 'Failed to update image');
                        console.log('Post error:', err);
                    });
                }
                else if (error) {
                    setError(error.message || 'Image upload failed');
                    console.log('Upload error:', error);
                }
            });
            console.log('Widget created:', cloudinaryWidget);
            cloudinaryWidget.open();
            console.log('Widget opened');
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                console.log('Caught error:', error.message);
            }
            else {
                setError('Failed to initiate upload');
                console.log('Unknown error:', error);
            }
        }
    };
    const handleCheckin = async () => {
        try {
            const updatedUser = await userCheckin();
            setUser((prev) => prev ? { ...prev, streak: updatedUser.streak, lastStreakUpdate: updatedUser.lastStreakUpdate } : null);
            setFormData((prev) => prev ? { ...prev, streak: updatedUser.streak, lastStreakUpdate: updatedUser.lastStreakUpdate } : null);
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
            else {
                setError("Failed to update streak");
            }
        }
    };
    const isCheckInDisabled = () => {
        if (!user?.lastStreakUpdate)
            return false; // Enable if no previous check-in
        const now = new Date();
        const lastUpdate = new Date(user.lastStreakUpdate);
        const timeDiff = now.getTime() - lastUpdate.getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        return timeDiff < twentyFourHours; // Disable if less than 24 hours
    };
    if (loading)
        return _jsx("div", { className: "text-white", children: "Loading..." });
    if (error)
        return _jsx("div", { className: "text-red-500", children: error });
    return (_jsxs("div", { className: "min-h-screen bg-black text-white px-6 py-6 pl-24 md:pl-72", children: [_jsx("div", { className: "bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-xl p-4 mb-8", children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { onClick: handleCheckin, className: "bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-lg cursor-pointer", children: "Check in" }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-300 text-sm", children: "\u2B50 Check in daily to maintain your streak and stay on the leaderboard!" }), _jsx("p", { className: "text-gray-400 text-xs", children: "Keep your progress going and secure your top spot." }), _jsxs("p", { children: ["Streaks:", user?.streak || 0, " \u26A1"] }), isCheckInDisabled() && (_jsxs("p", { className: "text-gray-500 text-xs", children: ["Next check-in available: ", new Date(new Date(user.lastStreakUpdate).getTime() + 24 * 60 * 60 * 1000).toLocaleString()] }))] })] }) }), _jsxs("div", { className: "flex justify-between items-start mb-8", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: user?.profileImage ||
                                            (user?.googleId ? `https://lh3.googleusercontent.com/a/${user.googleId}` : '/placeholder.svg?height=80&width=80'), alt: "Profile", className: "w-20 h-20 rounded-full object-cover" }), _jsx("button", { onClick: handleImageUpload, className: "absolute bottom-0 right-0 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center", children: "+" })] }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold", children: user?.name || '' }), _jsx("p", { className: "text-gray-400", children: user?.email || '' })] })] }), _jsxs("button", { onClick: handleEditToggle, className: "bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2", children: [_jsx(Edit, { className: "w-4 h-4" }), _jsx("span", { children: isEditing ? 'Cancel' : 'Edit' })] })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "Full Name" }), _jsx("input", { type: "text", name: "name", className: "w-full bg-gray-900 rounded-lg px-4 py-3 text-white", value: formData?.name || '', onChange: handleChange, readOnly: !isEditing })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "Gender" }), isEditing ? (_jsxs("select", { name: "gender", className: "w-full bg-gray-900 rounded-lg px-4 py-3 text-white appearance-none", value: formData?.gender || '', onChange: handleChange, children: [_jsx("option", { value: "", children: "Select gender" }), _jsx("option", { value: "Male", children: "Male" }), _jsx("option", { value: "Female", children: "Female" }), _jsx("option", { value: "Other", children: "Other" })] })) : (_jsx("input", { type: "text", name: "gender", className: "w-full bg-gray-900 rounded-lg px-4 py-3 text-white", value: formData?.gender || '', readOnly: true }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "Mobile" }), _jsx("input", { type: "tel", name: "mobile", className: "w-full bg-gray-900 rounded-lg px-4 py-3 text-white", value: formData?.mobile || '', onChange: handleChange, readOnly: !isEditing })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "User Name" }), _jsx("input", { type: "text", name: "username", className: "w-full bg-gray-900 rounded-lg px-4 py-3 text-white", value: formData?.username || '', disabled: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "Country" }), _jsx("input", { type: "text", name: "country", className: "w-full bg-gray-900 rounded-lg px-4 py-3 text-white", value: formData?.country || '', onChange: handleChange, readOnly: !isEditing })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "Description" }), _jsx("textarea", { name: "description", className: "w-full bg-gray-900 rounded-lg px-4 py-3 text-white resize-none", rows: 3, value: formData?.description || '', onChange: handleChange, readOnly: !isEditing })] })] })] }), isEditing && (_jsx("div", { className: "mt-6", children: _jsx("button", { type: "submit", className: "bg-green-600 text-white px-6 py-2 rounded-lg", children: "Submit" }) }))] }), _jsx("h3", { children: "Rest Your password here " }), _jsx("br", {}), _jsxs("div", { className: "mt-8", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Reset Your Password" }), _jsxs("form", { onSubmit: handleResetPassword, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "Current Password" }), _jsx("input", { type: "password", name: "currentPassword", className: "w-full bg-gray-900 rounded-lg px-4 py-3 text-white", value: passwordForm.currentPassword, onChange: handlePasswordChange, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "New Password" }), _jsx("input", { type: "password", name: "newPassword", className: "w-full bg-gray-900 rounded-lg px-4 py-3 text-white", value: passwordForm.newPassword, onChange: handlePasswordChange, required: true })] })] }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "Confirm New Password" }), _jsx("input", { type: "password", name: "confirmPassword", className: "w-full bg-gray-900 rounded-lg px-4 py-3 text-white", value: passwordForm.confirmPassword, onChange: handlePasswordChange, required: true })] }) })] }), _jsx("div", { className: "mt-6", children: _jsxs("button", { type: "submit", className: "bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2", children: [_jsx(Edit, { className: "w-4 h-4" }), _jsx("span", { children: "Reset Password" })] }) })] })] }), _jsxs("div", { className: "mt-8", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Verified Information" }), _jsx(VerifiedItem, { value: user?.email || '', timestamp: "Verified" }), user?.mobile && _jsx(VerifiedItem, { value: user.mobile, timestamp: "Verified" })] }), error && _jsx("p", { className: "text-red-500 mt-4", children: error })] }));
};
