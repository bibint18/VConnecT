export interface IPostService {
  createPost(userId: string, content?: string, mediaUrl?: string, mediaType?: 'text' | 'image' | 'video'):Promise<string>;
  deletePost(userId: string, postId: string, isAdmin: boolean): Promise<void>;
}