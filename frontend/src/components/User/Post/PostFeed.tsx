// import React, { useState, useEffect } from 'react';
// import { useInView } from 'react-intersection-observer';
// import { usePostFeed } from '@/hooks/usePostFeed';
// import { CommunityService, IComment } from '@/services/CommunityService';
// import { Heart, HeartCrack, MessageSquare, ChevronDown, ChevronUp, Send, Share2 } from 'lucide-react';
// import { useAppSelector } from '@/redux/store';
// import { motion, AnimatePresence } from 'framer-motion';
// import { formatDistanceToNow } from 'date-fns';
// import { Toaster } from 'react-hot-toast';

// const PostFeed: React.FC = () => {
//   const [showComments, setShowComments] = useState<string[]>([]);
//   const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
//   const [comments, setComments] = useState<{ [key: string]: IComment[] }>({});
//   const userId = useAppSelector((state) => state.user.userId);
//   const {
//     allPosts,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isError,
//     error,
//     handleLike,
//     handleDislike,
//     handleComment,
//     handleShare, // Add handleShare from the hook
//   } = usePostFeed();

//   const { ref, inView } = useInView({ threshold: 0 });

//   useEffect(() => {
//     if (inView && hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

//   const toggleComments = async (postId: string) => {
//     setShowComments(prev =>
//       prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
//     );
//     if (!comments[postId]) {
//       const communityService = new CommunityService();
//       const fetchedComments = await communityService.getPostComments(postId);
//       setComments(prev => ({
//         ...prev,
//         [postId]: fetchedComments.slice(0, 10), // Limit to 10 most recent comments
//       }));
//     }
//   };

  
//   const handleCommentSubmit = (postId: string) => {
//     if (newComment[postId]?.trim()) {
//       handleComment(postId, newComment[postId]);
//       setNewComment(prev => ({ ...prev, [postId]: '' }));
//     }
//   };

