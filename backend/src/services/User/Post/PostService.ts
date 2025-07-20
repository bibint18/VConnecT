import { IPostService } from '../../../interfaces/user/Community/IPostService.js';
import { IComment, IPost, IPostRepository } from '../../../interfaces/user/Community/IPostRepository.js';
import { AppError } from '../../../utils/AppError.js';
import { IUser } from '../../../models/User.js';

export class PostService implements IPostService {
  constructor(
    private postRepository: IPostRepository,
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
    const user = await this.postRepository.findUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const post = {
      userId: {
        _id: user._id,
        username: user.username,
        profileImage: user.profileImage,
      },
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

  async getFeed(page: number, limit: number): Promise<{ posts: IPost[]; total: number; }> {
    return await this.postRepository.findAllPosts(page,limit)
  }

  async likePost(postId: string, userId: string): Promise<void> {
    const post = await this.postRepository.findById(postId)
    if(!post){
      throw new Error("Post not found")
    }
    if(post.likes.includes(userId)){
      throw new AppError("Already liked",400)
    }
    await this.postRepository.addLike(postId,userId)
  }

  async dislikePost(postId: string, userId: string): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) throw new AppError('Post not found', 404);
    if (!post.likes.includes(userId)) throw new AppError('Not liked yet', 400);
    await this.postRepository.removeLike(postId,userId)
  }

  async commentOnPost(postId: string, userId: string, content: string): Promise<string> {
    if (!content.trim()) throw new AppError('Content cannot be empty', 400);
    const post = await this.postRepository.findById(postId)
    if(!post){
      throw new AppError("Post not found",400)
    }
    const comment :IComment = {userId,content,postId}
    return await this.postRepository.addComment(postId,comment)
  }
  
  async getPostComments(postId: string): Promise<IComment[]> {
    return await this.postRepository.getComments(postId)
  }

  async getPostById(postId: string): Promise<IPost> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    return post;
  }

  async getPostLikers(postId: string): Promise<{ _id: string; username: string }[]> {
    console.log("post id from service",postId)
    const post = await this.getPostById(postId)
    console.log('post from service',post)
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    if (!post.likes.length) {
      return [];
    }
    return await this.postRepository.findUsersByIds(post.likes);
  }
}