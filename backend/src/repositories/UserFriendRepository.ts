import { IUserFriendRepository } from "../interfaces/IUserFriendRepository.js";
import { Message } from "../models/MessageModel.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export class UserFriendRespository implements IUserFriendRepository{
  async getUserFriends(userId: string): Promise<{ id: string; name: string; avatar: string; lastMessage: string; timestamp: string; isOnline: boolean; unreadCount:number;fullTimestamp: Date; }[]> {
    try {
      const user = await User.findById(userId).populate('friends','_id name profileImage').exec()
      if(!user){
        throw new AppError("User not found",404)
      }
      
      const friendList = await Promise.all(
        user.friends.map(async (friend:any) => {
          const lastMessage = await Message.findOne({
            $or:[
              {senderId:user._id,receiverId:friend._id},
              {senderId:friend._id,receiverId:user._id}
            ]
          }).sort({timestamp:-1})
          const unreadCount = await Message.countDocuments({senderId:friend._id,receiverId:user._id,isRead:false})
          const formattedTimestamp = lastMessage?.timestamp
            ? new Date(lastMessage.timestamp).toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : new Date().toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
          return{
            id:friend._id.toString(),
            name:friend.name,
            avatar:friend.profileImage || "https://via.placeholder.com/150" ,
            lastMessage: lastMessage?.content || "NO MESSAGES YET",
            timestamp:formattedTimestamp,
            fullTimestamp:lastMessage?.timestamp || new Date(),
            isOnline:false,
            unreadCount
          }
        })
      )
      friendList.sort((a, b) => new Date(b.fullTimestamp).getTime() - new Date(a.fullTimestamp).getTime());
      return friendList
    } catch (error) {
      throw error instanceof AppError ? error : new AppError("Failed to fetch friends", 500);
    }
  } 
}