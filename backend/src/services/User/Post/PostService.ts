import { IPostService } from '../../../interfaces/user/Community/IPostService';
import { IPost, IPostRepository } from '../../../interfaces/user/Community/IPostRepository';
import { ICloudinaryService } from '../../../interfaces/user/Community/ICloudinaryService';
import { AppError } from '../../../utils/AppError';
import { IUser } from '../../../models/User';

export class PostService implements IPostService {
  constructor(
    private postRepository: IPostRepository,
    private cloudinaryService: ICloudinaryService
  ) {}

  async createPost(
    userId: string,
    content?: string,
    mediaUrl?: string,
    mediaType?: 'text' | 'image' | 'video'
  ): Promise<string> {
    if (!content && !mediaUrl) {
      throw new AppError('Content or media required', 400);
    }

    const post: IPost = {
      userId,
      content,
      mediaUrl,
      mediaType: mediaUrl ? mediaType : 'text',
      likes: [],
      likeCount: 0,
      commentCount: 0,
      viewCount: 0,
      timestamp: new Date(),
      isDeleted: false,
    };

    return this.postRepository.create(post);
  }

  async deletePost(userId: string, postId: string, isAdmin: boolean): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    if (post.userId !== userId && !isAdmin) {
      throw new AppError('Unauthorized', 403);
    }

    if (post.mediaUrl && post.mediaType !== 'text') {
      const publicId = post.mediaUrl.split('/').pop()?.split('.')[0] || '';
      await this.cloudinaryService.deleteMedia(publicId, post.mediaType as 'image' | 'video');
    }

    await this.postRepository.delete(postId);
  }

  async editPost(postId: string, content: string): Promise<void> {
    const post = await this.postRepository.findById(postId)
    if(!post){
      throw new Error("Post not found")
    }
    if (!content.trim()) {
      throw new AppError('Content cannot be empty', 400);
    }
    await this.postRepository.update(postId,{content})
  }

  async getMyPost(userId: string): Promise<IPost[]> {
    return await this.postRepository.findByUserID(userId)
  }

  async  getUserDetails(userId: string): Promise<IUser | null> {
    return await this.postRepository.findUserById(userId)
  }
}