//   // Animation variants for the "COMMUNITY" text
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const letterVariants = {
//     hidden: { opacity: 0, y: 20, scale: 0.8 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         duration: 0.5,
//         ease: 'easeOut',
//       },
//     },
//   };

//   const communityText = "COMMUNITY".split('');

//   return (
//     <div className="!p-4 !bg-black">
//       <Toaster
//         position="top-center"
//         toastOptions={{
//           style: {
//             background: '#333',
//             color: '#fff',
//             borderRadius: '8px',
//             padding: '8px 16px',
//             fontSize: '14px',
//           },
//         }}
//       />

      
//       <motion.div
//         className="!max-w-md !mx-auto !mb-6 !text-center"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <h1 className="!text-3xl !font-bold !text-white !uppercase !tracking-wider !relative !inline-block">
//           {communityText.map((letter, index) => (
//             <motion.span
//               key={index}
//               variants={letterVariants}
//               className="!inline-block"
//             >
//               {letter}
//             </motion.span>
//           ))}
         
//           <span className="!absolute !bottom-0 !left-0 !w-full !h-1 !bg-gradient-to-r !from-blue-500 !to-gray-500 !rounded-full" />
//         </h1>
//       </motion.div>

//       {isError && error && (
//         <div className="!text-red-500 !text-center !mb-4 !text-lg !font-medium">{error}</div>
//       )}
//       {allPosts.length > 0 ? (
//         <div className="!flex !flex-col !max-w-md !mx-auto !gap-4">
//           {allPosts.map((post, index) => (
//             <motion.div
//               key={post._id ?? ''}
//               className="!bg-white !rounded-lg !shadow-md !flex !flex-col"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//             >
              
//               <div className="!flex !items-center !p-3 !border-b !border-gray-200">
//                 <img
//                   src={post.userId.profileImage || 'https://via.placeholder.com/40'}
//                   alt="Profile"
//                   className="!w-8 !h-8 !rounded-full !object-cover !mr-3 !border-2 !border-blue-500"
//                 />
//                 <div className="!flex !flex-col">
//                   <span className="!text-sm !font-semibold !text-gray-900">
//                     {post.userId.username || 'Anonymous'}
//                   </span>
//                   <span className="!text-xs !text-gray-500">
//                     {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
//                   </span>
//                 </div>
//               </div>

             
//               <div className="!flex !flex-col">
//                 {post.mediaUrl && (
//                   <div className="!w-full !aspect-square">
//                     <img
//                       src={post.mediaUrl}
//                       alt="Post"
//                       className="!w-full !h-full !object-cover"
//                     />
//                   </div>
//                 )}
//                 <div className="!p-3">
//                   <p className="!text-sm !text-gray-900 !mb-2">
//                     {post.content || 'No caption'}
//                   </p>
//                 </div>

                
//                 <div className="!p-3 !border-t !border-gray-200 !flex !flex-col !gap-2">
//                   <div className="!flex !gap-4 !text-sm !text-gray-600">
//                     <motion.button
//                       className='!bg-white'
//                       onClick={() => handleLike(post._id!)}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <Heart
//                         size={20}
//                         className={
//                           post.likes.includes(userId as string)
//                             ? '!text-red-600 !fill-red-600'
//                             : '!text-gray-600 !hover:text-red-600'
//                         }
//                       />
//                     </motion.button>
//                     <motion.button
//                       className='!bg-white'
//                       onClick={() => handleDislike(post._id!)}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <HeartCrack
//                         size={20}
//                         className={
//                           post.likes.includes(userId as string)
//                             ? '!text-gray-600 !hover:text-red-600'
//                             : '!text-red-600 !fill-red-600'
//                         }
//                       />
//                     </motion.button>
//                     <motion.button
//                       className='!bg-white'
//                       onClick={() => toggleComments(post._id!)}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <MessageSquare
//                         size={20}
//                         className="!text-gray-600 !hover:text-gray-500"
//                       />
//                     </motion.button>
//                     <motion.button
//                       className='!bg-white'
//                       onClick={() => handleShare(post._id!)}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <Share2
//                         size={20}
//                         className="!text-gray-600 !hover:text-gray-500"
//                       />
//                     </motion.button>
//                   </div>
//                   <div className="!flex !gap-3 !text-xs !text-gray-600">
//                     <span>{post.likeCount} likes</span>
//                     {post.likes.includes(userId as string) ? (
//                       <span>0 dislikes</span>
//                     ) : (
//                       <span>1 dislike</span>
//                     )}
//                     <span>{post.commentCount} comments</span>
//                   </div>

//                   {/* Comment Section */}
//                   <AnimatePresence>
//                     {showComments.includes(post._id!) && (
//                       <motion.div
//                         className="!flex !flex-col !gap-2 !mt-2 !max-h-48 !overflow-y-auto !border-t !border-gray-200 !pt-2"
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: 'auto', opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         {/* Comment Input */}
//                         <div className="!flex !gap-2 !items-center">
//                           <input
//                             type="text"
//                             value={newComment[post._id!] || ''}
//                             onChange={(e) =>
//                               setNewComment({
//                                 ...newComment,
//                                 [post._id!]: e.target.value,
//                               })
//                             }
//                             className="!flex-1 !p-2 !border !border-gray-300 !rounded-full !text-sm !bg-black !text-white !focus:outline-none !focus:ring-2 !focus:ring-gray-500"
//                             placeholder="Add a comment..."
//                           />
//                           <motion.button
//                             className='!bg-white'
//                             onClick={() => handleCommentSubmit(post._id!)}
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.9 }}
//                           >
//                             <Send
//                               size={18}
//                               className="!text-gray-500 !hover:text-gray-400"
//                             />
//                           </motion.button>
//                         </div>

                        
//                         {comments[post._id!] && comments[post._id!].length > 0 ? (
//                           comments[post._id!].map((comment, index) => (
//                             <div key={index} className="!flex !gap-2 !text-xs">
//                               <span className="!font-semibold !text-gray-900">
//                                 {comment.username || comment.userId || 'Anonymous'}
//                               </span>
//                               <span className="!text-gray-600">{comment.content}</span>
//                             </div>
//                           ))
//                         ) : (
//                           <p className="!text-xs !text-gray-600 !text-center">
//                             No comments yet.
//                           </p>
//                         )}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>

                 
//                   <motion.button
//                     className="!flex !items-center !justify-center !gap-1 !text-xs !text-gray-500 !mt-1 !bg-white"
//                     onClick={() => toggleComments(post._id!)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     {showComments.includes(post._id!) ? (
//                       <>
//                         Hide Comments <ChevronUp size={14} />
//                       </>
//                     ) : (
//                       <>
//                         Show Comments <ChevronDown size={14} />
//                       </>
//                     )}
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       ) : (
//         <motion.div
//           className="!bg-white !rounded-lg !shadow-md !p-6 !text-center !max-w-md !mx-auto"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <p className="!text-lg !text-gray-600 !mb-4">
//             No posts available. Follow more friends to see their posts!
//           </p>
//         </motion.div>
//       )}
//       <div ref={ref} className="!mt-6 !text-center">
//         {isFetchingNextPage ? (
//           <div className="!text-gray-500 !text-lg">Loading more posts...</div>
//         ) : null}
//         {!hasNextPage && allPosts.length > 0 && (
//           <div className="!text-gray-600 !text-lg">No more posts</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PostFeed;







// import React, { useState, useEffect, useRef } from 'react';
// import { useInView } from 'react-intersection-observer';
// import { usePostFeed } from '@/hooks/usePostFeed';
// import { CommunityService, IComment } from '@/services/CommunityService';
// import { Heart, HeartCrack, MessageSquare, ChevronDown, ChevronUp, Send, Share2, X } from 'lucide-react';
// import { useAppSelector } from '@/redux/store';
// import { motion, AnimatePresence } from 'framer-motion';
// import { formatDistanceToNow } from 'date-fns';
// import { Toaster, toast } from 'react-hot-toast';

// const PostFeed: React.FC = () => {
//   const [showComments, setShowComments] = useState<string[]>([]);
//   const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
//   const [comments, setComments] = useState<{ [key: string]: IComment[] }>({});
//   const [showLikesModal, setShowLikesModal] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
//   const [likers, setLikers] = useState<{ [key: string]: { _id: string; username: string }[] }>({});
//   const [isLoadingLikers, setIsLoadingLikers] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState<{ [key: string]: boolean }>({});
//   const userId = useAppSelector((state) => state.user.userId);
//   const {
//     allPosts,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isError,
//     error,
//     handleLike,
//     handleDislike,
//     handleComment,
//     handleShare,
//   } = usePostFeed();

//   const { ref, inView } = useInView({ threshold: 0 });
//   const modalRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (inView && hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

//   // Fetch likers when modal opens
//   useEffect(() => {
//     const fetchLikers = async () => {
//       if (selectedPostId && !likers[selectedPostId]) {
//         setIsLoadingLikers(true);
//         try {
//           const post = allPosts.find((p) => p._id === selectedPostId);
//           if (post && post.likes.length > 0) {
//             const communityService = new CommunityService();
//             const users = await communityService.getPostLikers(selectedPostId);
//             setLikers((prev) => ({
//               ...prev,
//               [selectedPostId]: users,
//             }));
//           } else {
//             setLikers((prev) => ({
//               ...prev,
//               [selectedPostId]: [],
//             }));
//           }
//         } catch (err) {
//           console.error('Failed to fetch likers:', err);
//           setLikers((prev) => ({
//             ...prev,
//             [selectedPostId]: [],
//           }));
//         } finally {
//           setIsLoadingLikers(false);
//         }
//       }
//     };
//     if (showLikesModal && selectedPostId) {
//       fetchLikers();
//     }
//   }, [showLikesModal, selectedPostId, likers, allPosts]);

//   // Close modal on click outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         setShowLikesModal(false);
//         setSelectedPostId(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const toggleComments = async (postId: string) => {
//     setShowComments((prev) =>
//       prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
//     );
//     // Always fetch comments to ensure freshness
//     const communityService = new CommunityService();
//     try {
//       const fetchedComments = await communityService.getPostComments(postId);
//       console.log(`Fetched comments for post ${postId}:`, fetchedComments);
//       setComments((prev) => ({
//         ...prev,
//         [postId]: fetchedComments.slice(0, 10),
//       }));
//     } catch (err) {
//       console.error(`Failed to fetch comments for post ${postId}:`, err);
//       toast.error('Failed to load comments.', {
//         style: {
//           background: '#333',
//           color: '#fff',
//           borderRadius: '8px',
//           padding: '8px 16px',
//           fontSize: '14px',
//         },
//       });
//     }
//   };

//   const handleCommentSubmit = async (postId: string) => {
//     if (newComment[postId]?.trim() && !isSubmitting[postId]) {
//       setIsSubmitting((prev) => ({ ...prev, [postId]: true }));
//       try {
//         // Submit the comment
//         await handleComment(postId, newComment[postId]);
//         console.log(`Comment submitted for post ${postId}`);

//         // Clear the input field
//         setNewComment((prev) => ({ ...prev, [postId]: '' }));

//         // Fetch updated comments
//         const communityService = new CommunityService();
//         const fetchedComments = await communityService.getPostComments(postId);
//         console.log(`Fetched comments after submission for post ${postId}:`, fetchedComments);

//         // Update comments state
//         setComments((prev) => {
//           const updatedComments = {
//             ...prev,
//             [postId]: fetchedComments.slice(0, 10),
//           };
//           console.log(`Updated comments state for post ${postId}:`, updatedComments[postId]);
//           return updatedComments;
//         });
//       } catch (error) {
//         console.error('Failed to submit comment:', error);
//         toast.error('Failed to post comment. Please try again.', {
//           style: {
//             background: '#333',
//             color: '#fff',
//             borderRadius: '8px',
//             padding: '8px 16px',
//             fontSize: '14px',
//           },
//         });
//       } finally {
//         setIsSubmitting((prev) => ({ ...prev, [postId]: false }));
//       }
//     }
//   };

//   const handleLikeCountClick = (postId: string) => {
//     setSelectedPostId(postId);
//     setShowLikesModal(true);
//   };

//   // Animation variants for the "COMMUNITY" text
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const letterVariants = {
//     hidden: { opacity: 0, y: 20, scale: 0.8 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         duration: 0.5,
//         ease: 'easeOut',
//       },
//     },
//   };

//   // Modal animation variants
//   const modalVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
//     exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
//   };

//   const communityText = "COMMUNITY".split('');

//   return (
//     <div className="!p-4 !bg-black">
//       <Toaster
//         position="top-center"
//         toastOptions={{
//           style: {
//             background: '#333',
//             color: '#fff',
//             borderRadius: '8px',
//             padding: '8px 16px',
//             fontSize: '14px',
//           },
//         }}
//       />

//       <motion.div
//         className="!max-w-md !mx-auto !mb-6 !text-center"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <h1 className="!text-3xl !font-bold !text-white !uppercase !tracking-wider !relative !inline-block">
//           {communityText.map((letter, index) => (
//             <motion.span
//               key={index}
//               variants={letterVariants}
//               className="!inline-block"
//             >
//               {letter}
//             </motion.span>
//           ))}
//           <span className="!absolute !bottom-0 !left-0 !w-full !h-1 !bg-gradient-to-r !from-blue-500 !to-gray-500 !rounded-full" />
//         </h1>
//       </motion.div>

//       {isError && error && (
//         <div className="!text-red-500 !text-center !mb-4 !text-lg !font-medium">{error}</div>
//       )}
//       {allPosts.length > 0 ? (
//         <div className="!flex !flex-col !max-w-md !mx-auto !gap-4">
//           {allPosts.map((post, index) => (
//             <motion.div
//               key={post._id ?? ''}
//               className="!bg-white !rounded-lg !shadow-md !flex !flex-col"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//             >
//               <div className="!flex !items-center !p-3 !border-b !border-gray-200">
//                 <img
//                   src={post.userId.profileImage || 'https://via.placeholder.com/40'}
//                   alt="Profile"
//                   className="!w-8 !h-8 !rounded-full !object-cover !mr-3 !border-2 !border-blue-500"
//                 />
//                 <div className="!flex !flex-col">
//                   <span className="!text-sm !font-semibold !text-gray-900">
//                     {post.userId.username || 'Anonymous'}
//                   </span>
//                   <span className="!text-xs !text-gray-500">
//                     {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
//                   </span>
//                 </div>
//               </div>

//               <div className="!flex !flex-col">
//                 {post.mediaUrl && (
//                   <div className="!w-full !aspect-square">
//                     <img
//                       src={post.mediaUrl}
//                       alt="Post"
//                       className="!w-full !h-full !object-cover"
//                     />
//                   </div>
//                 )}
//                 <div className="!p-3">
//                   <p className="!text-sm !text-gray-900 !mb-2">
//                     {post.content || 'No caption'}
//                   </p>
//                 </div>

//                 <div className="!p-3 !border-t !border-gray-200 !flex !flex-col !gap-2">
//                   <div className="!flex !gap-4 !text-sm !text-gray-600">
//                     <motion.button
//                       className="!bg-white"
//                       onClick={() => handleLike(post._id!)}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <Heart
//                         size={20}
//                         className={
//                           post.likes.includes(userId as string)
//                             ? '!text-red-600 !fill-red-600'
//                             : '!text-gray-600 !hover:text-red-600'
//                         }
//                       />
//                     </motion.button>
//                     <motion.button
//                       className="!bg-white"
//                       onClick={() => handleDislike(post._id!)}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <HeartCrack
//                         size={20}
//                         className={
//                           post.likes.includes(userId as string)
//                             ? '!text-gray-600 !hover:text-red-600'
//                             : '!text-red-600 !fill-red-600'
//                         }
//                       />
//                     </motion.button>
//                     <motion.button
//                       className="!bg-white"
//                       onClick={() => toggleComments(post._id!)}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <MessageSquare
//                         size={20}
//                         className="!text-gray-600 !hover:text-gray-500"
//                       />
//                     </motion.button>
//                     <motion.button
//                       className="!bg-white"
//                       onClick={() => handleShare(post._id!)}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <Share2
//                         size={20}
//                         className="!text-gray-600 !hover:text-gray-500"
//                       />
//                     </motion.button>
//                   </div>
//                   <div className="!flex !gap-3 !text-xs !text-gray-600">
//                     <motion.button
//                       className="!text-xs !text-gray-600 !hover:text-blue-500"
//                       onClick={() => handleLikeCountClick(post._id!)}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       {post.likeCount} likes
//                     </motion.button>
//                     {post.likes.includes(userId as string) ? (
//                       <span>0 dislikes</span>
//                     ) : (
//                       <span>1 dislike</span>
//                     )}
//                     <span>{post.commentCount} comments</span>
//                   </div>

//                   <AnimatePresence>
//                     {showComments.includes(post._id!) && (
//                       <motion.div
//                         className="!flex !flex-col !gap-2 !mt-2 !max-h-48 !overflow-y-auto !border-t !border-gray-200 !pt-2"
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: 'auto', opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         key={`comments-${post._id}`}
//                       >
//                         <div className="!flex !gap-2 !items-center">
//                           <input
//                             type="text"
//                             value={newComment[post._id!] || ''}
//                             onChange={(e) =>
//                               setNewComment({
//                                 ...newComment,
//                                 [post._id!]: e.target.value,
//                               })
//                             }
//                             className="!flex-1 !p-2 !border !border-gray-300 !rounded-full !text-sm !bg-black !text-white !focus:outline-none !focus:ring-2 !focus:ring-gray-500"
//                             placeholder="Add a comment..."
//                             disabled={isSubmitting[post._id!]}
//                           />
//                           <motion.button
//                             className="!bg-white"
//                             onClick={() => handleCommentSubmit(post._id!)}
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.9 }}
//                             disabled={isSubmitting[post._id!]}
//                           >
//                             <Send
//                               size={18}
//                               className={
//                                 isSubmitting[post._id!]
//                                   ? '!text-gray-300'
//                                   : '!text-gray-500 !hover:text-gray-400'
//                               }
//                             />
//                           </motion.button>
//                         </div>

