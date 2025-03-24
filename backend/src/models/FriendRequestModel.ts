import mongoose, { Schema } from "mongoose";

interface IFriendRequest {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

const friendRequestSchema = new Schema<IFriendRequest>({
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export const FriendRequest = mongoose.model<IFriendRequest>("FriendRequest", friendRequestSchema);