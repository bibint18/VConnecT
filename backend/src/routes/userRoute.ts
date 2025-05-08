import express from 'express'
import { authenticateToken } from '../middlewares/authMiddleware'
import ProfileController from '../controllers/ProfileController'
import RoomController from '../controllers/RoomController'
import { FriendController } from '../controllers/FriendController'
import { FriendRepository } from '../repositories/FriendRepository'
import { DailyTriviaRepository } from '../repositories/DailyTriviaRepository'
import { DailyTriviaService } from '../services/DailyTriviaService'
import { DailyTriviaController } from '../controllers/DailyTriviaController'
import { UserFriendRespository } from '../repositories/UserFriendRepository'
import { UserFriendService } from '../services/UserFriendService'
import { UserFriendController } from '../controllers/UserFriendController'
import { ChatRepository } from '../repositories/User/Chat/ChatRepository'
import { ChatService } from '../services/User/Chat/IChatServices'
import { ChatController } from '../controllers/Admin/Chat/ChatController'
import { Namespace } from 'socket.io'
import { FriendCallRepository } from '../repositories/User/call/FriendCallRepository'
import { UserRewardRepository } from '../repositories/User/Reward/UserRewardRepository'
import { UserRewardService } from '../services/User/Reward/UserRewardService'
import { UserRepository } from '../repositories/userRepository'
import { UserRewardController } from '../controllers/User/Reward/UserRewardController'
import { UserPlanRepository } from '../repositories/User/Plans/UserPlansRepository'
import { UserPlanService } from '../services/User/Plans/UserPlansService'
import { UserPlanController } from '../controllers/User/Plans/UserPlansController'
import { PaymentService } from '../services/User/Payment/PaymentService'
import { PaymentController } from '../controllers/User/Payment/PaymentController'
import { DirectCallController } from '../controllers/User/Call/DirectCallController'
import { PostRepository } from '../repositories/User/Post/PostRepository'
import { PostService } from '../services/User/Post/PostService'
import { CloudinaryService } from '../services/User/Post/CloudinaryService'
import { PostController } from '../controllers/User/Post/PostController'
import { body, query } from 'express-validator'
export const createUserRoutes = (chatIo:Namespace,directCallController:DirectCallController) => {
const router = express.Router()

//profile
router.get('/user/profile',authenticateToken,ProfileController.getProfile.bind(ProfileController))
router.put('/user/profile/edit',authenticateToken,ProfileController.updateProfile.bind(ProfileController))
router.get('/user/profile/signature',authenticateToken,ProfileController.getCloudinarySignature.bind(ProfileController))
router.get('/chat/signature',authenticateToken,ProfileController.getChatCloudinarySignature.bind(ProfileController))
router.post('/user/profile/image',authenticateToken,ProfileController.updateProfileImage.bind(ProfileController))
router.post('/user/profile/streak',authenticateToken,ProfileController.updateStreak.bind(ProfileController))
router.post('/user/profile/change-password',authenticateToken,ProfileController.changePassword.bind(ProfileController))

//rooms
router.post('/user/room/create',authenticateToken,RoomController.createRoom.bind(RoomController))
router.get('/user/rooms',authenticateToken,RoomController.getAllRooms.bind(RoomController))
router.post('/user/room/join',authenticateToken,RoomController.joinRoom.bind(RoomController))

//friends

const friendRepository = new FriendRepository();
const friendController = new FriendController(friendRepository);
router.get('/user/friend/requests',authenticateToken,friendController.getPendingRequests)
router.get('/user/friends',authenticateToken,friendController.getFriends)


//Trivia
const dailyTriviaRepository = new DailyTriviaRepository()
const dailyTriviaService = new DailyTriviaService(dailyTriviaRepository)
const dailyTriviaController = new DailyTriviaController(dailyTriviaService)
router.get('/user/trivia',authenticateToken,dailyTriviaController.getDailyTriviaQuestions.bind(dailyTriviaController))
router.post('/user/trivia/submit',authenticateToken,dailyTriviaController.submitTriviaAnswer.bind(dailyTriviaController))


const userFriendRepository = new UserFriendRespository()
const userFriendService = new UserFriendService(userFriendRepository)
const userFriendController = new UserFriendController(userFriendService)
router.get('/user/chat/friends',authenticateToken,userFriendController.getUserFriends.bind(userFriendController))


//chat
const chatRepository = new ChatRepository()
const callRepository = new FriendCallRepository
const chatService = new ChatService(chatRepository,chatIo,callRepository)
const chatController = new ChatController(chatService)
router.post('/chat/send',authenticateToken,chatController.sendMessage.bind(chatController))
router.get('/chat/history',authenticateToken,chatController.getChatHistory.bind(chatController))
router.post('/chat/mark-read',authenticateToken,chatController.markMessageAsRead.bind(chatController))
// reward
const rewardRepository = new UserRewardRepository()
const userRepository = new UserRepository()
const rewardService = new UserRewardService(rewardRepository,userRepository)
const rewardController = new UserRewardController(rewardService)
router.get('/rewards',authenticateToken,rewardController.getUserRewards.bind(rewardController))
router.post('/rewards/claim/:rewardid',authenticateToken,rewardController.claimReward.bind(rewardController))
router.post('/user/checkin',authenticateToken,rewardController.checkIn.bind(rewardController))
router.get('/user/details/:userId',authenticateToken,rewardController.getUserDetails.bind(rewardController))

//plans
const plansRepository = new UserPlanRepository()
const plansService = new UserPlanService(plansRepository,userRepository)
const plansController = new UserPlanController(plansService)
router.get('/plans',authenticateToken,plansController.getPlans.bind(plansController))
router.get('/user-plan',authenticateToken,plansController.getUserPlan.bind(plansController))

//payment
const paymentService = new PaymentService(plansRepository)
const paymentController = new PaymentController(paymentService,plansService)
router.post('/payments/create',authenticateToken,paymentController.createPayment.bind(paymentController))
router.get('/payments/execute',paymentController.executePayment.bind(paymentController))



//call detailss
router.get("/call/details", authenticateToken,directCallController.getCallDetails.bind(directCallController));


//post
const postRepository = new PostRepository()
const cloudinaryService = new CloudinaryService()
const postService = new PostService(postRepository)
const postController = new PostController(postService,cloudinaryService)
router.post('/posts',authenticateToken,[
  body('content').optional().isString().trim().isLength({ max: 1000 }),
  body('mediaUrl').optional().isString(),
  body('mediaType').optional().isIn(['text', 'image', 'video']),
],postController.createPost.bind(postController))
router.delete('/post/:postId',authenticateToken,postController.deletePost.bind(postController))
router.get('/post/signature',authenticateToken,postController.getCloudinarySignature.bind(postController))
router.get('/my-posts',authenticateToken,postController.getMyPosts.bind(postController))
router.put('/posts/:postId',authenticateToken,[body('content').notEmpty().isString().trim().isLength({ max: 1000 })],postController.editPost.bind(postController))
router.get('/posts/user',authenticateToken,postController.getUserDetails.bind(postController))
router.get('/feed',authenticateToken,[query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 50 })],postController.getFeed.bind(postController))
router.post('/posts/:postId/like',authenticateToken,postController.likePost.bind(postController))
router.post('/posts/:postId/dislike',authenticateToken,postController.dislikePost.bind(postController))
router.post('/posts/:postId/comments',authenticateToken,[body('content').notEmpty().isString().trim().isLength({ max: 1000 })],postController.commentOnPost.bind(postController))
router.get('/posts/:postId/comments',authenticateToken,postController.getPostComments.bind(postController))
router.get("/posts/:postId",authenticateToken,postController.getPostById.bind(postController))
return router
}