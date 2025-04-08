import { Request,Response,NextFunction } from "express";
import { IChatController } from "../../../interfaces/user/Chat/IChatController";
import { IChatService } from "../../../interfaces/user/Chat/IChatService";
import { AppError } from "../../../utils/AppError";

export class ChatController implements IChatController{
  private chatService:IChatService;
  constructor(chatService:IChatService){
    this.chatService=chatService
  }

  async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {receiverId,content} = req.body;
      const senderId = (req as any).user?.id
      // console.log("backend controller send reciverId: ",receiverId,"sender: ",senderId,"content: ",content)
      if (!senderId || !receiverId || !content) {
        throw new AppError("Sender ID, receiver ID, and content are required", 400);
      }
      await this.chatService.sendMessage(senderId,receiverId,content)
      res.status(200).json({success:true,message:"Message sent"})
    } catch (error) {
      next(error)
    }
  }

  async getChatHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("reached history controller")
      const {receiverId} = req.query
      const senderId = (req as any).user?.id 
      console.log("data from controller",receiverId,senderId)
      if (!senderId || !receiverId) {
        throw new AppError("Sender ID and receiver ID are required", 400);
      }
      const history = await this.chatService.getChatHistory(senderId,receiverId as string)
      console.log("data from controller history",history)
      res.status(200).json  ({success:true,data:history})
    } catch (error) {
      next(error)
    }
  }
}