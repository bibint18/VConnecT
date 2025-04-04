export interface IUserFriendRepository{
  getUserFriends(userId:string):Promise<{id:string; name:string; avatar:string; lastMessage:string; timestamp:string; isOnline:boolean}[]>
}