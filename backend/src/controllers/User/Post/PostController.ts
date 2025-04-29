
import { Request, Response, NextFunction } from 'express';
import { IPostController } from '../../../interfaces/user/Community/IPostController';
import { IPostService } from '../../../interfaces/user/Community/IPostService';
import { ICloudinaryService } from '../../../interfaces/user/Community/ICloudinaryService';
import { validationResult } from 'express-validator';
import { AppError } from '../../../utils/AppError';

export class PostController implements IPostController {
  constructor(
    private postService: IPostService,
    private cloudinaryService: ICloudinaryService
  ) {}

  async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("Reached create post")
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400);
      }

      const userId = req.user?.id as string;
      console.log("userId",userId)
      const { content, mediaUrl, mediaType } = req.body;
      console.log("Data fetched from cloudinary upload",content,mediaUrl,mediaType)
      const postId = await this.postService.createPost(userId, content, mediaUrl, mediaType);
      res.status(201).json({ postId, message: 'Post created' });
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("delete post reached ")
      const userId = (req as any).user.id;
      const isAdmin = (req as any).user.role === 'admin';
      const { postId } = req.params;

      await this.postService.deletePost(userId, postId, isAdmin);
      res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
      next(error);
    }
  }

  async getCloudinarySignature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("get cloudinary post reached")
      const signature = this.cloudinaryService.generateUploadSignature();
      res.json(signature);
    } catch (error) {
      next(error);
    }
  }

  async getMyPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("reached my post")
      const userId = req.user?.id as string
      if(!userId){
        throw new Error("No user Id")
      }
      const posts = await this.postService.getMyPost(userId)
      res.status(200).json(posts)
    } catch (error) {
      next(error)
    }
  }

  async editPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400);
      }
      const { postId } = req.params;
      const { content } = req.body;
      await this.postService.editPost(postId,content)
      res.status(200).json({message:"Post updated successfully"})
    } catch (error) {
      next(error)
    }
  }

  async getUserDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id as string
      const user = await this.postService.getUserDetails(userId)
      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
}
