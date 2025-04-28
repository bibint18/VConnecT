import axiosInstance from '@/utils/axiosInterceptor'; 
export interface CloudinarySignature {
  signature: string;
  timestamp: number;
}

export interface CloudinaryUploadResult {
  secure_url: string;
  resource_type: 'image' | 'video';
  public_id: string;
}

// export interface ICommunityService {
//   getCloudinarySignature(): Promise<CloudinarySignature>;
//   createPost(content?: string, mediaUrl?: string, mediaType?: 'text' | 'image' | 'video'): Promise<{ postId: string; message: string }>;
//   deletePost(postId: string): Promise<{ message: string }>;
// }



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
    const response = await axiosInstance.delete(`/posts/${postId}`);
    return response.data;
  }
}