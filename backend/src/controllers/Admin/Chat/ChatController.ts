import { Request,Response,NextFunction } from "express";
import { IChatController } from "../../../interfaces/user/Chat/IChatController.js";
import { IChatService } from "../../../interfaces/user/Chat/IChatService.js";
import { AppError } from "../../../utils/AppError.js";
import { chatIo } from "../../../app.js";
export class ChatController implements IChatController{
  private chatService:IChatService;
  constructor(chatService:IChatService){
    this.chatService=chatService
  }

  async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {receiverId,content,mediaUrl,mediaType} = req.body;
      const senderId = req.user?.id as string
      if (!senderId || !receiverId ) {
        throw new AppError("Sender ID, receiver ID are required", 400);
      }
      if (!content && !mediaUrl) { 
        throw new AppError("Content or media URL is required", 400);
      }
      if (mediaUrl && !['image', 'video'].includes(mediaType)) {
        throw new AppError("Invalid media type", 400);
      }
      await this.chatService.sendMessage(senderId,receiverId,content,mediaUrl,mediaType)
      res.status(200).json({success:true,message:"Message sent"})
    } catch (error) {
      next(error)
    }
  }

  async getChatHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("reached history controller")
      const {receiverId} = req.query
      const senderId = req.user?.id as string
      if (!senderId || !receiverId) {
        throw new AppError("Sender ID and receiver ID are required", 400);
      }
      const history = await this.chatService.getChatHistory(senderId,receiverId as string)
      // console.log("data from controller history",history)
      res.status(200).json  ({success:true,data:history})
    } catch (error) {
      next(error)
    }
  }

  async markMessageAsRead(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
      const {userId,friendId} = req.body;
      await this.chatService.markMessagesAsRead(userId,friendId)
      const lastMessage = await this.chatService.getLastMessage
      (userId,friendId)
      console.log("controller lastmnessage update",lastMessage)
      const unreadCount = await this.chatService.getUnreadMessageCount(userId,friendId)
      console.log("controller unreadCOunt update",unreadCount)
      chatIo.to(userId).emit('update-last-message',{
        friendId,lastMessage,unreadCount
      })
      res.status(200).json({success:true,message:"Mark messages as read"})
    } catch (error) {
      next(error)
    }
  }
}