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
exports.PostController = void 0;
const express_validator_1 = require("express-validator");
const AppError_1 = require("../../../utils/AppError");
class PostController {
    constructor(postService, cloudinaryService) {
        this.postService = postService;
        this.cloudinaryService = cloudinaryService;
    }
    createPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("Reached create post");
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new AppError_1.AppError('Validation failed', 400);
                }
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                console.log("userId", userId);
                const { content, mediaUrl, mediaType } = req.body;
                console.log("Data fetched from cloudinary upload", content, mediaUrl, mediaType);
                const postId = yield this.postService.createPost(userId, content, mediaUrl, mediaType);
                res.status(201).json({ postId, message: 'Post created' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deletePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("delete post reached ");
                const userId = req.user.id;
                const isAdmin = req.user.role === 'admin';
                const { postId } = req.params;
                yield this.postService.deletePost(userId, postId, isAdmin);
                res.status(200).json({ message: 'Post deleted' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCloudinarySignature(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("get cloudinary post reached");
                const signature = this.cloudinaryService.generateUploadSignature();
                res.json(signature);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getMyPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("reached my post");
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw new Error("No user Id");
                }
                const posts = yield this.postService.getMyPost(userId);
                res.status(200).json(posts);
            }
            catch (error) {
                next(error);
            }
        });
    }
    editPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new AppError_1.AppError('Validation failed', 400);
                }
                const { postId } = req.params;
                const { content } = req.body;
                yield this.postService.editPost(postId, content);
                res.status(200).json({ message: "Post updated successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const user = yield this.postService.getUserDetails(userId);
                res.status(200).json(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getFeed(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reached feed");
                const page = parseInt(req.query.page, 10) || 1;
                const limit = parseInt(req.query.limit, 10) || 10;
                const feed = yield this.postService.getFeed(page, limit);
                console.log('Feed Data Before Sending:', feed);
                res.status(200).json(feed);
            }
            catch (error) {
                next(error);
            }
        });
    }
    likePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("Like post reached");
                const { postId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                yield this.postService.likePost(postId, userId);
                res.status(200).json({ message: "Post Liked" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    dislikePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("dislike post reached");
                const { postId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                console.log("userId dislike", userId);
                yield this.postService.dislikePost(postId, userId);
                res.status(200).json({ message: "Post unliked" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    commentOnPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { postId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { content } = req.body;
                const commentId = yield this.postService.commentOnPost(postId, userId, content);
                res.status(200).json({ commentId, message: "Comment added" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPostComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("get post comments fetched");
                const { postId } = req.params;
                const comments = yield this.postService.getPostComments(postId);
                res.status(200).json(comments);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPostById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Reached getPostById");
                const { postId } = req.params;
                const post = yield this.postService.getPostById(postId);
                res.status(200).json(post);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.PostController = PostController;
