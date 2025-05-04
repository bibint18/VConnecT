import { useEffect, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { CommunityService, IPost } from '@/services/CommunityService';
import { toast } from 'react-hot-toast';

interface CommentInput {
  postId: string;
  content: string;
}

export const usePostView = (postId: string) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const communityService = new CommunityService();

  
  const { data: post, isLoading, isError, error: queryError } = useQuery<IPost, Error>({
    queryKey: ['post', postId],
    queryFn: () => communityService.getPostById(postId),
  });

  useEffect(() => {
    if (queryError) {
      setError(queryError.message || 'Failed to load post');
      console.error('Query error:', queryError);
    }
  }, [queryError]);


  const likeMutation = useMutation({
    mutationFn: (postId: string) => communityService.likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to like post');
      console.error('Like error:', err);
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: (postId: string) => communityService.dislikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to dislike post');
      console.error('Dislike error:', err);
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ postId, content }: CommentInput) =>
      communityService.commentOnPost(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to add comment');
      console.error('Comment error:', err);
    },
  });


  const handleShare = async (postId: string) => {
    try {
      const shareUrl = await communityService.getPostShareUrl(postId);
      const shareData = {
        title: 'Check out this post!',
        text: 'I found this post on the Community app!',
        url: shareUrl,
      };

      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Post shared successfully!');
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to share post';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Share error:', err);
    }
  };

  const handleLike = (postId: string) => likeMutation.mutate(postId);
  const handleDislike = (postId: string) => dislikeMutation.mutate(postId);
  const handleComment = (postId: string, content: string) => {
    if (content.trim()) {
      commentMutation.mutate({ postId, content });
    }
  };

  return {
    post,
    isLoading,
    isError,
    error,
    setError,
    handleLike,
    handleDislike,
    handleComment,
    handleShare,
  };
};