import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICommentDocument extends Document {
  postId:Types.ObjectId ;
  userId: Types.ObjectId;
  content: string;
  timestamp: Date;
  isDeleted: boolean;
}

const commentSchema = new Schema<ICommentDocument>({
  postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

export const Comment = mongoose.model<ICommentDocument>('Comment', commentSchema);