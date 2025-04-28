import mongoose from "mongoose";
import { IPostRepository,IPost } from "../../../interfaces/user/Community/IPostRepository";
import { Post } from "../../../models/PostModel";
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

  async delete(postId: string): Promise<void> {
    await Post.updateOne({_id:postId},{isDeleted:true}).exec()
  }
}