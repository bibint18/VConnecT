import { IPost } from "./IPostRepository";

export interface IPostService {
  createPost(userId: string, content?: string, mediaUrl?: string, mediaType?: 'text' | 'image' | 'video'):Promise<string>;
  deletePost(userId: string, postId: string, isAdmin: boolean): Promise<void>;
  getMyPost(userId:string):Promise<IPost[]>
  editPost(postId:string,content:string):Promise<void>
}