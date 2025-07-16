import { IUser } from "../../../models/User.js";

export interface IPostIUser {
  _id: string;
  username: string | undefined;
  name?:string
  profileImage?: string;
}

export interface IPost {
  _id?:string;
  userId: IPostIUser;
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

export interface IComment {
  _id?: string;
  postId: string;
  userId: string;
  content: string;
  timestamp?: Date;
  isDeleted?: boolean;
  username?: string; 
  name?:string;
  profilePicture?: string;
}

export interface IPostRepository{
  create(post:IPost):Promise<string>;
  findById(postId:string):Promise<IPost | null>
  findByUserID(userId:string):Promise<IPost[]>
  update(postId:string,updates:Partial<IPost>):Promise<void>
  delete(postId:string):Promise<void>
  findUserById(userId:string):Promise<IUser | null>

  findAllPosts(page:number,limit:number):Promise<{posts:IPost[]; total:number}>
  addLike(postId:string,userId:string):Promise<void>;
  removeLike(postId:string,userId:string):Promise<void>;
  addComment(postId:string,comment:IComment):Promise<string>
  getComments(postId:string):Promise<IComment[]>;
  findUsersByIds(userIds: string[]): Promise<{ _id: string; username: string }[]>;
}