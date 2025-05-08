import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePostFeed } from '@/hooks/usePostFeed';
import { CommunityService } from '@/services/CommunityService';
import { Heart, HeartCrack, MessageSquare, ChevronDown, ChevronUp, Send, Share2 } from 'lucide-react';
import { useAppSelector } from '@/redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Toaster } from 'react-hot-toast';
const PostFeed = () => {
    const [showComments, setShowComments] = useState([]);
    const [newComment, setNewComment] = useState({});
    const [comments, setComments] = useState({});
    const userId = useAppSelector((state) => state.user.userId);
    const { allPosts, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error, handleLike, handleDislike, handleComment, handleShare, // Add handleShare from the hook
     } = usePostFeed();
    console.log('allPosts in PostFeed:', allPosts);
    const { ref, inView } = useInView({ threshold: 0 });
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
    const toggleComments = async (postId) => {
        setShowComments(prev => prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]);
        if (!comments[postId]) {
            const communityService = new CommunityService();
            const fetchedComments = await communityService.getPostComments(postId);
            setComments(prev => ({
                ...prev,
                [postId]: fetchedComments.slice(0, 10), // Limit to 10 most recent comments
            }));
        }
    };
    const handleCommentSubmit = (postId) => {
        if (newComment[postId]?.trim()) {
            handleComment(postId, newComment[postId]);
            setNewComment(prev => ({ ...prev, [postId]: '' }));
        }
    };
    // Animation variants for the "COMMUNITY" text
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };
    const letterVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.8 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };
    const communityText = "COMMUNITY".split('');
    return (_jsxs("div", { className: "!p-4 !bg-black", children: [_jsx(Toaster, { position: "top-center", toastOptions: {
                    style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '14px',
                    },
                } }), _jsx(motion.div, { className: "!max-w-md !mx-auto !mb-6 !text-center", variants: containerVariants, initial: "hidden", animate: "visible", children: _jsxs("h1", { className: "!text-3xl !font-bold !text-white !uppercase !tracking-wider !relative !inline-block", children: [communityText.map((letter, index) => (_jsx(motion.span, { variants: letterVariants, className: "!inline-block", children: letter }, index))), _jsx("span", { className: "!absolute !bottom-0 !left-0 !w-full !h-1 !bg-gradient-to-r !from-blue-500 !to-gray-500 !rounded-full" })] }) }), isError && error && (_jsx("div", { className: "!text-red-500 !text-center !mb-4 !text-lg !font-medium", children: error })), allPosts.length > 0 ? (_jsx("div", { className: "!flex !flex-col !max-w-md !mx-auto !gap-4", children: allPosts.map((post, index) => (_jsxs(motion.div, { className: "!bg-white !rounded-lg !shadow-md !flex !flex-col", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.1 }, children: [_jsxs("div", { className: "!flex !items-center !p-3 !border-b !border-gray-200", children: [_jsx("img", { src: post.userId.profileImage || 'https://via.placeholder.com/40', alt: "Profile", className: "!w-8 !h-8 !rounded-full !object-cover !mr-3 !border-2 !border-blue-500" }), _jsxs("div", { className: "!flex !flex-col", children: [_jsx("span", { className: "!text-sm !font-semibold !text-gray-900", children: post.userId.username || 'Anonymous' }), _jsx("span", { className: "!text-xs !text-gray-500", children: formatDistanceToNow(new Date(post.timestamp), { addSuffix: true }) })] })] }), _jsxs("div", { className: "!flex !flex-col", children: [post.mediaUrl && (_jsx("div", { className: "!w-full !aspect-square", children: _jsx("img", { src: post.mediaUrl, alt: "Post", className: "!w-full !h-full !object-cover" }) })), _jsx("div", { className: "!p-3", children: _jsx("p", { className: "!text-sm !text-gray-900 !mb-2", children: post.content || 'No caption' }) }), _jsxs("div", { className: "!p-3 !border-t !border-gray-200 !flex !flex-col !gap-2", children: [_jsxs("div", { className: "!flex !gap-4 !text-sm !text-gray-600", children: [_jsx(motion.button, { className: '!bg-white', onClick: () => handleLike(post._id), whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: _jsx(Heart, { size: 20, className: post.likes.includes(userId)
                                                            ? '!text-red-600 !fill-red-600'
                                                            : '!text-gray-600 !hover:text-red-600' }) }), _jsx(motion.button, { className: '!bg-white', onClick: () => handleDislike(post._id), whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: _jsx(HeartCrack, { size: 20, className: post.likes.includes(userId)
                                                            ? '!text-gray-600 !hover:text-red-600'
                                                            : '!text-red-600 !fill-red-600' }) }), _jsx(motion.button, { className: '!bg-white', onClick: () => toggleComments(post._id), whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: _jsx(MessageSquare, { size: 20, className: "!text-gray-600 !hover:text-gray-500" }) }), _jsx(motion.button, { className: '!bg-white', onClick: () => handleShare(post._id), whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: _jsx(Share2, { size: 20, className: "!text-gray-600 !hover:text-gray-500" }) })] }), _jsxs("div", { className: "!flex !gap-3 !text-xs !text-gray-600", children: [_jsxs("span", { children: [post.likeCount, " likes"] }), post.likes.includes(userId) ? (_jsx("span", { children: "0 dislikes" })) : (_jsx("span", { children: "1 dislike" })), _jsxs("span", { children: [post.commentCount, " comments"] })] }), _jsx(AnimatePresence, { children: showComments.includes(post._id) && (_jsxs(motion.div, { className: "!flex !flex-col !gap-2 !mt-2 !max-h-48 !overflow-y-auto !border-t !border-gray-200 !pt-2", initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.3 }, children: [_jsxs("div", { className: "!flex !gap-2 !items-center", children: [_jsx("input", { type: "text", value: newComment[post._id] || '', onChange: (e) => setNewComment({
                                                                    ...newComment,
                                                                    [post._id]: e.target.value,
                                                                }), className: "!flex-1 !p-2 !border !border-gray-300 !rounded-full !text-sm !bg-black !text-white !focus:outline-none !focus:ring-2 !focus:ring-gray-500", placeholder: "Add a comment..." }), _jsx(motion.button, { className: '!bg-white', onClick: () => handleCommentSubmit(post._id), whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: _jsx(Send, { size: 18, className: "!text-gray-500 !hover:text-gray-400" }) })] }), comments[post._id] && comments[post._id].length > 0 ? (comments[post._id].map((comment, index) => (_jsxs("div", { className: "!flex !gap-2 !text-xs", children: [_jsx("span", { className: "!font-semibold !text-gray-900", children: comment.username || comment.userId || 'Anonymous' }), _jsx("span", { className: "!text-gray-600", children: comment.content })] }, index)))) : (_jsx("p", { className: "!text-xs !text-gray-600 !text-center", children: "No comments yet." }))] })) }), _jsx(motion.button, { className: "!flex !items-center !justify-center !gap-1 !text-xs !text-gray-500 !mt-1 !bg-white", onClick: () => toggleComments(post._id), whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: showComments.includes(post._id) ? (_jsxs(_Fragment, { children: ["Hide Comments ", _jsx(ChevronUp, { size: 14 })] })) : (_jsxs(_Fragment, { children: ["Show Comments ", _jsx(ChevronDown, { size: 14 })] })) })] })] })] }, post._id ?? ''))) })) : (_jsx(motion.div, { className: "!bg-white !rounded-lg !shadow-md !p-6 !text-center !max-w-md !mx-auto", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, children: _jsx("p", { className: "!text-lg !text-gray-600 !mb-4", children: "No posts available. Follow more friends to see their posts!" }) })), _jsxs("div", { ref: ref, className: "!mt-6 !text-center", children: [isFetchingNextPage ? (_jsx("div", { className: "!text-gray-500 !text-lg", children: "Loading more posts..." })) : null, !hasNextPage && allPosts.length > 0 && (_jsx("div", { className: "!text-gray-600 !text-lg", children: "No more posts" }))] })] }));
};
export default PostFeed;
