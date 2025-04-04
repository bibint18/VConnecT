import { IUserFriendRepository } from "../interfaces/IUserFriendRepository";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";

export class UserFriendRespository implements IUserFriendRepository{
  async getUserFriends(userId: string): Promise<{ id: string; name: string; avatar: string; lastMessage: string; timestamp: string; isOnline: boolean; }[]> {
    try {
      const user = await User.findById(userId).populate('friends','_id name profileImage').exec()
      if(!user){
        throw new AppError("User not found",404)
      }
      const friendList = user.friends.map((friend:any) => ({
        id:friend._id.toString(),
        name:friend.name,
        avatar:friend.profileImage || "https://via.placeholder.com/150",
        lastMessage:'Hey how are you',
        timestamp: new Date().toISOString().slice(0,10),
        isOnline:false,
      }))
      return friendList
    } catch (error) {
      throw error instanceof AppError ? error : new AppError("Failed to fetch friends", 500);
    }
  } 
}