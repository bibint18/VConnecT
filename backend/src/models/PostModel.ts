
import mongoose, { Schema, Types } from 'mongoose';

export interface IPostDocument {
  _id:Types.ObjectId;
  userId:Types.ObjectId;
  content?: string;
  mediaUrl?: string;
  mediaType?: 'text' | 'image' | 'video';
  likes: string[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
  timestamp: Date;
  isDeleted: boolean;
}
const postSchema = new Schema<IPostDocument>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true } ,
    content: { type: String, trim: true },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
    likes: [{ type: String }],
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

postSchema.index({ timestamp: -1 });
postSchema.index({ userId: 1 });

export const Post = mongoose.model<IPostDocument>('Post', postSchema);