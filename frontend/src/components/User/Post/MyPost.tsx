import React, { useState, useEffect, Suspense } from 'react';
import { CommunityService, IPost } from '@/services/CommunityService';
import { IUser } from '@/components/admin/dashboard/CustomerDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageSquare } from 'lucide-react';

const CreatePost = React.lazy(() => import('./CreatePost'));

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [newContent, setNewContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [postCount, setPostCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const communityService = new CommunityService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData: IUser = await communityService.getUserDetails();
        setUser(userData);

        const myPosts: IPost[] = await communityService.getMyPosts();
        console.log("My posts fetched", myPosts);
        const validPosts = myPosts.filter(post => post._id !== undefined);
        const count = validPosts.length;
        console.log("count", count);
        setPosts(validPosts);
        setPostCount(count);
        setError(null);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (postId: string | undefined, currentContent: string | undefined) => {
    if (!postId) {
      setError('Cannot edit post: Invalid post ID');
      return;
    }
    setEditingPostId(postId);
    setNewContent(currentContent ?? '');
  };

  const handleSaveEdit = async (postId: string | undefined) => {
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
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? { ...post, content: newContent } : post
        )
      );
      setEditingPostId(null);
      setNewContent('');
      setError(null);
    } catch (err: unknown) {
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

  const handleDeletePrompt = (postId: string | undefined) => {
    if (!postId) {
      setError('Cannot delete post: Invalid post ID');
      return;
    }
    setShowDeleteConfirm(postId);
  };

  const handleDelete = async (postId: string) => {
    try {
      await communityService.deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      setPostCount(prev => prev - 1);
      setShowDeleteConfirm(null);
      setError(null);
    } catch (err: unknown) {
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
      const myPosts: IPost[] = await communityService.getMyPosts();
      const validPosts = myPosts.filter(post => post._id !== undefined);
      setPosts(validPosts);
      setPostCount(validPosts.length);
      closeModal();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh posts';
      setError(errorMessage);
      console.error('Error refreshing posts:', err);
    }
  };

  return (
    <div className="!p-4 sm:!p-6">
      {error && <div className="!text-red-500 !text-center !mb-4 !text-base sm:!text-lg !font-medium">{error}</div>}
      {user ? (
        <>
          <motion.div
            className="!bg-white !rounded-2xl !shadow-lg !p-4 sm:!p-6 !text-center !max-w-xs sm:!max-w-sm !w-full !mb-6 sm:!mb-10"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{ y: -10, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)' }}
          >
            <img
              src={user.profileImage || 'https://via.placeholder.com/160'}
              alt="Profile"
              className="!w-28 !h-28 sm:!w-36 sm:!h-36 !rounded-full !object-cover !mx-auto !mb-4 !border-4 !border-blue-500 !shadow-md"
            />
            <h2 className="!text-lg sm:!text-xl !font-bold !text-gray-900 !mb-2">{user.username || user.name}</h2>
            <p className="!text-sm sm:!text-base !text-gray-600 !mb-3">{user.name}</p>
            <p className="!text-xs sm:!text-sm !text-blue-500 !font-medium !mb-4">{user.friends?.length || 0} Friends</p>
            <p className="!text-xs sm:!text-sm !text-blue-500 !font-medium !mb-4">{postCount || 0} Posts</p>
            <motion.button
              className="!bg-blue-500 !text-white !px-4 sm:!px-5 !py-2 !rounded-lg !font-medium !hover:bg-blue-600 !transition-colors !text-sm sm:!text-base"
              onClick={openModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create New Post
            </motion.button>
          </motion.div>

          <div className="!flex !flex-col !gap-4 sm:!gap-6">
            <h3 className="!text-xl sm:!text-2xl !font-semibold !text-white !mb-4">MY POSTS</h3>
            {posts.length > 0 ? (
              <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !gap-4 sm:!gap-8 !w-full">
                {posts.map((post, index) => (
                  <motion.div
                    key={post._id ?? ''}
                    className="!bg-white !rounded-xl !shadow-md !w-full !max-w-[300px] sm:!max-w-[350px] !h-[400px] sm:!h-[450px] !mx-auto !overflow-hidden !flex !flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {editingPostId === post._id ? (
                      <div className="!p-4 !flex !flex-col !gap-4 !flex-1">
                        <textarea
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          className="!w-full !min-h-[100px] sm:!min-h-[120px] !p-3 !border !border-gray-200 !rounded-lg !text-sm sm:!text-base !bg-gray-50 !resize-y !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
                          placeholder="Edit your post..."
                        />
                        <div className="!flex !gap-3">
                          <motion.button
                            className="!bg-blue-500 !text-white !px-3 sm:!px-4 !py-2 !rounded-lg !font-medium !hover:bg-blue-600 !text-sm sm:!text-base"
                            onClick={() => handleSaveEdit(post._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Save
                          </motion.button>
                          <motion.button
                            className="!bg-gray-300 !text-gray-800 !px-3 sm:!px-4 !py-2 !rounded-lg !font-medium !hover:bg-gray-400 !text-sm sm:!text-base"
                            onClick={handleCancelEdit}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="!flex !flex-col !flex-1">
                        {post.mediaUrl && (post.mediaType === 'image' || post.mediaType === 'video') && (
                          <div className="!w-full !h-[180px] sm:!h-[200px]">
                            {post.mediaType === 'image' ? (
                              <img src={post.mediaUrl} alt="Post media" className="!w-full !h-full !object-cover !rounded-t-xl" />
                            ) : (
                              <video src={post.mediaUrl} controls className="!w-full !h-full !object-cover !rounded-t-xl" />
                            )}
                          </div>
                        )}
                        <div className="!p-4 !flex !flex-col !flex-1">
                          <p className="!text-sm sm:!text-base !text-gray-900 !mb-3 !flex-1 !overflow-y-auto">{post.content || 'No content'}</p>
                          <div className="!flex !gap-4 !text-xs sm:!text-sm !text-gray-600 !mb-3">
                            <span className="!flex !items-center !gap-1">
                              <Heart size={14} className="!text-blue-500 sm:!h-5 sm:!w-5" /> {post.likeCount}
                            </span>
                            <span className="!flex !items-center !gap-1">
                              <MessageSquare size={14} className="!text-blue-500 sm:!h-5 sm:!w-5" /> {post.commentCount}
                            </span>
                          </div>
                          <div className="!flex !gap-3">
                            <motion.button
                              className="!bg-blue-500 !text-white !px-3 sm:!px-4 !py-2 !rounded-lg !font-medium !hover:bg-blue-600 !text-sm sm:!text-base"
                              onClick={() => handleEdit(post._id, post.content)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              className="!bg-red-500 !text-white !px-3 sm:!px-4 !py-2 !rounded-lg !font-medium !hover:bg-red-600 !text-sm sm:!text-base"
                              onClick={() => handleDeletePrompt(post._id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Delete
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="!bg-white !rounded-xl !shadow-md !p-6 !text-center !max-w-md !w-full !mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="!text-base sm:!text-lg !text-gray-600 !mb-4">No Posts. Create a new post to get started!</p>
                <motion.button
                  className="!bg-blue-500 !text-white !px-4 sm:!px-6 !py-2 !rounded-lg !font-medium !hover:bg-blue-600 !text-sm sm:!text-base"
                  onClick={openModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create New Post
                </motion.button>
              </motion.div>
            )}
          </div>
        </>
      ) : (
        <div className="!text-center !text-base sm:!text-lg !text-blue-500 !py-8">Loading user data...</div>
      )}

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="!fixed !inset-0 !bg-black/60 !flex !items-center !justify-center !z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="!bg-white !rounded-xl !p-4 sm:!p-6 !max-w-sm !w-[90%] sm:!w-full !text-center !shadow-xl"
              initial={{ y: '-50%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-50%', opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="!text-lg sm:!text-xl !font-semibold !text-gray-900 !mb-3">Confirm Delete</h3>
              <p className="!text-sm sm:!text-base !text-gray-600 !mb-4">Are you sure you want to delete this post?</p>
              <div className="!flex !gap-3 !justify-center">
                <motion.button
                  className="!bg-red-500 !text-white !px-3 sm:!px-4 !py-2 !rounded-lg !font-medium !hover:bg-red-600 !text-sm sm:!text-base"
                  onClick={() => handleDelete(showDeleteConfirm)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yes, Delete
                </motion.button>
                <motion.button
                  className="!bg-gray-300 !text-gray-800 !px-3 sm:!px-4 !py-2 !rounded-lg !font-medium !hover:bg-gray-400 !text-sm sm:!text-base"
                  onClick={handleCancelDelete}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="!fixed !inset-0 !bg-black/60 !flex !items-center !justify-center !z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
          >
            <motion.div
              className="!bg-white !rounded-xl !p-4 sm:!p-6 !max-w-md sm:!max-w-lg !w-[90%] sm:!w-full !shadow-xl"
              initial={{ y: '-50%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-50%', opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
            >
              <motion.button
                className="!absolute !top-3 sm:!top-4 !right-3 sm:!right-4 !text-gray-600 !hover:text-blue-500"
                onClick={closeModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} className="sm:!h-6 sm:!w-6" />
              </motion.button>
              <Suspense fallback={<div className="!text-center !text-blue-500 !text-sm sm:!text-base">Loading...</div>}>
                <CreatePost onPostCreated={handlePostCreated} />
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyPosts;