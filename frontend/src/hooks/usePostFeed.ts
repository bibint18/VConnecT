

import { useEffect, useState } from 'react';
import { 
  useInfiniteQuery, 
  useMutation, 
  useQueryClient,
} from '@tanstack/react-query';
import { CommunityService, IPost } from '@/services/CommunityService';
import toast from 'react-hot-toast';

interface FeedResponse {
  posts: IPost[];
  total: number;
}

interface CommentInput {
  postId: string;
  content: string;
}

export const usePostFeed = () => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const communityService = new CommunityService();

  // Infinite query for fetching the feed
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error: queryError,
  } = useInfiniteQuery<FeedResponse, Error, FeedResponse, ['feed']>({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 1 }) => communityService.getFeed(pageParam as number, 10),
    getNextPageParam: (lastPage, allPages) => {
      const totalPostsFetched = allPages.reduce((acc, page) => acc + page.posts.length, 0);
      return lastPage.total > totalPostsFetched ? Math.floor(totalPostsFetched / 10) + 1 : undefined;
    },
  });

  useEffect(() => {
    if (queryError) {
      setError(queryError.message || 'Failed to load feed');
    }
  }, [queryError]);

  // Mutation for liking a post
  const likeMutation = useMutation({
    mutationFn: (postId: string) => communityService.likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to like post');
    },
  });

  // Mutation for disliking a post
  const dislikeMutation = useMutation({
    mutationFn: (postId: string) => communityService.dislikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to dislike post');
    },
  });

  // Mutation for commenting on a post
  const commentMutation = useMutation({
    mutationFn: ({ postId, content }: CommentInput) => 
      communityService.commentOnPost(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to add comment');
    },
  });

  // Share
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
    }
  };

  const handleLike = (postId: string) => likeMutation.mutate(postId);
  const handleDislike = (postId: string) => dislikeMutation.mutate(postId);
  const handleComment = (postId: string, content: string) => {
    if (content.trim()) {
      commentMutation.mutate({ postId, content });
    }
  };

  const allPosts = data?.pages.flatMap((page: FeedResponse) => page.posts) ?? [];

  return {
    allPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    setError,
    handleLike,
    handleDislike,
    handleComment,
    handleShare,
  };
};