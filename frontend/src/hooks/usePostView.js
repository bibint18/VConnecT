import { useEffect, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { CommunityService } from '@/services/CommunityService';
import { toast } from 'react-hot-toast';
export const usePostView = (postId) => {
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();
    const communityService = new CommunityService();
    const { data: post, isLoading, isError, error: queryError } = useQuery({
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
        mutationFn: (postId) => communityService.likePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
        },
        onError: (err) => {
            setError(err.message || 'Failed to like post');
            console.error('Like error:', err);
        },
    });
    const dislikeMutation = useMutation({
        mutationFn: (postId) => communityService.dislikePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
        },
        onError: (err) => {
            setError(err.message || 'Failed to dislike post');
            console.error('Dislike error:', err);
        },
    });
    const commentMutation = useMutation({
        mutationFn: ({ postId, content }) => communityService.commentOnPost(postId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
        },
        onError: (err) => {
            setError(err.message || 'Failed to add comment');
            console.error('Comment error:', err);
        },
    });
    const handleShare = async (postId) => {
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
            }
            else {
                await navigator.clipboard.writeText(shareUrl);
                toast.success('Link copied to clipboard!');
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to share post';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Share error:', err);
        }
    };
    const handleLike = (postId) => likeMutation.mutate(postId);
    const handleDislike = (postId) => dislikeMutation.mutate(postId);
    const handleComment = (postId, content) => {
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
