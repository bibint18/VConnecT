import { IPost } from '@/services/CommunityService';
interface FeedResponse {
    posts: IPost[];
    total: number;
}
export declare const usePostFeed: () => {
    allPosts: IPost[];
    fetchNextPage: (options?: import("@tanstack/react-query").FetchNextPageOptions) => Promise<import("@tanstack/react-query").InfiniteQueryObserverResult<FeedResponse, Error>>;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    isError: boolean;
    error: string | null;
    setError: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    handleLike: (postId: string) => void;
    handleDislike: (postId: string) => void;
    handleComment: (postId: string, content: string) => void;
    handleShare: (postId: string) => Promise<void>;
};
export {};
