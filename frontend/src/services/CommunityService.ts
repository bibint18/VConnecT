import { IUser } from '@/components/admin/dashboard/CustomerDashboard';
import axiosInstance from '@/utils/axiosInterceptor'; 
export interface CloudinarySignature {
  signature: string;
  timestamp: number;
}
export interface IPostIuser{
  _id:string;
  username:string;
  profileImage?:string
}
export interface IPost {
  _id?: string;
  // userId: string;
  userId:IPostIuser;
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


export class CommunityService {
  async getCloudinarySignature(): Promise<CloudinarySignature> {
    const { data } = await axiosInstance.get('/post/signature');
    return data;
  }

  async createPost(
    content?: string,
    mediaUrl?: string,
    mediaType?: 'text' | 'image' | 'video'
  ): Promise<{ postId: string; message: string }> {
    const response = await axiosInstance.post('/posts', {
      content,
      mediaUrl,
      mediaType,
    });
    return response.data;
  }

  async deletePost(postId: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`/post/${postId}`);
    return response.data;
  }

  async getMyPosts(): Promise<IPost[]> {
    console.log('api my post call made')
    const response = await axiosInstance.get('/my-posts');
    console.log("response my post",response)
    return response.data;
  }

  async editPost(postId: string, content: string): Promise<{ message: string }> {
    const response = await axiosInstance.put(`/posts/${postId}`, { content });
    return response.data;
  }

  async getUserDetails():Promise<IUser>{
    const response = await axiosInstance.get('/posts/user')
    return response.data
  }

  async getFeed(page:number,limit:number):Promise<{posts:IPost[]; total:number}>{
    const response = await axiosInstance.get('/feed',{params:{page,limit}})
    return response.data
  }

  async likePost(postId:string):Promise<{message:string}>{
    const response = await axiosInstance.post(`/posts/${postId}/like`)
    return response.data
  }

  async dislikePost(postId:string):Promise<{message:string}>{
    const response = await axiosInstance.post(`/posts/${postId}/dislike`)
    return response.data
  }

  async commentOnPost(postId:string,content:string):Promise<{commentId:string;message:string}>{
    const response = await axiosInstance.post(`/posts/${postId}/comments`,{content})
    return response.data
  }

  async getPostComments(postId:string):Promise<IComment[]>{
    const response = await axiosInstance.get(`/posts/${postId}/comments`)
    return response.data
  }

  async getPostShareUrl(postId: string): Promise<string> {
    // In a real app, you might fetch this from your backend
    // For now, construct the URL client-side
    const baseUrl = window.location.origin; // e.g., "https://yourapp.com"
    return `${baseUrl}/post/${postId}`;
  }

  async getPostById(postId: string): Promise<IPost> {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  }
}