//                         {isSubmitting[post._id!] && (
//                           <p className="!text-xs !text-gray-600 !text-center">Posting comment...</p>
//                         )}

//                         {comments[post._id!] && comments[post._id!].length > 0 ? (
//                           comments[post._id!].map((comment, index) => (
//                             <div key={comment._id || index} className="!flex !gap-2 !text-xs">
//                               <span className="!font-semibold !text-gray-900">
//                                 {comment.username || comment.userId || 'Anonymous'}
//                               </span>
//                               <span className="!text-gray-600">{comment.content}</span>
//                             </div>
//                           ))
//                         ) : (
//                           <p className="!text-xs !text-gray-600 !text-center">
//                             No comments yet.
//                           </p>
//                         )}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>

//                   <motion.button
//                     className="!flex !items-center !justify-center !gap-1 !text-xs !text-gray-500 !mt-1 !bg-white"
//                     onClick={() => toggleComments(post._id!)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     {showComments.includes(post._id!) ? (
//                       <>
//                         Hide Comments <ChevronUp size={14} />
//                       </>
//                     ) : (
//                       <>
//                         Show Comments <ChevronDown size={14} />
//                       </>
//                     )}
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       ) : (
//         <motion.div
//           className="!bg-white !rounded-lg !shadow-md !p-6 !text-center !max-w-md !mx-auto"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <p className="!text-lg !text-gray-600 !mb-4">
//             No posts available. Follow more friends to see their posts!
//           </p>
//         </motion.div>
//       )}

//       <AnimatePresence>
//         {showLikesModal && selectedPostId && (
//           <motion.div
//             className="!fixed !inset-0 !bg-black !bg-opacity-50 !flex !items-center !justify-center !z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               ref={modalRef}
//               className="!bg-white !rounded-lg !shadow-md !p-4 !max-w-xs !w-full !max-h-[70vh] !flex !flex-col"
//               variants={modalVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//             >
//               <div className="!flex !justify-between !items-center !mb-4">
//                 <h2 className="!text-lg !font-semibold !text-gray-900">Liked by</h2>
//                 <motion.button
//                   className="!bg-white"
//                   onClick={() => {
//                     setShowLikesModal(false);
//                     setSelectedPostId(null);
//                   }}
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                 >
//                   <X size={20} className="!text-gray-600 !hover:text-gray-500" />
//                 </motion.button>
//               </div>
//               <div className="!flex-1 !overflow-y-auto">
//                 {isLoadingLikers ? (
//                   <p className="!text-sm !text-gray-600 !text-center">Loading...</p>
//                 ) : likers[selectedPostId]?.length > 0 ? (
//                   likers[selectedPostId].map((user) => (
//                     <div
//                       key={user._id}
//                       className="!flex !items-center !gap-2 !py-2 !border-b !border-gray-200 !last:border-0"
//                     >
//                       <span className="!text-sm !text-gray-900">
//                         {user.username || 'Anonymous'}
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="!text-sm !text-gray-600 !text-center">
//                     No likes yet.
//                   </p>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div ref={ref} className="!mt-6 !text-center">
//         {isFetchingNextPage ? (
//           <div className="!text-gray-500 !text-lg">Loading more posts...</div>
//         ) : null}
//         {!hasNextPage && allPosts.length > 0 && (
//           <div className="!text-gray-600 !text-lg">No more posts</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PostFeed;


import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePostFeed } from '@/hooks/usePostFeed';
import { CommunityService, IComment } from '@/services/CommunityService';
import { Heart, HeartCrack, MessageSquare, ChevronDown, ChevronUp, Send, Share2, X } from 'lucide-react';
import { useAppSelector } from '@/redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Toaster, toast } from 'react-hot-toast';

