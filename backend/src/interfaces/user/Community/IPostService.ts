import { IUser } from "../../../models/User.js";
import { IComment, IPost } from "./IPostRepository.js";

export interface IPostService {
  createPost(userId: string, content?: string, mediaUrl?: string, mediaType?: 'text' | 'image' | 'video'):Promise<string>;
  deletePost(userId: string, postId: string, isAdmin: boolean): Promise<void>;
  getMyPost(userId:string):Promise<IPost[]>
  editPost(postId:string,content:string):Promise<void>
  getUserDetails(userId:string):Promise<IUser | null>
  getFeed(page: number, limit: number): Promise<{ posts: IPost[]; total: number }>;
  likePost(postId: string, userId: string): Promise<void>;
  dislikePost(postId: string, userId: string): Promise<void>;
  commentOnPost(postId: string, userId: string, content: string): Promise<string>;
  getPostComments(postId: string): Promise<IComment[]>;
  getPostById(postId: string): Promise<IPost>
}