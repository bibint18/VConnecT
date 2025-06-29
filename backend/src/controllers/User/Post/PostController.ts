
import { Request, Response, NextFunction } from 'express';
import { IPostController } from '../../../interfaces/user/Community/IPostController.js';
import { IPostService } from '../../../interfaces/user/Community/IPostService.js';
import { ICloudinaryService } from '../../../interfaces/user/Community/ICloudinaryService.js';
import { validationResult } from 'express-validator';
import { AppError } from '../../../utils/AppError.js';
import { HTTP_STATUS_CODE } from '../../../utils/statusCode.js';

export class PostController implements IPostController {
  constructor(
    private postService: IPostService,
    private cloudinaryService: ICloudinaryService
  ) {}

  async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', HTTP_STATUS_CODE.BAD_REQUEST);
      }
      const userId = req.user?.id as string;
      const { content, mediaUrl, mediaType } = req.body;
      const postId = await this.postService.createPost(userId, content, mediaUrl, mediaType);
      res.status(HTTP_STATUS_CODE.CREATED).json({ postId, message: 'Post created' });
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const isAdmin = (req as any).user.role === 'admin';
      const { postId } = req.params;
      await this.postService.deletePost(userId, postId, isAdmin);
      res.status(HTTP_STATUS_CODE.OK).json({ message: 'Post deleted' });
    } catch (error) {
      next(error);
    }
  }

  async getCloudinarySignature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = this.cloudinaryService.generateUploadSignature();
      res.json(signature);
    } catch (error) {
      next(error);
    }
  }

  async getMyPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id as string
      if(!userId){
        throw new Error("No user Id")
      }
      const posts = await this.postService.getMyPost(userId)
      res.status(HTTP_STATUS_CODE.OK).json(posts)
    } catch (error) {
      next(error)
    }
  }

  async editPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', HTTP_STATUS_CODE.BAD_REQUEST);
      }
      const { postId } = req.params;
      const { content } = req.body;
      await this.postService.editPost(postId,content)
      res.status(HTTP_STATUS_CODE.OK).json({message:"Post updated successfully"})
    } catch (error) {
      next(error)
    }
  }

  async getUserDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id as string
      const user = await this.postService.getUserDetails(userId)
      res.status(HTTP_STATUS_CODE.OK).json(user)
    } catch (error) {
      next(error)
    }
  }

  async getFeed(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string,10) || 1;
      const limit = parseInt(req.query.limit as string,10) || 10;
      const feed = await this.postService.getFeed(page,limit)
      res.status(HTTP_STATUS_CODE.OK).json(feed)
    } catch (error) {
      next(error)
    }
  }

  async likePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {postId} = req.params;
      const userId = req.user?.id as string;
      await this.postService.likePost(postId,userId)
      res.status(HTTP_STATUS_CODE.OK).json({message:"Post Liked"})
    } catch (error) {
      next(error)
    }
  }

  async dislikePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {postId} = req.params;
      const userId = req.user?.id as string;
      await this.postService.dislikePost(postId,userId)
      res.status(HTTP_STATUS_CODE.OK).json({message:"Post unliked"})
    } catch (error) {
      next(error)
    }
  }

  async commentOnPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {postId} = req.params;
      const userId = req.user?.id as string;
      const {content} = req.body;
      const commentId = await this.postService.commentOnPost(postId,userId,content)
      res.status(HTTP_STATUS_CODE.OK).json({commentId,message:"Comment added"})
    } catch (error) {
      next(error)
    }
  }

  async getPostComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {postId} = req.params;
      const comments = await this.postService.getPostComments(postId);
      res.status(HTTP_STATUS_CODE.OK).json(comments)
    } catch (error) {
      next(error)
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params;
      const post = await this.postService.getPostById(postId);
      res.status(HTTP_STATUS_CODE.OK).json(post);
    } catch (error) {
      next(error);
    }
  }

  async getPostLikers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params;
      const likers = await this.postService.getPostLikers(postId);
      res.status(HTTP_STATUS_CODE.OK).json(likers);
    } catch (error) {
      next(error);
    }
  }
}
