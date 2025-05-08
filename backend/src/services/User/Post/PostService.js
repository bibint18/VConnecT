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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const AppError_1 = require("../../../utils/AppError");
class PostService {
    constructor(postRepository, cloudinaryService) {
        this.postRepository = postRepository;
        this.cloudinaryService = cloudinaryService;
    }
    createPost(userId, content, mediaUrl, mediaType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!content && !mediaUrl) {
                throw new AppError_1.AppError('Content or media required', 400);
            }
            const user = yield this.postRepository.findUserById(userId);
            if (!user) {
                throw new AppError_1.AppError('User not found', 404);
            }
            const post = {
                // userId,
                userId: {
                    _id: user._id,
                    username: user.username,
                    profileImage: user.profileImage,
                },
                content,
                mediaUrl,
                mediaType: mediaUrl ? mediaType : 'text',
                likes: [],
                likeCount: 0,
                commentCount: 0,
                viewCount: 0,
                timestamp: new Date(),
                isDeleted: false,
            };
            return this.postRepository.create(post);
        });
    }
    deletePost(userId, postId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.findById(postId);
            if (!post) {
                throw new AppError_1.AppError('Post not found', 404);
            }
            // if (post.userId !== userId && !isAdmin) {
            //   throw new AppError('Unauthorized', 403);
            // }
            // if (post.mediaUrl && post.mediaType !== 'text') {
            //   const publicId = post.mediaUrl.split('/').pop()?.split('.')[0] || '';
            //   await this.cloudinaryService.deleteMedia(publicId, post.mediaType as 'image' | 'video');
            // }
            yield this.postRepository.delete(postId);
        });
    }
    editPost(postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.findById(postId);
            if (!post) {
                throw new Error("Post not found");
            }
            if (!content.trim()) {
                throw new AppError_1.AppError('Content cannot be empty', 400);
            }
            yield this.postRepository.update(postId, { content });
        });
    }
    getMyPost(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.findByUserID(userId);
        });
    }
    getUserDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.findUserById(userId);
        });
    }
    getFeed(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.findAllPosts(page, limit);
        });
    }
    likePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.findById(postId);
            if (!post) {
                throw new Error("Post not found");
            }
            if (post.likes.includes(userId)) {
                throw new AppError_1.AppError("Already liked", 400);
            }
            yield this.postRepository.addLike(postId, userId);
        });
    }
    dislikePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.findById(postId);
            if (!post)
                throw new AppError_1.AppError('Post not found', 404);
            if (!post.likes.includes(userId))
                throw new AppError_1.AppError('Not liked yet', 400);
            yield this.postRepository.removeLike(postId, userId);
        });
    }
    commentOnPost(postId, userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!content.trim())
                throw new AppError_1.AppError('Content cannot be empty', 400);
            const post = yield this.postRepository.findById(postId);
            if (!post) {
                throw new AppError_1.AppError("Post not found", 400);
            }
            const comment = { userId, content, postId };
            return yield this.postRepository.addComment(postId, comment);
        });
    }
    getPostComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.getComments(postId);
        });
    }
    getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.findById(postId);
            if (!post) {
                throw new AppError_1.AppError('Post not found', 404);
            }
            return post;
        });
    }
}
exports.PostService = PostService;
