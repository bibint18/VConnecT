import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePostView } from '@/hooks/usePostView';
import { CommunityService, IComment } from '@/services/CommunityService';
import { Heart, HeartCrack, MessageSquare, ChevronDown, ChevronUp, Send, Share2 } from 'lucide-react';
import { useAppSelector } from '@/redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Toaster } from 'react-hot-toast';

const PostView: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [showComments, setShowComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<IComment[]>([]);
  const userId = useAppSelector((state) => state.user.userId);
  const {
    post,
    isLoading,
    isError,
    error,
    handleLike,
    handleDislike,
    handleComment,
    handleShare,
  } = usePostView(postId!);

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
      handleComment(postId!, newComment);
      setNewComment('');
    }
  };

  if (isLoading) {
    return (
      <div className="!flex !justify-center !items-center !h-screen">
        <div className="!text-gray-500 !text-lg">Loading post...</div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="!flex !justify-center !items-center !h-screen">
        <div className="!text-red-500 !text-lg">{error || 'Post not found'}</div>
      </div>
    );
  }

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
        className="!flex !flex-col !max-w-md !mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="!bg-white !rounded-lg !shadow-md !flex !flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
                  onClick={toggleComments}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MessageSquare
                    size={20}
                    className="!text-gray-600 !hover:text-gray-500"
                  />
                </motion.button>
                <motion.button
                  className='!bg-white'
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
                <span>{post.likeCount} likes</span>
                {post.likes.includes(userId as string) ? (
                  <span>0 dislikes</span>
                ) : (
                  <span>1 dislike</span>
                )}
                <span>{post.commentCount} comments</span>
              </div>

              
              <AnimatePresence>
                {showComments && (
                  <motion.div
                    className="!flex !flex-col !gap-2 !mt-2 !max-h-48 !overflow-y-auto !border-t !border-gray-200 !pt-2"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="!flex !gap-2 !items-center">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="!flex-1 !p-2 !border !border-gray-300 !rounded-full !text-sm !bg-black !text-white !focus:outline-none !focus:ring-2 !focus:ring-gray-500"
                        placeholder="Add a comment..."
                      />
                      <motion.button
                        className='!bg-white'
                        onClick={handleCommentSubmit}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Send
                          size={18}
                          className="!text-gray-500 !hover:text-gray-400"
                        />
                      </motion.button>
                    </div>

                    {comments.length > 0 ? (
                      comments.map((comment, index) => (
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

              <motion.button
                className="!flex !items-center !justify-center !gap-1 !text-xs !text-gray-500 !mt-1 !bg-white"
                onClick={toggleComments}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showComments ? (
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
      </motion.div>
    </div>
  );
};

export default PostView;