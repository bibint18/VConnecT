import { Request,Response,NextFunction } from "express";
export interface IPostController{
  createPost(req:Request,res:Response,next:NextFunction):Promise<void>
  deletePost(req:Request,res:Response,next:NextFunction):Promise<void>
  getCloudinarySignature(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMyPosts(req: Request, res: Response, next: NextFunction): Promise<void>;
  editPost(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserDetails(req: Request, res: Response, next: NextFunction): Promise<void>;

  getFeed(req: Request, res: Response, next: NextFunction): Promise<void>;
  likePost(req: Request, res: Response, next: NextFunction): Promise<void>;
  dislikePost(req: Request, res: Response, next: NextFunction): Promise<void>;
  commentOnPost(req: Request, res: Response, next: NextFunction): Promise<void>;
  getPostComments(req: Request, res: Response, next: NextFunction): Promise<void>;
  getPostById(req: Request, res: Response, next: NextFunction): Promise<void>
  getPostLikers(req: Request, res: Response, next: NextFunction): Promise<void>
}