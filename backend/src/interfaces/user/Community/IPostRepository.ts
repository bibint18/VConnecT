export interface IPost {
  _id?:string;
  userId: string;
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

export interface IPostRepository{
  create(post:IPost):Promise<string>;
  findById(postId:string):Promise<IPost | null>
  delete(postId:string):Promise<void>
}