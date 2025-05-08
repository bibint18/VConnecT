import { IFriendRepository } from "../interfaces/IFriendRepository";
import { FriendRequest } from "../models/FriendRequestModel";
import { IUser,User} from "../models/User";
import { AppError } from "../utils/AppError";


// interface IPopulatedUser {
//   _id: string;
//   name: string;
//   username: string;
//   profileImage?: string;
// }

export class FriendRepository implements IFriendRepository{
  async sendFriendRequest(from: string, to: string): Promise<void> {
    if (from === to) throw new AppError("Cannot send friend request to yourself", 400)
      const existingRequest = await FriendRequest.findOne({
        from,
        to,
        status: "pending",
      }).exec();
      if (existingRequest) throw new AppError("Friend request already sent", 400);
      const areFriends = await User.findOne({
        _id: from,
        friends: { $in: [to] },
      }).exec();
      if (areFriends) throw new AppError("User is already your friend", 400);
      await FriendRequest.create({ from, to });
  }

  async getPendingRequests(userId: string): Promise<{ id: string; from: IUser; createdAt: Date }[]> {
    const requests = await FriendRequest.find({ to: userId, status: "pending" })
      .populate("from", "name username profileImage")
      .exec();
    return requests.map((req) => ({
      id: req._id.toString(),
      from: (req.from as unknown as IUser),
      createdAt: req.createdAt,
    }));
  }

  async respondToFriendRequest(requestId: string, userId: string, accept: boolean): Promise<void> {
    const request = await FriendRequest.findById(requestId).exec();
    if (!request) throw new AppError("Friend request not found", 404);
    if (request.to.toString() !== userId) throw new AppError("Unauthorized", 403);

    request.status = accept ? "accepted" : "rejected";
    await request.save();

    if (accept) {
      await User.findByIdAndUpdate(request.from, { $addToSet: { friends: request.to } }).exec();
      await User.findByIdAndUpdate(request.to, { $addToSet: { friends: request.from } }).exec();
    }
  }

  async getFriends(userId: string): Promise<IUser[]> {
    const user = await User.findById(userId).populate("friends", "name username profileImage").exec();
    if (!user) throw new AppError("User not found", 404);
    return user.friends as unknown as  IUser[];
  }
}