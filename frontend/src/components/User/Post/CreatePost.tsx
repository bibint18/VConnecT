
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CommunityService } from '@/services/CommunityService';
import { CloudinaryUploadResult } from '@/services/CommunityService';
import { Paperclip } from 'react-feather';

const communityService = new CommunityService();

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error('No file selected');
      return;
    }

    try {
      setIsUploading(true);
      const maxSize = file.type.startsWith('image/') ? 5 * 1024 * 1024 : 100 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`File too large. Max size: ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      const { signature, timestamp } = await communityService.getCloudinarySignature();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY as string);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', 'chat_media');
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upload file to Cloudinary');
      }

      const result: CloudinaryUploadResult = await response.json();
      const mediaUrl = result.secure_url;
      const mediaType = result.resource_type as 'image' | 'video';
      const responsePost = await communityService.createPost(content, mediaUrl, mediaType);
      setPostId(responsePost.postId);
      setShowModal(true);
      toast.success('Post created');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      toast.error('Failed to create post');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !fileInputRef.current?.files?.length) {
      toast.error('Content or media required');
      return;
    }

    if (fileInputRef.current?.files?.length) {
      await handleMediaUpload({
        target: fileInputRef.current,
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      try {
        setIsUploading(true);
        const response = await communityService.createPost(content);
        setPostId(response.postId);
        setShowModal(true);
        toast.success('Post created');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create post');
        toast.error('Failed to create post');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCancel = () => {
    navigate('/createPost');
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPostId(null);
    navigate('/createPost');
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="add-post-container">
      <motion.div
        className="form-card"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Post</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              name="content"
              value={content}
              onChange={handleContentChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="What's on your mind?"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Media (Images/Videos)</label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`p-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'} rounded-l-lg`}
              >
                <Paperclip size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMediaUpload}
                accept="image/jpeg,image/png,video/mp4"
                className="hidden"
              />
              <span className="flex-1 p-2 text-gray-500">Select a file</span>
            </div>
          </div>
          <div className="flex gap-4">
            <motion.button
              type="submit"
              className="flex-1 join-button"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Create Post'}
            </motion.button>
            <motion.button
              type="button"
              onClick={handleCancel}
              className="flex-1 cancel-button"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Post Created!</h3>
            <p className="text-gray-600 mb-4">
              Your post has been created successfully. Post ID: <span className="font-mono">{postId}</span>
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => navigator.clipboard.writeText(postId || '')}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Copy Post ID
              </button>
              <button
                onClick={handleModalClose}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;