
import { IUser } from "../models/User";

export interface IFriendRepository{
  sendFriendRequest(from: string, to: string): Promise<void>;
  getPendingRequests(userId: string): Promise<{ id: string; from: IUser; createdAt: Date }[]>;
  respondToFriendRequest(requestId: string, userId: string, accept: boolean): Promise<void>;
  getFriends(userId: string): Promise<IUser[]>;
}