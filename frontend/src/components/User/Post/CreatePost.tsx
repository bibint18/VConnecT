import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  CommunityService,
  CloudinaryUploadResult,
} from "@/services/CommunityService";
import { Paperclip } from "react-feather";

const communityService = new CommunityService();

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleMediaUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    try {
      setIsUploading(true);
      const maxSize = file.type.startsWith("image/")
        ? 5 * 1024 * 1024
        : 100 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`File too large. Max size: ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      const { signature, timestamp } =
        await communityService.getCloudinarySignature();
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "api_key",
        import.meta.env.VITE_CLOUDINARY_API_KEY as string
      );
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "chat_media");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to upload file to Cloudinary"
        );
      }

      const result: CloudinaryUploadResult = await response.json();
      const mediaUrl = result.secure_url;
      const mediaType = result.resource_type as "image" | "video";
      await communityService.createPost(content, mediaUrl, mediaType);
      toast.success("Post created");
      onPostCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
      toast.error("Failed to create post");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !fileInputRef.current?.files?.length) {
      toast.error("Content or media required");
      return;
    }

    if (fileInputRef.current?.files?.length) {
      await handleMediaUpload({
        target: fileInputRef.current,
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      try {
        setIsUploading(true);
        await communityService.createPost(content);
        toast.success("Post created");
        onPostCreated();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create post");
        toast.error("Failed to create post");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="!flex !flex-col !gap-6 !w-full">
      <motion.div
        className="!bg-white !rounded-xl !p-6 !shadow-md"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="!text-2xl !font-semibold !text-gray-900 !text-center !mb-4">
          Create New Post
        </h2>
        {error && (
          <p className="!text-red-500 !text-center !text-base !mb-4">{error}</p>
        )}
        <form onSubmit={handleFormSubmit} className="!flex !flex-col !gap-4">
          <div className="!flex !flex-col !gap-2">
            <label className="!text-sm !font-medium !text-gray-700">
              Content
            </label>
            <textarea
              name="content"
              value={content}
              onChange={handleContentChange}
              className="!w-full !min-h-[120px] !p-3 !border !border-gray-200 !rounded-lg !text-base !bg-gray-50 !resize-y !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
              placeholder="What's on your mind?"
              rows={4}
            />
          </div>
          <div className="!flex !flex-col !gap-2">
            <label className="!text-sm !font-medium !text-gray-700">
              Media (Images/Videos)
            </label>
            <div className="!flex !items-center !border !border-gray-200 !rounded-lg !bg-gray-50 !overflow-hidden">
              <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`!p-3 !bg-white !border-r !border-gray-200 ${
                  isUploading
                    ? "!opacity-50 !cursor-not-allowed"
                    : "!hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Paperclip size={20} className="!text-gray-600" />
              </motion.button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMediaUpload}
                accept="image/jpeg,image/png,video/mp4"
                className="!hidden"
              />
              <span className="!flex-1 !p-3 !text-sm !text-gray-600">
                Select a file
              </span>
            </div>
          </div>
          <div className="!flex !justify-center">
            <motion.button
              type="submit"
              className={`!bg-blue-500 !text-white !px-6 !py-2 !rounded-lg !font-medium !hover:bg-blue-600 ${
                isUploading ? "!opacity-50 !cursor-not-allowed" : ""
              }`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Create Post"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePost;
