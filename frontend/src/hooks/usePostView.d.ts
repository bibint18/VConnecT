import { IPost } from '@/services/CommunityService';
export declare const usePostView: (postId: string) => {
    post: IPost | undefined;
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    setError: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    handleLike: (postId: string) => void;
    handleDislike: (postId: string) => void;
    handleComment: (postId: string, content: string) => void;
    handleShare: (postId: string) => Promise<void>;
};
