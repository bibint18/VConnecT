import mongoose from "mongoose";
import { IPostRepository,IPost } from "../../../interfaces/user/Community/IPostRepository";
import { Post } from "../../../models/PostModel";
import { timeStamp } from "console";
import { AppError } from "../../../utils/AppError";
export class PostRepository implements IPostRepository{
  async create(post: IPost): Promise<string> {
    
    const postData = {
      ...post,userId:new mongoose.Types.ObjectId(post.userId)
    }
    const newPost = new Post(post)
    await newPost.save()
    return newPost._id.toString()
  }

  async findById(postId: string): Promise<IPost | null> {
    // return Post.findOne({_id:postId,isDeleted:false}).exec()
    const postDoc = await Post.findOne({ _id: postId, isDeleted: false }).exec();
    if (!postDoc) {
      return null;
    }
    return {
      _id: postDoc._id.toString(),
      userId: postDoc.userId.toString(),
      content: postDoc.content,
      mediaUrl: postDoc.mediaUrl,
      mediaType: postDoc.mediaType,
      likes: postDoc.likes,
      likeCount: postDoc.likeCount,
      commentCount: postDoc.commentCount,
      viewCount: postDoc.viewCount,
      timestamp: postDoc.timestamp,
      isDeleted: postDoc.isDeleted,
    };
  }

  async findByUserID(userId: string): Promise<IPost[]> {
    const postDocs = await Post.find({userId:new mongoose.Types.ObjectId(userId),isDeleted:false}).sort({timeStamp:-1}).exec()
    return postDocs.map(postDoc => ({
      _id: postDoc._id.toString(),
      userId: postDoc.userId.toString(),
      content: postDoc.content,
      mediaUrl: postDoc.mediaUrl,
      mediaType: postDoc.mediaType,
      likes: postDoc.likes,
      likeCount: postDoc.likeCount,
      commentCount: postDoc.commentCount,
      viewCount: postDoc.viewCount,
      timestamp: postDoc.timestamp,
      isDeleted: postDoc.isDeleted,
    }));
  }

  async update(postId: string, updates: Partial<IPost>): Promise<void> {
    const allowedUpdates = ['content']
    const updatedFields = allowedUpdates.filter(key => allowedUpdates.includes(key))
    if(updatedFields.length  ===0){
      throw new AppError("No valid fields to update",404)
    }
    await Post.updateOne({_id:postId,isDeleted:false},{$set:updates}).exec()
  }

  async delete(postId: string): Promise<void> {
    await Post.updateOne({_id:postId},{isDeleted:true}).exec()
  }
}