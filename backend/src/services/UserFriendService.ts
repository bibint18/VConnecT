import { IUserFriendService } from "../interfaces/IUserFriendService.js";
import { IUserFriendRepository } from "../interfaces/IUserFriendRepository.js";

export class UserFriendService implements IUserFriendService{
  private userFriendRepository:IUserFriendRepository;
  constructor(userFriendRepository:IUserFriendRepository){
    this.userFriendRepository=userFriendRepository
  }

   async getUserFriends(userId: string): Promise<{ id: string; name: string; avatar: string; lastMessage: string; timestamp: string; isOnline: boolean; }[]> {
    return await this.userFriendRepository.getUserFriends(userId)
  }
}