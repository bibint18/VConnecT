import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePostFeed } from '@/hooks/usePostFeed';
import { CommunityService, IComment } from '@/services/CommunityService';
import { Heart, HeartCrack, MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useAppSelector } from '@/redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const PostFeed: React.FC = () => {
  const [showComments, setShowComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [comments, setComments] = useState<{ [key: string]: IComment[] }>({});
  const userId = useAppSelector((state) => state.user.userId);
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
  } = usePostFeed();
  console.log('allPosts in PostFeed:', allPosts);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const toggleComments = async (postId: string) => {
    setShowComments(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
    if (!comments[postId]) {
      const communityService = new CommunityService();
      const fetchedComments = await communityService.getPostComments(postId);
      setComments(prev => ({
        ...prev,
        [postId]: fetchedComments.slice(0, 10), // Limit to 10 most recent comments
      }));
    }
  };

  const handleCommentSubmit = (postId: string) => {
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

  return (
    <div className="!p-4 !bg-black">
      {/* Animated "COMMUNITY" Text */}
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
          {/* Gradient Underline */}
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
              {/* Post Header */}
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

              {/* Post Content */}
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

                {/* Actions */}
                <div className="!p-3 !border-t !border-gray-200 !flex !flex-col !gap-2">
                  <div className="!flex !gap-4 !text-sm !text-gray-600">
                    <motion.button
                    className='!bg-white'
                      onClick={() => handleLike(post._id!)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart
                        size={20}
                        className={
                          post.likes.includes(userId as string)
                            ? '!text-red-600 !fill-red-600'
                            : '!text-gray-600 !hover:text-red-600'
                        }
                      />
                    </motion.button>
                    <motion.button
                    className='!bg-white'
                      onClick={() => handleDislike(post._id!)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <HeartCrack
                        size={20}
                        className={
                          post.likes.includes(userId as string)
                            ? '!text-gray-600 !hover:text-red-600'
                            : '!text-red-600 !fill-red-600'
                        }
                      />
                    </motion.button>
                    <motion.button
                    className='!bg-white'
                      onClick={() => toggleComments(post._id!)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MessageSquare
                        size={20}
                        className="!text-gray-600 !hover:text-gray-500"
                      />
                    </motion.button>
                  </div>
                  <div className="!flex !gap-3 !text-xs !text-gray-600">
                    <span>{post.likeCount} likes</span>
                    {post.likes.includes(userId as string) ? (
                      <span>0 dislikes</span>
                    ) : (
                      <span>1 dislike</span>
                    )}
                    <span>{post.commentCount} comments</span>
                  </div>

                  {/* Comment Section */}
                  <AnimatePresence>
                    {showComments.includes(post._id!) && (
                      <motion.div
                        className="!flex !flex-col !gap-2 !mt-2 !max-h-48 !overflow-y-auto !border-t !border-gray-200 !pt-2"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Comment Input */}
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
                          />
                          <motion.button
                          className='!bg-white'
                            onClick={() => handleCommentSubmit(post._id!)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Send
                              size={18}
                              className="!text-gray-500 !hover:text-gray-400"
                            />
                          </motion.button>
                        </div>

                        {/* Comment List */}
                        {comments[post._id!] && comments[post._id!].length > 0 ? (
                          comments[post._id!].map((comment, index) => (
                            <div key={index} className="!flex !gap-2 !text-xs">
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

                  {/* Toggle Comments Button */}
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