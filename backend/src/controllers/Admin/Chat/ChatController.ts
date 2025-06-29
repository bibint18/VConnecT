import { Request, Response, NextFunction } from "express";
import { IChatController } from "../../../interfaces/user/Chat/IChatController.js";
import { IChatService } from "../../../interfaces/user/Chat/IChatService.js";
import { AppError } from "../../../utils/AppError.js";
import { chatIo } from "../../../app.js";
import { HTTP_STATUS_CODE } from "../../../utils/statusCode.js";
export class ChatController implements IChatController {
  private chatService: IChatService;
  constructor(chatService: IChatService) {
    this.chatService = chatService;
  }

  async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { receiverId, content, mediaUrl, mediaType } = req.body;
      const senderId = req.user?.id as string;
      if (!senderId || !receiverId) {
        throw new AppError(
          "Sender ID, receiver ID are required",
          HTTP_STATUS_CODE.BAD_REQUEST
        );
      }
      if (!content && !mediaUrl) {
        throw new AppError(
          "Content or media URL is required",
          HTTP_STATUS_CODE.BAD_REQUEST
        );
      }
      if (mediaUrl && !["image", "video"].includes(mediaType)) {
        throw new AppError("Invalid media type", HTTP_STATUS_CODE.BAD_REQUEST);
      }
      await this.chatService.sendMessage(
        senderId,
        receiverId,
        content,
        mediaUrl,
        mediaType
      );
      res
        .status(HTTP_STATUS_CODE.OK)
        .json({ success: true, message: "Message sent" });
    } catch (error) {
      next(error);
    }
  }

  async getChatHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { receiverId } = req.query;
      const senderId = req.user?.id as string;
      if (!senderId || !receiverId) {
        throw new AppError(
          "Sender ID and receiver ID are required",
          HTTP_STATUS_CODE.BAD_REQUEST
        );
      }
      const history = await this.chatService.getChatHistory(
        senderId,
        receiverId as string
      );
      res.status(HTTP_STATUS_CODE.OK).json({ success: true, data: history });
    } catch (error) {
      next(error);
    }
  }

  async markMessageAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId, friendId } = req.body;
      await this.chatService.markMessagesAsRead(userId, friendId);
      const lastMessage = await this.chatService.getLastMessage(
        userId,
        friendId
      );
      const unreadCount = await this.chatService.getUnreadMessageCount(
        userId,
        friendId
      );
      chatIo.to(userId).emit("update-last-message", {
        friendId,
        lastMessage,
        unreadCount,
      });
      res
        .status(HTTP_STATUS_CODE.OK)
        .json({ success: true, message: "Mark messages as read" });
    } catch (error) {
      next(error);
    }
  }
}
