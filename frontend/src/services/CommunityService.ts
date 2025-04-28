import axiosInstance from '@/utils/axiosInterceptor'; 
export interface CloudinarySignature {
  signature: string;
  timestamp: number;
}
export interface IPost {
  _id?: string;
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
export interface CloudinaryUploadResult {
  secure_url: string;
  resource_type: 'image' | 'video';
  public_id: string;
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
}