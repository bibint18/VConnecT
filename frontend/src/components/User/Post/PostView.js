import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePostView } from '@/hooks/usePostView';
import { CommunityService } from '@/services/CommunityService';
import { Heart, HeartCrack, MessageSquare, ChevronDown, ChevronUp, Send, Share2 } from 'lucide-react';
import { useAppSelector } from '@/redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Toaster } from 'react-hot-toast';
const PostView = () => {
    const { postId } = useParams();
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const userId = useAppSelector((state) => state.user.userId);
    const { post, isLoading, isError, error, handleLike, handleDislike, handleComment, handleShare, } = usePostView(postId);
    useEffect(() => {
        const fetchComments = async () => {
            if (postId && showComments) {
                const communityService = new CommunityService();
                const fetchedComments = await communityService.getPostComments(postId);
                setComments(fetchedComments.slice(0, 10));
            }
        };
        fetchComments();
    }, [postId, showComments]);
    const toggleComments = () => {
        setShowComments(prev => !prev);
    };
    const handleCommentSubmit = () => {
        if (newComment?.trim()) {
            handleComment(postId, newComment);
            setNewComment('');
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "!flex !justify-center !items-center !h-screen", children: _jsx("div", { className: "!text-gray-500 !text-lg", children: "Loading post..." }) }));
    }
    if (isError || !post) {
        return (_jsx("div", { className: "!flex !justify-center !items-center !h-screen", children: _jsx("div", { className: "!text-red-500 !text-lg", children: error || 'Post not found' }) }));
    }
    return (_jsxs("div", { className: "!p-4 !bg-black", children: [_jsx(Toaster, { position: "top-center", toastOptions: {
                    style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '14px',
                    },
                } }), _jsx(motion.div, { className: "!flex !flex-col !max-w-md !mx-auto", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: _jsxs(motion.div, { className: "!bg-white !rounded-lg !shadow-md !flex !flex-col", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: "!flex !items-center !p-3 !border-b !border-gray-200", children: [_jsx("img", { src: post.userId.profileImage || 'https://via.placeholder.com/40', alt: "Profile", className: "!w-8 !h-8 !rounded-full !object-cover !mr-3 !border-2 !border-blue-500" }), _jsxs("div", { className: "!flex !flex-col", children: [_jsx("span", { className: "!text-sm !font-semibold !text-gray-900", children: post.userId.username || 'Anonymous' }), _jsx("span", { className: "!text-xs !text-gray-500", children: formatDistanceToNow(new Date(post.timestamp), { addSuffix: true }) })] })] }), _jsxs("div", { className: "!flex !flex-col", children: [post.mediaUrl && (_jsx("div", { className: "!w-full !aspect-square", children: _jsx("img", { src: post.mediaUrl, alt: "Post", className: "!w-full !h-full !object-cover" }) })), _jsx("div", { className: "!p-3", children: _jsx("p", { className: "!text-sm !text-gray-900 !mb-2", children: post.content || 'No caption' }) }), _jsxs("div", { className: "!p-3 !border-t !border-gray-200 !flex !flex-col !gap-2", children: [_jsxs("div", { className: "!flex !gap-4 !text-sm !text-gray-600", children: [_jsx(motion.button, { className: '!bg-white', onClick: () => handleLike(post._id), whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: _jsx(Heart, { size: 20, className: post.likes.includes(userId)
                                                            ? '!text-red-600 !fill-red-600'
                                                            : '!text-gray-600 !hover:text-red-600' }) }), _jsx(motion.button, { className: '!bg-white', onClick: () => handleDislike(post._id), whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: _jsx(HeartCrack, { size: 20, className: post.likes.includes(userId)
                                                            ? '!text-gray-600 !hover:text-red-600'
                                                            : '!text-red-600 !fill-red-600' }) }), _jsx(motion.button, { className: '!bg-white', onClick: toggleComments, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: _jsx(MessageSquare, { size: 20, className: "!text-gray-600 !hover:text-gray-500" }) }), _jsx(motion.button, { className: '!bg-white', onClick: () => handleShare(post._id), whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: _jsx(Share2, { size: 20, className: "!text-gray-600 !hover:text-gray-500" }) })] }), _jsxs("div", { className: "!flex !gap-3 !text-xs !text-gray-600", children: [_jsxs("span", { children: [post.likeCount, " likes"] }), post.likes.includes(userId) ? (_jsx("span", { children: "0 dislikes" })) : (_jsx("span", { children: "1 dislike" })), _jsxs("span", { children: [post.commentCount, " comments"] })] }), _jsx(AnimatePresence, { children: showComments && (_jsxs(motion.div, { className: "!flex !flex-col !gap-2 !mt-2 !max-h-48 !overflow-y-auto !border-t !border-gray-200 !pt-2", initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.3 }, children: [_jsxs("div", { className: "!flex !gap-2 !items-center", children: [_jsx("input", { type: "text", value: newComment, onChange: (e) => setNewComment(e.target.value), className: "!flex-1 !p-2 !border !border-gray-300 !rounded-full !text-sm !bg-black !text-white !focus:outline-none !focus:ring-2 !focus:ring-gray-500", placeholder: "Add a comment..." }), _jsx(motion.button, { className: '!bg-white', onClick: handleCommentSubmit, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: _jsx(Send, { size: 18, className: "!text-gray-500 !hover:text-gray-400" }) })] }), comments.length > 0 ? (comments.map((comment, index) => (_jsxs("div", { className: "!flex !gap-2 !text-xs", children: [_jsx("span", { className: "!font-semibold !text-gray-900", children: comment.username || comment.userId || 'Anonymous' }), _jsx("span", { className: "!text-gray-600", children: comment.content })] }, index)))) : (_jsx("p", { className: "!text-xs !text-gray-600 !text-center", children: "No comments yet." }))] })) }), _jsx(motion.button, { className: "!flex !items-center !justify-center !gap-1 !text-xs !text-gray-500 !mt-1 !bg-white", onClick: toggleComments, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: showComments ? (_jsxs(_Fragment, { children: ["Hide Comments ", _jsx(ChevronUp, { size: 14 })] })) : (_jsxs(_Fragment, { children: ["Show Comments ", _jsx(ChevronDown, { size: 14 })] })) })] })] })] }) })] }));
};
export default PostView;