const PostFeed: React.FC = () => {
  const [showComments, setShowComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [comments, setComments] = useState<{ [key: string]: IComment[] }>({});
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [likers, setLikers] = useState<{ [key: string]: { _id: string; username: string }[] }>({});
  const [isLoadingLikers, setIsLoadingLikers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<{ [key: string]: boolean }>({});
  const [isLiking, setIsLiking] = useState<{ [key: string]: boolean }>({});
  const userId = useAppSelector((state) => state.user.userId);
  const username = useAppSelector((state) => state.user.name) || 'Anonymous';
  const {
    allPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    handleLike,
    handleDislike,
    handleComment,
    handleShare,
  } = usePostFeed();

  const { ref, inView } = useInView({ threshold: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const fetchLikers = async () => {
      if (selectedPostId && !likers[selectedPostId]) {
        setIsLoadingLikers(true);
        try {
          const communityService = new CommunityService();
          const users = await communityService.getPostLikers(selectedPostId);
          console.log(`Fetched likers for post ${selectedPostId} (modal open):`, users);
          setLikers((prev) => ({
            ...prev,
            [selectedPostId]: users || [],
          }));
        } catch (err) {
          console.error(`Failed to fetch likers for post ${selectedPostId}:`, err);
          setLikers((prev) => ({
            ...prev,
            [selectedPostId]: [],
          }));
          toast.error('Failed to load likers.', {
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
            },
          });
        } finally {
          setIsLoadingLikers(false);
        }
      }
    };
    if (showLikesModal && selectedPostId) {
      fetchLikers();
    }
  }, [showLikesModal, selectedPostId, likers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowLikesModal(false);
        setSelectedPostId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleComments = async (postId: string) => {
    setShowComments((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
    const communityService = new CommunityService();
    try {
      const fetchedComments = await communityService.getPostComments(postId);
      console.log(`Fetched comments for post ${postId}:`, fetchedComments);
      setComments((prev) => ({
        ...prev,
        [postId]: fetchedComments.slice(0, 10),
      }));
    } catch (err) {
      console.error(`Failed to fetch comments for post ${postId}:`, err);
      toast.error('Failed to load comments.', {
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
        },
      });
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    if (newComment[postId]?.trim() && !isSubmitting[postId]) {
      setIsSubmitting((prev) => ({ ...prev, [postId]: true }));
      try {
        await handleComment(postId, newComment[postId]);
        console.log(`Comment submitted for post ${postId}`);
        setNewComment((prev) => ({ ...prev, [postId]: '' }));
        const communityService = new CommunityService();
        const fetchedComments = await communityService.getPostComments(postId);
        console.log(`Fetched comments after submission for post ${postId}:`, fetchedComments);
        setComments((prev) => {
          const updatedComments = {
            ...prev,
            [postId]: fetchedComments.slice(0, 10),
          };
          console.log(`Updated comments state for post ${postId}:`, updatedComments[postId]);
          return updatedComments;
        });
      } catch (error) {
        console.error('Failed to submit comment:', error);
        toast.error('Failed to post comment. Please try again.', {
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
          },
        });
      } finally {
        setIsSubmitting((prev) => ({ ...prev, [postId]: false }));
      }
    }
  };

  const handleLikeClick = async (postId: string) => {
    if (!isLiking[postId] && userId && postId) {
      setIsLiking((prev) => ({ ...prev, [postId]: true }));
      // Optimistically update likers
      const previousLikers = likers[postId] || [];
      setLikers((prev) => {
        const currentLikers = prev[postId] || [];
        if (currentLikers.some((liker) => liker._id === userId)) {
          return prev;
        }
        return {
          ...prev,
          [postId]: [...currentLikers, { _id: userId, username }],
        };
      });
      try {
        await handleLike(postId);
        console.log(`Like submitted for post ${postId}`);
        // Fetch updated likers
        const communityService = new CommunityService();
        const updatedLikers = await communityService.getPostLikers(postId);
        console.log(`Fetched likers after like for post ${postId}:`, updatedLikers);
        setLikers((prev) => ({
          ...prev,
          [postId]: updatedLikers || [],
        }));
      } catch (error) {
        console.error(`Failed to like post ${postId}:`, error);
        // Revert optimistic update
        setLikers((prev) => ({
          ...prev,
          [postId]: previousLikers,
        }));
        toast.error('Failed to like post. Please try again.', {
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
          },
        });
      } finally {
        setIsLiking((prev) => ({ ...prev, [postId]: false }));
      }
    } else {
      toast.error('Unable to like post. Please try again.', {
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
        },
      });
    }
  };

  const handleDislikeClick = (postId: string) => {
    if (!isLiking[postId] && userId && postId) {
      setIsLiking((prev) => ({ ...prev, [postId]: true }));
      setLikers((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).filter((liker) => liker._id !== userId),
      }));
      handleDislike(postId);
      setIsLiking((prev) => ({ ...prev, [postId]: false }));
    } else {
      toast.error('Unable to dislike post. Please try again.', {
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
        },
      });
    }
  };

  const handleLikeCountClick = async (postId: string) => {
    setSelectedPostId(postId);
    setShowLikesModal(true);
    setIsLoadingLikers(true);
    try {
      const communityService = new CommunityService();
      const users = await communityService.getPostLikers(postId);
      console.log(`Fetched likers for post ${postId} (like count click):`, users);
      setLikers((prev) => ({
        ...prev,
        [postId]: users || [],
      }));
    } catch (err) {
      console.error(`Failed to fetch likers for post ${postId}:`, err);
      setLikers((prev) => ({
        ...prev,
        [postId]: [],
      }));
      toast.error('Failed to load likers.', {
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
        },
      });
    } finally {
      setIsLoadingLikers(false);
    }
  };

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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const communityText = "COMMUNITY".split('');

  return (
    <div className="!p-4 !bg-black">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
          },
        }}
      />

      <motion.div
        className="!max-w-md !mx-auto !mb-6 !text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="!text-3xl !font-bold !text-white !uppercase !tracking-wider !relative !inline-block">
          {communityText.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="!inline-block"
            >
              {letter}
            </motion.span>
          ))}
          <span className="!absolute !bottom-0 !left-0 !w-full !h-1 !bg-gradient-to-r !from-blue-500 !to-gray-500 !rounded-full" />
        </h1>
      </motion.div>

      {isError && error && (
        <div className="!text-red-500 !text-center !mb-4 !text-lg !font-medium">{error}</div>
      )}
      {allPosts.length > 0 ? (
        <div className="!flex !flex-col !max-w-md !mx-auto !gap-4">
          {allPosts.map((post, index) => (
            <motion.div
              key={post._id ?? ''}
              className="!bg-white !rounded-lg !shadow-md !flex !flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="!flex !items-center !p-3 !border-b !border-gray-200">
                <img
                  src={post.userId.profileImage || 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="!w-8 !h-8 !rounded-full !object-cover !mr-3 !border-2 !border-blue-500"
                />
                <div className="!flex !flex-col">
                  <span className="!text-sm !font-semibold !text-gray-900">
                    {post.userId.username || 'Anonymous'}
                  </span>
                  <span className="!text-xs !text-gray-500">
                    {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="!flex !flex-col">
                {post.mediaUrl && (
                  <div className="!w-full !aspect-square">
                    <img
                      src={post.mediaUrl}
                      alt="Post"
                      className="!w-full !h-full !object-cover"
                    />
                  </div>
                )}
                <div className="!p-3">
                  <p className="!text-sm !text-gray-900 !mb-2">
                    {post.content || 'No caption'}
                  </p>
                </div>

                <div className="!p-3 !border-t !border-gray-200 !flex !flex-col !gap-2">
                  <div className="!flex !gap-4 !text-sm !text-gray-600">
                    <motion.button
                      className="!bg-white"
                      onClick={() => handleLikeClick(post._id!)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={isLiking[post._id!]}
                    >
                      <Heart
                        size={20}
                        className={
                          post.likes.includes(userId as string)
                            ? '!text-red-600 !fill-red-600'
                            : isLiking[post._id!]
                            ? '!text-gray-300'
                            : '!text-gray-600 !hover:text-red-600'
                        }
                      />
                    </motion.button>
                    <motion.button
                      className="!bg-white"
                      onClick={() => handleDislikeClick(post._id!)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={isLiking[post._id!]}
                    >
                      <HeartCrack
                        size={20}
                        className={
                          post.likes.includes(userId as string)
                            ? isLiking[post._id!]
                              ? '!text-gray-300'
                              : '!text-gray-600 !hover:text-red-600'
                            : '!text-red-600 !fill-red-600'
                        }
                      />
                    </motion.button>
                    <motion.button
                      className="!bg-white"
                      onClick={() => toggleComments(post._id!)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MessageSquare
                        size={20}
                        className="!text-gray-600 !hover:text-gray-500"
                      />
                    </motion.button>
                    <motion.button
                      className="!bg-white"
                      onClick={() => handleShare(post._id!)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2
                        size={20}
                        className="!text-gray-600 !hover:text-gray-500"
                      />
                    </motion.button>
                  </div>
                  <div className="!flex !gap-3 !text-xs !text-gray-600">
                    <motion.button
                      className="!text-xs !text-gray-600 !hover:text-blue-500"
                      onClick={() => handleLikeCountClick(post._id!)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {post.likeCount} likes
                    </motion.button>
                    <span>{post.likes.includes(userId as string) ? '0' : '1'} dislikes</span>
                    <span>{post.commentCount} comments</span>
                  </div>

                  <AnimatePresence>
                    {showComments.includes(post._id!) && (
                      <motion.div
                        className="!flex !flex-col !gap-2 !mt-2 !max-h-48 !overflow-y-auto !border-t !border-gray-200 !pt-2"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        key={`comments-${post._id}`}
                      >
                        <div className="!flex !gap-2 !items-center">
                          <input
                            type="text"
                            value={newComment[post._id!] || ''}
                            onChange={(e) =>
                              setNewComment({
                                ...newComment,
                                [post._id!]: e.target.value,
                              })
                            }
                            className="!flex-1 !p-2 !border !border-gray-300 !rounded-full !text-sm !bg-black !text-white !focus:outline-none !focus:ring-2 !focus:ring-gray-500"
                            placeholder="Add a comment..."
                            disabled={isSubmitting[post._id!]}
                          />
                          <motion.button
                            className="!bg-white"
                            onClick={() => handleCommentSubmit(post._id!)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={isSubmitting[post._id!]}
                          >
                            <Send
                              size={18}
                              className={
                                isSubmitting[post._id!]
                                  ? '!text-gray-300'
                                  : '!text-gray-500 !hover:text-gray-400'
                              }
                            />
                          </motion.button>
                        </div>

                        {isSubmitting[post._id!] && (
                          <p className="!text-xs !text-gray-600 !text-center">Posting comment...</p>
                        )}

                        {comments[post._id!] && comments[post._id!].length > 0 ? (
                          comments[post._id!].map((comment, index) => (
                            <div key={comment._id || index} className="!flex !gap-2 !text-xs">
                              <span className="!font-semibold !text-gray-900">
                                {comment.username || comment.userId || 'Anonymous'}
                              </span>
                              <span className="!text-gray-600">{comment.content}</span>
                            </div>
                          ))
                        ) : (
                          <p className="!text-xs !text-gray-600 !text-center">
                            No comments yet.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    className="!flex !items-center !justify-center !gap-1 !text-xs !text-gray-500 !mt-1 !bg-white"
                    onClick={() => toggleComments(post._id!)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showComments.includes(post._id!) ? (
                      <>
                        Hide Comments <ChevronUp size={14} />
                      </>
                    ) : (
                      <>
                        Show Comments <ChevronDown size={14} />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="!bg-white !rounded-lg !shadow-md !p-6 !text-center !max-w-md !mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="!text-lg !text-gray-600 !mb-4">
            No posts available. Follow more friends to see their posts!
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {showLikesModal && selectedPostId && (
          <motion.div
            className="!fixed !inset-0 !bg-black !bg-opacity-50 !flex !items-center !justify-center !z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={modalRef}
              className="!bg-white !rounded-lg !shadow-md !p-4 !max-w-xs !w-full !max-h-[70vh] !flex !flex-col"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="!flex !justify-between !items-center !mb-4">
                <h2 className="!text-lg !font-semibold !text-gray-900">Liked by</h2>
                <motion.button
                  className="!bg-white"
                  onClick={() => {
                    setShowLikesModal(false);
                    setSelectedPostId(null);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} className="!text-gray-600 !hover:text-gray-500" />
                </motion.button>
              </div>
              <div className="!flex-1 !overflow-y-auto">
                {isLoadingLikers ? (
                  <p className="!text-sm !text-gray-600 !text-center">Loading...</p>
                ) : likers[selectedPostId]?.length > 0 ? (
                  likers[selectedPostId].map((user) => (
                    <div
                      key={user._id}
                      className="!flex !items-center !gap-2 !py-2 !border-b !border-gray-200 !last:border-0"
                    >
                      <span className="!text-sm !text-gray-900">
                        {user.username || 'Anonymous'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="!text-sm !text-gray-600 !text-center">
                    No likes yet.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={ref} className="!mt-6 !text-center">
        {isFetchingNextPage ? (
          <div className="!text-gray-500 !text-lg">Loading more posts...</div>
        ) : null}
        {!hasNextPage && allPosts.length > 0 && (
          <div className="!text-gray-600 !text-lg">No more posts</div>
        )}
      </div>
    </div>
  );
};

export default PostFeed;