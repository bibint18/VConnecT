import mongoose from "mongoose";
import { IPostRepository,IPost, IComment } from "../../../interfaces/user/Community/IPostRepository.js";
import { Post } from "../../../models/PostModel.js";
import { AppError } from "../../../utils/AppError.js";
import { IUser, User } from "../../../models/User.js";
import { Comment} from "../../../models/CommentModel.js";
export class PostRepository implements IPostRepository{
  async create(post:IPost): Promise<string> {
    const newPost = new Post(post)
    await newPost.save()
    return newPost._id.toString()
  }

  async findById(postId: string): Promise<IPost | null> {
    const postDoc = await Post.findOne({ _id: postId, isDeleted: false }).populate('userId','username profileImage').exec();
    if (!postDoc) {
      return null;
    }
    return {
      _id: postDoc._id.toString(),
      userId: {
        _id: postDoc.userId._id.toString(),
        username: (postDoc.userId as any).username,
        profileImage: (postDoc.userId as any).profileImage,
      },
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
      userId: {
        _id: postDoc.userId._id.toString(),
        username: (postDoc.userId as any).username,
        name:(postDoc.userId as any).name,
        profileImage: (postDoc.userId as any).profileImage,
      },
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

  async findUserById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId)
    if(!user){
      return null
    }
    return user
  }

  async findAllPosts(page: number, limit: number): Promise<{ posts: IPost[]; total: number; }> {
    const skip = (page -1) * limit
    const [postDocs ,total] = await Promise.all([
      Post.find({isDeleted:false}).populate('userId','username name profileImage').sort({timestamp:-1}).skip(skip).limit(limit).exec(),
      Post.countDocuments({isDeleted:false})
    ])
    const posts = postDocs.map(postDoc => ({
      _id:postDoc._id.toString(),
      userId: {
        _id: postDoc.userId._id.toString(),
        username: (postDoc.userId as any).username,
        name:(postDoc.userId as any).name,
        profileImage: (postDoc.userId as any).profileImage,
      },
      content: postDoc.content,
      mediaUrl: postDoc.mediaUrl,
      mediaType: postDoc.mediaType,
      likes: postDoc.likes,
      likeCount: postDoc.likeCount,
      commentCount: postDoc.commentCount,
      viewCount: postDoc.viewCount,
      timestamp: postDoc.timestamp,
      isDeleted: postDoc.isDeleted,
    })) 
    return {posts,total}
  }

  async addLike(postId: string, userId: string): Promise<void> {
    await Post.updateOne({_id:postId,isDeleted:false,likes:{$ne:userId}},{$push:{likes:userId},$inc:{likeCount:1}})
  }

  async removeLike(postId: string, userId: string): Promise<void> {
    await Post.updateOne({_id:postId,isDeleted:false,likes:userId},{$pull:{likes:userId},$inc:{likeCount:-1}}).exec()
  }

  async addComment(postId: string, comment: IComment): Promise<string> {
    const commentDoc = new Comment({
      ...comment,
      postId:new mongoose.Types.ObjectId(postId),
      userId:new mongoose.Types.ObjectId(comment.userId),
      timestamp:new Date(),
    }) 
    await commentDoc.save();
    await Post.updateOne({_id:postId},{$inc:{commentCount:1}}).exec()
    return (commentDoc._id as unknown as mongoose.Types.ObjectId).toString()
  }

  async getComments(postId: string): Promise<IComment[]> {
    const commentDocs = await Comment.find({postId,isDeleted:false}).populate<{ userId: IUser }>('userId', 'username name profilePicture').sort({timestamp:-1}).lean().exec() 
    return commentDocs.map(commentDoc => ({
      _id: commentDoc._id.toString(),
      postId: commentDoc.postId.toString(),
      userId: commentDoc.userId._id.toString(),
      content: commentDoc.content,
      timestamp: commentDoc.timestamp,
      username:commentDoc.userId.username,
      name:commentDoc.userId.name,
      profilePicture:commentDoc.userId.profileImage,
      isDeleted: commentDoc.isDeleted,
    }))
  }

  async findUsersByIds(userIds: string[]): Promise<{ _id: string; username: string }[]> {
    if (!userIds.length) {
      return [];
    }
    const users = await User.find({ _id: { $in: userIds } })
      .select('_id username')
      .lean()
      .exec();
    return users.map(user => ({
      _id: user._id.toString(),
      username: user.username || 'Anonymous',
    }));
  }
}