"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const ProfileController_1 = __importDefault(require("../controllers/ProfileController"));
const RoomController_1 = __importDefault(require("../controllers/RoomController"));
const FriendController_1 = require("../controllers/FriendController");
const FriendRepository_1 = require("../repositories/FriendRepository");
const DailyTriviaRepository_1 = require("../repositories/DailyTriviaRepository");
const DailyTriviaService_1 = require("../services/DailyTriviaService");
const DailyTriviaController_1 = require("../controllers/DailyTriviaController");
const UserFriendRepository_1 = require("../repositories/UserFriendRepository");
const UserFriendService_1 = require("../services/UserFriendService");
const UserFriendController_1 = require("../controllers/UserFriendController");
const ChatRepository_1 = require("../repositories/User/Chat/ChatRepository");
const IChatServices_1 = require("../services/User/Chat/IChatServices");
const ChatController_1 = require("../controllers/Admin/Chat/ChatController");
const FriendCallRepository_1 = require("../repositories/User/call/FriendCallRepository");
const UserRewardRepository_1 = require("../repositories/User/Reward/UserRewardRepository");
const UserRewardService_1 = require("../services/User/Reward/UserRewardService");
const userRepository_1 = require("../repositories/userRepository");
const UserRewardController_1 = require("../controllers/User/Reward/UserRewardController");
const UserPlansRepository_1 = require("../repositories/User/Plans/UserPlansRepository");
const UserPlansService_1 = require("../services/User/Plans/UserPlansService");
const UserPlansController_1 = require("../controllers/User/Plans/UserPlansController");
const PaymentService_1 = require("../services/User/Payment/PaymentService");
const PaymentController_1 = require("../controllers/User/Payment/PaymentController");
const PostRepository_1 = require("../repositories/User/Post/PostRepository");
const PostService_1 = require("../services/User/Post/PostService");
const CloudinaryService_1 = require("../services/User/Post/CloudinaryService");
const PostController_1 = require("../controllers/User/Post/PostController");
const express_validator_1 = require("express-validator");
const createUserRoutes = (chatIo, directCallController) => {
    const router = express_1.default.Router();
    //profile
    router.get('/user/profile', authMiddleware_1.authenticateToken, ProfileController_1.default.getProfile.bind(ProfileController_1.default));
    router.put('/user/profile/edit', authMiddleware_1.authenticateToken, ProfileController_1.default.updateProfile.bind(ProfileController_1.default));
    router.get('/user/profile/signature', authMiddleware_1.authenticateToken, ProfileController_1.default.getCloudinarySignature.bind(ProfileController_1.default));
    router.get('/chat/signature', authMiddleware_1.authenticateToken, ProfileController_1.default.getChatCloudinarySignature.bind(ProfileController_1.default));
    router.post('/user/profile/image', authMiddleware_1.authenticateToken, ProfileController_1.default.updateProfileImage.bind(ProfileController_1.default));
    router.post('/user/profile/streak', authMiddleware_1.authenticateToken, ProfileController_1.default.updateStreak.bind(ProfileController_1.default));
    router.post('/user/profile/change-password', authMiddleware_1.authenticateToken, ProfileController_1.default.changePassword.bind(ProfileController_1.default));
    //rooms
    router.post('/user/room/create', authMiddleware_1.authenticateToken, RoomController_1.default.createRoom.bind(RoomController_1.default));
    router.get('/user/rooms', authMiddleware_1.authenticateToken, RoomController_1.default.getAllRooms.bind(RoomController_1.default));
    router.post('/user/room/join', authMiddleware_1.authenticateToken, RoomController_1.default.joinRoom.bind(RoomController_1.default));
    //friends
    const friendRepository = new FriendRepository_1.FriendRepository();
    const friendController = new FriendController_1.FriendController(friendRepository);
    router.get('/user/friend/requests', authMiddleware_1.authenticateToken, friendController.getPendingRequests);
    router.get('/user/friends', authMiddleware_1.authenticateToken, friendController.getFriends);
    //Trivia
    const dailyTriviaRepository = new DailyTriviaRepository_1.DailyTriviaRepository();
    const dailyTriviaService = new DailyTriviaService_1.DailyTriviaService(dailyTriviaRepository);
    const dailyTriviaController = new DailyTriviaController_1.DailyTriviaController(dailyTriviaService);
    router.get('/user/trivia', authMiddleware_1.authenticateToken, dailyTriviaController.getDailyTriviaQuestions.bind(dailyTriviaController));
    router.post('/user/trivia/submit', authMiddleware_1.authenticateToken, dailyTriviaController.submitTriviaAnswer.bind(dailyTriviaController));
    const userFriendRepository = new UserFriendRepository_1.UserFriendRespository();
    const userFriendService = new UserFriendService_1.UserFriendService(userFriendRepository);
    const userFriendController = new UserFriendController_1.UserFriendController(userFriendService);
    router.get('/user/chat/friends', authMiddleware_1.authenticateToken, userFriendController.getUserFriends.bind(userFriendController));
    //chat
    const chatRepository = new ChatRepository_1.ChatRepository();
    const callRepository = new FriendCallRepository_1.FriendCallRepository;
    const chatService = new IChatServices_1.ChatService(chatRepository, chatIo, callRepository);
    const chatController = new ChatController_1.ChatController(chatService);
    router.post('/chat/send', authMiddleware_1.authenticateToken, chatController.sendMessage.bind(chatController));
    router.get('/chat/history', authMiddleware_1.authenticateToken, chatController.getChatHistory.bind(chatController));
    router.post('/chat/mark-read', authMiddleware_1.authenticateToken, chatController.markMessageAsRead.bind(chatController));
    // reward
    const rewardRepository = new UserRewardRepository_1.UserRewardRepository();
    const userRepository = new userRepository_1.UserRepository();
    const rewardService = new UserRewardService_1.UserRewardService(rewardRepository, userRepository);
    const rewardController = new UserRewardController_1.UserRewardController(rewardService);
    router.get('/rewards', authMiddleware_1.authenticateToken, rewardController.getUserRewards.bind(rewardController));
    router.post('/rewards/claim/:rewardid', authMiddleware_1.authenticateToken, rewardController.claimReward.bind(rewardController));
    router.post('/user/checkin', authMiddleware_1.authenticateToken, rewardController.checkIn.bind(rewardController));
    router.get('/user/details/:userId', authMiddleware_1.authenticateToken, rewardController.getUserDetails.bind(rewardController));
    //plans
    const plansRepository = new UserPlansRepository_1.UserPlanRepository();
    const plansService = new UserPlansService_1.UserPlanService(plansRepository, userRepository);
    const plansController = new UserPlansController_1.UserPlanController(plansService);
    router.get('/plans', authMiddleware_1.authenticateToken, plansController.getPlans.bind(plansController));
    router.get('/user-plan', authMiddleware_1.authenticateToken, plansController.getUserPlan.bind(plansController));
    //payment
    const paymentService = new PaymentService_1.PaymentService(plansRepository);
    const paymentController = new PaymentController_1.PaymentController(paymentService, plansService);
    router.post('/payments/create', authMiddleware_1.authenticateToken, paymentController.createPayment.bind(paymentController));
    router.get('/payments/execute', paymentController.executePayment.bind(paymentController));
    //call detailss
    router.get("/call/details", authMiddleware_1.authenticateToken, directCallController.getCallDetails.bind(directCallController));
    //post
    const postRepository = new PostRepository_1.PostRepository();
    const cloudinaryService = new CloudinaryService_1.CloudinaryService();
    const postService = new PostService_1.PostService(postRepository, cloudinaryService);
    const postController = new PostController_1.PostController(postService, cloudinaryService);
    router.post('/posts', authMiddleware_1.authenticateToken, [
        (0, express_validator_1.body)('content').optional().isString().trim().isLength({ max: 1000 }),
        (0, express_validator_1.body)('mediaUrl').optional().isString(),
        (0, express_validator_1.body)('mediaType').optional().isIn(['text', 'image', 'video']),
    ], postController.createPost.bind(postController));
    router.delete('/post/:postId', authMiddleware_1.authenticateToken, postController.deletePost.bind(postController));
    router.get('/post/signature', authMiddleware_1.authenticateToken, postController.getCloudinarySignature.bind(postController));
    router.get('/my-posts', authMiddleware_1.authenticateToken, postController.getMyPosts.bind(postController));
    router.put('/posts/:postId', authMiddleware_1.authenticateToken, [(0, express_validator_1.body)('content').notEmpty().isString().trim().isLength({ max: 1000 })], postController.editPost.bind(postController));
    router.get('/posts/user', authMiddleware_1.authenticateToken, postController.getUserDetails.bind(postController));
    router.get('/feed', authMiddleware_1.authenticateToken, [(0, express_validator_1.query)('page').optional().isInt({ min: 1 }), (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 50 })], postController.getFeed.bind(postController));
    router.post('/posts/:postId/like', authMiddleware_1.authenticateToken, postController.likePost.bind(postController));
    router.post('/posts/:postId/dislike', authMiddleware_1.authenticateToken, postController.dislikePost.bind(postController));
    router.post('/posts/:postId/comments', authMiddleware_1.authenticateToken, [(0, express_validator_1.body)('content').notEmpty().isString().trim().isLength({ max: 1000 })], postController.commentOnPost.bind(postController));
    router.get('/posts/:postId/comments', authMiddleware_1.authenticateToken, postController.getPostComments.bind(postController));
    router.get("/posts/:postId", authMiddleware_1.authenticateToken, postController.getPostById.bind(postController));
    return router;
};
exports.createUserRoutes = createUserRoutes;
