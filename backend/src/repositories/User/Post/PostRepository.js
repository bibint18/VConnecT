"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PostModel_1 = require("../../../models/PostModel");
const AppError_1 = require("../../../utils/AppError");
const User_1 = require("../../../models/User");
const CommentModel_1 = require("../../../models/CommentModel");
class PostRepository {
    create(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const postData = Object.assign(Object.assign({}, post), { userId: new mongoose_1.default.Types.ObjectId(post.userId._id) });
            const newPost = new PostModel_1.Post(post);
            yield newPost.save();
            return newPost._id.toString();
        });
    }
    findById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postDoc = yield PostModel_1.Post.findOne({ _id: postId, isDeleted: false }).populate('userId', 'username profileImage').exec();
            if (!postDoc) {
                return null;
            }
            return {
                _id: postDoc._id.toString(),
                userId: {
                    _id: postDoc.userId._id.toString(),
                    username: postDoc.userId.username,
                    profileImage: postDoc.userId.profileImage,
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
        });
    }
    findByUserID(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postDocs = yield PostModel_1.Post.find({ userId: new mongoose_1.default.Types.ObjectId(userId), isDeleted: false }).sort({ timeStamp: -1 }).exec();
            return postDocs.map(postDoc => ({
                _id: postDoc._id.toString(),
                userId: {
                    _id: postDoc.userId._id.toString(),
                    username: postDoc.userId.username,
                    profileImage: postDoc.userId.profileImage,
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
        });
    }
    update(postId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const allowedUpdates = ['content'];
            const updatedFields = allowedUpdates.filter(key => allowedUpdates.includes(key));
            if (updatedFields.length === 0) {
                throw new AppError_1.AppError("No valid fields to update", 404);
            }
            yield PostModel_1.Post.updateOne({ _id: postId, isDeleted: false }, { $set: updates }).exec();
        });
    }
    delete(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield PostModel_1.Post.updateOne({ _id: postId }, { isDeleted: true }).exec();
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findById(userId);
            if (!user) {
                return null;
            }
            return user;
        });
    }
    findAllPosts(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [postDocs, total] = yield Promise.all([
                PostModel_1.Post.find({ isDeleted: false }).populate('userId', 'username profileImage').sort({ timestamp: -1 }).skip(skip).limit(limit).exec(),
                PostModel_1.Post.countDocuments({ isDeleted: false })
            ]);
            console.log('Raw Post Docs with Population:', postDocs);
            const posts = postDocs.map(postDoc => ({
                _id: postDoc._id.toString(),
                userId: {
                    _id: postDoc.userId._id.toString(),
                    username: postDoc.userId.username,
                    profileImage: postDoc.userId.profileImage,
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
            return { posts, total };
        });
    }
    addLike(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield PostModel_1.Post.updateOne({ _id: postId, isDeleted: false, likes: { $ne: userId } }, { $push: { likes: userId }, $inc: { likeCount: 1 } });
        });
    }
    removeLike(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("reached repo dislike", postId, userId);
            yield PostModel_1.Post.updateOne({ _id: postId, isDeleted: false, likes: userId }, { $pull: { likes: userId }, $inc: { likeCount: -1 } }).exec();
        });
    }
    addComment(postId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentDoc = new CommentModel_1.Comment(Object.assign(Object.assign({}, comment), { postId: new mongoose_1.default.Types.ObjectId(postId), userId: new mongoose_1.default.Types.ObjectId(comment.userId), timestamp: new Date() }));
            yield commentDoc.save();
            yield PostModel_1.Post.updateOne({ _id: postId }, { $inc: { commentCount: 1 } }).exec();
            // return commentDoc._id.toString();
            return commentDoc._id.toString();
        });
    }
    getComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentDocs = yield CommentModel_1.Comment.find({ postId, isDeleted: false }).populate('userId', 'username profilePicture').sort({ timestamp: -1 }).lean().exec();
            return commentDocs.map(commentDoc => ({
                _id: commentDoc._id.toString(),
                postId: commentDoc.postId.toString(),
                userId: commentDoc.userId._id.toString(),
                content: commentDoc.content,
                timestamp: commentDoc.timestamp,
                isDeleted: commentDoc.isDeleted,
            }));
        });
    }
}
exports.PostRepository = PostRepository;
