import { IUser } from '@/components/admin/dashboard/CustomerDashboard';
export interface CloudinarySignature {
    signature: string;
    timestamp: number;
}
export interface IPostIuser {
    _id: string;
    username: string;
    profileImage?: string;
}
export interface IPost {
    _id?: string;
    userId: IPostIuser;
    content?: string;
    mediaUrl?: string;
    mediaType?: 'text' | 'image' | 'video';
    likes: string[];
    likeCount: number;
    commentCount: number;
    viewCount: number;
    timestamp: Date;
    isDeleted: boolean;
}
export interface CloudinaryUploadResult {
    secure_url: string;
    resource_type: 'image' | 'video';
    public_id: string;
}
export interface IComment {
    _id?: string;
    postId: string;
    userId: string;
    content: string;
    timestamp: Date;
    isDeleted: boolean;
    username?: string;
    profilePicture?: string;
}
export declare class CommunityService {
    getCloudinarySignature(): Promise<CloudinarySignature>;
    createPost(content?: string, mediaUrl?: string, mediaType?: 'text' | 'image' | 'video'): Promise<{
        postId: string;
        message: string;
    }>;
    deletePost(postId: string): Promise<{
        message: string;
    }>;
    getMyPosts(): Promise<IPost[]>;
    editPost(postId: string, content: string): Promise<{
        message: string;
    }>;
    getUserDetails(): Promise<IUser>;
    getFeed(page: number, limit: number): Promise<{
        posts: IPost[];
        total: number;
    }>;
    likePost(postId: string): Promise<{
        message: string;
    }>;
    dislikePost(postId: string): Promise<{
        message: string;
    }>;
    commentOnPost(postId: string, content: string): Promise<{
        commentId: string;
        message: string;
    }>;
    getPostComments(postId: string): Promise<IComment[]>;
    getPostShareUrl(postId: string): Promise<string>;
    getPostById(postId: string): Promise<IPost>;
}
