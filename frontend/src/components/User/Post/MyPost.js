import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, Suspense } from 'react';
import { CommunityService } from '@/services/CommunityService';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageSquare } from 'lucide-react';
const CreatePost = React.lazy(() => import('./CreatePost'));
const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [newContent, setNewContent] = useState('');
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [postCount, setPostCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const communityService = new CommunityService();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await communityService.getUserDetails();
                setUser(userData);
                const myPosts = await communityService.getMyPosts();
                console.log("My posts fetched", myPosts);
                const validPosts = myPosts.filter(post => post._id !== undefined);
                const count = validPosts.length;
                console.log("count", count);
                setPosts(validPosts);
                setPostCount(count);
                setError(null);
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
                setError(errorMessage);
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);
    const handleEdit = (postId, currentContent) => {
        if (!postId) {
            setError('Cannot edit post: Invalid post ID');
            return;
        }
        setEditingPostId(postId);
        setNewContent(currentContent ?? '');
    };
    const handleSaveEdit = async (postId) => {
        if (!postId) {
            setError('Cannot save post: Invalid post ID');
            return;
        }
        if (!newContent.trim()) {
            setError('Content cannot be empty');
            return;
        }
        try {
            await communityService.editPost(postId, newContent);
            setPosts(prevPosts => prevPosts.map(post => post._id === postId ? { ...post, content: newContent } : post));
            setEditingPostId(null);
            setNewContent('');
            setError(null);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update post';
            setError(errorMessage);
            console.error('Error editing post:', err);
        }
    };
    const handleCancelEdit = () => {
        setEditingPostId(null);
        setNewContent('');
        setError(null);
    };
    const handleDeletePrompt = (postId) => {
        if (!postId) {
            setError('Cannot delete post: Invalid post ID');
            return;
        }
        setShowDeleteConfirm(postId);
    };
    const handleDelete = async (postId) => {
        try {
            await communityService.deletePost(postId);
            setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
            setPostCount(prev => prev - 1);
            setShowDeleteConfirm(null);
            setError(null);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
            setError(errorMessage);
            console.error('Error deleting post:', err);
        }
    };
    const handleCancelDelete = () => {
        setShowDeleteConfirm(null);
    };
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handlePostCreated = async () => {
        try {
            const myPosts = await communityService.getMyPosts();
            const validPosts = myPosts.filter(post => post._id !== undefined);
            setPosts(validPosts);
            setPostCount(validPosts.length);
            closeModal();
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to refresh posts';
            setError(errorMessage);
            console.error('Error refreshing posts:', err);
        }
    };
    return (_jsxs("div", { className: "!p-4 sm:!p-6", children: [error && _jsx("div", { className: "!text-red-500 !text-center !mb-4 !text-base sm:!text-lg !font-medium", children: error }), user ? (_jsxs(_Fragment, { children: [_jsxs(motion.div, { className: "!bg-white !rounded-2xl !shadow-lg !p-4 sm:!p-6 !text-center !max-w-xs sm:!max-w-sm !w-full !mb-6 sm:!mb-10", initial: { opacity: 0, scale: 0.8, y: 50 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { duration: 0.6, ease: 'easeOut' }, whileHover: { y: -10, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)' }, children: [_jsx("img", { src: user.profileImage || 'https://via.placeholder.com/160', alt: "Profile", className: "!w-28 !h-28 sm:!w-36 sm:!h-36 !rounded-full !object-cover !mx-auto !mb-4 !border-4 !border-blue-500 !shadow-md" }), _jsx("h2", { className: "!text-lg sm:!text-xl !font-bold !text-gray-900 !mb-2", children: user.username || user.name }), _jsx("p", { className: "!text-sm sm:!text-base !text-gray-600 !mb-3", children: user.name }), _jsxs("p", { className: "!text-xs sm:!text-sm !text-blue-500 !font-medium !mb-4", children: [user.friends?.length || 0, " Friends"] }), _jsxs("p", { className: "!text-xs sm:!text-sm !text-blue-500 !font-medium !mb-4", children: [postCount || 0, " Posts"] }), _jsx(motion.button, { className: "!bg-blue-500 !text-white !px-4 sm:!px-5 !py-2 !rounded-lg !font-medium !hover:bg-blue-600 !transition-colors !text-sm sm:!text-base", onClick: openModal, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: "Create New Post" })] }), _jsxs("div", { className: "!flex !flex-col !gap-4 sm:!gap-6", children: [_jsx("h3", { className: "!text-xl sm:!text-2xl !font-semibold !text-white !mb-4", children: "MY POSTS" }), posts.length > 0 ? (_jsx("div", { className: "!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !gap-4 sm:!gap-8 !w-full", children: posts.map((post, index) => (_jsx(motion.div, { className: "!bg-white !rounded-xl !shadow-md !w-full !max-w-[300px] sm:!max-w-[350px] !h-[400px] sm:!h-[450px] !mx-auto !overflow-hidden !flex !flex-col", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.1 }, children: editingPostId === post._id ? (_jsxs("div", { className: "!p-4 !flex !flex-col !gap-4 !flex-1", children: [_jsx("textarea", { value: newContent, onChange: (e) => setNewContent(e.target.value), className: "!w-full !min-h-[100px] sm:!min-h-[120px] !p-3 !border !border-gray-200 !rounded-lg !text-sm sm:!text-base !bg-gray-50 !resize-y !focus:outline-none !focus:ring-2 !focus:ring-blue-500", placeholder: "Edit your post..." }), _jsxs("div", { className: "!flex !gap-3", children: [_jsx(motion.button, { className: "!bg-blue-500 !text-white !px-3 sm:!px-4 !py-2 !rounded-lg !font-medium !hover:bg-blue-600 !text-sm sm:!text-base", onClick: () => handleSaveEdit(post._id), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: "Save" }), _jsx(motion.button, { className: "!bg-gray-300 !text-gray-800 !px-3 sm:!px-4 !py-2 !rounded-lg !font-medium !hover:bg-gray-400 !text-sm sm:!text-base", onClick: handleCancelEdit, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: "Cancel" })] })] })) : (_jsxs("div", { className: "!flex !flex-col !flex-1", children: [post.mediaUrl && (post.mediaType === 'image' || post.mediaType === 'video') && (_jsx("div", { className: "!w-full !h-[180px] sm:!h-[200px]", children: post.mediaType === 'image' ? (_jsx("img", { src: post.mediaUrl, alt: "Post media", className: "!w-full !h-full !object-cover !rounded-t-xl" })) : (_jsx("video", { src: post.mediaUrl, controls: true, className: "!w-full !h-full !object-cover !rounded-t-xl" })) })), _jsxs("div", { className: "!p-4 !flex !flex-col !flex-1", children: [_jsx("p", { className: "!text-sm sm:!text-base !text-gray-900 !mb-3 !flex-1 !overflow-y-auto", children: post.content || 'No content' }), _jsxs("div", { className: "!flex !gap-4 !text-xs sm:!text-sm !text-gray-600 !mb-3", children: [_jsxs("span", { className: "!flex !items-center !gap-1", children: [_jsx(Heart, { size: 14, className: "!text-blue-500 sm:!h-5 sm:!w-5" }), " ", post.likeCount] }), _jsxs("span", { className: "!flex !items-center !gap-1", children: [_jsx(MessageSquare, { size: 14, className: "!text-blue-500 sm:!h-5 sm:!w-5" }), " ", post.commentCount] })] }), _jsxs("div", { className: "!flex !gap-3", children: [_jsx(motion.button, { className: "!bg-blue-500 !text-white !px-3 sm:!px-4 !py-2 !rounded-lg !font-medium !hover:bg-blue-600 !text-sm sm:!text-base", onClick: () => handleEdit(post._id, post.content), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: "Edit" }), _jsx(motion.button, { className: "!bg-red-500 !text-white !px-3 sm:!px-4 !py-2 !rounded-lg !font-medium !hover:bg-red-600 !text-sm sm:!text-base", onClick: () => handleDeletePrompt(post._id), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: "Delete" })] })] })] })) }, post._id ?? ''))) })) : (_jsxs(motion.div, { className: "!bg-white !rounded-xl !shadow-md !p-6 !text-center !max-w-md !w-full !mx-auto", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, children: [_jsx("p", { className: "!text-base sm:!text-lg !text-gray-600 !mb-4", children: "No Posts. Create a new post to get started!" }), _jsx(motion.button, { className: "!bg-blue-500 !text-white !px-4 sm:!px-6 !py-2 !rounded-lg !font-medium !hover:bg-blue-600 !text-sm sm:!text-base", onClick: openModal, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: "Create New Post" })] }))] })] })) : (_jsx("div", { className: "!text-center !text-base sm:!text-lg !text-blue-500 !py-8", children: "Loading user data..." })), _jsx(AnimatePresence, { children: showDeleteConfirm && (_jsx(motion.div, { className: "!fixed !inset-0 !bg-black/60 !flex !items-center !justify-center !z-50", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, children: _jsxs(motion.div, { className: "!bg-white !rounded-xl !p-4 sm:!p-6 !max-w-sm !w-[90%] sm:!w-full !text-center !shadow-xl", initial: { y: '-50%', opacity: 0 }, animate: { y: '0%', opacity: 1 }, exit: { y: '-50%', opacity: 0 }, transition: { duration: 0.3 }, children: [_jsx("h3", { className: "!text-lg sm:!text-xl !font-semibold !text-gray-900 !mb-3", children: "Confirm Delete" }), _jsx("p", { className: "!text-sm sm:!text-base !text-gray-600 !mb-4", children: "Are you sure you want to delete this post?" }), _jsxs("div", { className: "!flex !gap-3 !justify-center", children: [_jsx(motion.button, { className: "!bg-red-500 !text-white !px-3 sm:!px-4 !py-2 !rounded-lg !font-medium !hover:bg-red-600 !text-sm sm:!text-base", onClick: () => handleDelete(showDeleteConfirm), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: "Yes, Delete" }), _jsx(motion.button, { className: "!bg-gray-300 !text-gray-800 !px-3 sm:!px-4 !py-2 !rounded-lg !font-medium !hover:bg-gray-400 !text-sm sm:!text-base", onClick: handleCancelDelete, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: "Cancel" })] })] }) })) }), _jsx(AnimatePresence, { children: isModalOpen && (_jsx(motion.div, { className: "!fixed !inset-0 !bg-black/60 !flex !items-center !justify-center !z-50", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, onClick: closeModal, children: _jsxs(motion.div, { className: "!bg-white !rounded-xl !p-4 sm:!p-6 !max-w-md sm:!max-w-lg !w-[90%] sm:!w-full !shadow-xl", initial: { y: '-50%', opacity: 0 }, animate: { y: '0%', opacity: 1 }, exit: { y: '-50%', opacity: 0 }, transition: { duration: 0.3 }, onClick: e => e.stopPropagation(), children: [_jsx(motion.button, { className: "!absolute !top-3 sm:!top-4 !right-3 sm:!right-4 !text-gray-600 !hover:text-blue-500", onClick: closeModal, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: _jsx(X, { size: 20, className: "sm:!h-6 sm:!w-6" }) }), _jsx(Suspense, { fallback: _jsx("div", { className: "!text-center !text-blue-500 !text-sm sm:!text-base", children: "Loading..." }), children: _jsx(CreatePost, { onPostCreated: handlePostCreated }) })] }) })) })] }));
};
export default MyPosts;
