import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import ProfileController from "../controllers/ProfileController.js";
import RoomController from "../controllers/RoomController.js";
import { FriendController } from "../controllers/FriendController.js";
import { FriendRepository } from "../repositories/FriendRepository.js";
import { DailyTriviaRepository } from "../repositories/DailyTriviaRepository.js";
import { DailyTriviaService } from "../services/DailyTriviaService.js";
import { DailyTriviaController } from "../controllers/DailyTriviaController.js";
import { UserFriendRespository } from "../repositories/UserFriendRepository.js";
import { UserFriendService } from "../services/UserFriendService.js";
import { UserFriendController } from "../controllers/UserFriendController.js";
import { ChatRepository } from "../repositories/User/Chat/ChatRepository.js";
import { ChatService } from "../services/User/Chat/IChatServices.js";
import { ChatController } from "../controllers/Admin/Chat/ChatController.js";
import { Namespace } from "socket.io";
import { FriendCallRepository } from "../repositories/User/call/FriendCallRepository.js";
import { UserRewardRepository } from "../repositories/User/Reward/UserRewardRepository.js";
import { UserRewardService } from "../services/User/Reward/UserRewardService.js";
import { UserRepository } from "../repositories/userRepository.js";
import { UserRewardController } from "../controllers/User/Reward/UserRewardController.js";
import { UserPlanRepository } from "../repositories/User/Plans/UserPlansRepository.js";
import { UserPlanService } from "../services/User/Plans/UserPlansService.js";
import { UserPlanController } from "../controllers/User/Plans/UserPlansController.js";
import { PaymentService } from "../services/User/Payment/PaymentService.js";
import { PaymentController } from "../controllers/User/Payment/PaymentController.js";
import { DirectCallController } from "../controllers/User/Call/DirectCallController.js";
import { PostRepository } from "../repositories/User/Post/PostRepository.js";
import { PostService } from "../services/User/Post/PostService.js";
import { CloudinaryService } from "../services/User/Post/CloudinaryService.js";
import { PostController } from "../controllers/User/Post/PostController.js";
import { body, query } from "express-validator";
import { SubscriptionRepository } from "../repositories/User/SubscriptionRepository.js";
import { SubscriptionController } from "../controllers/SubscriptionController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { UpdateProfileDTO } from "../dtos/profile/updateProfile.dto.js";
import { UpdateProfileImageDTO } from "../dtos/profile/updateProfileImage.dto.js";
import { ChangePasswordDTO } from "../dtos/profile/changePassword.dto.js";
import { CreateRoomDTO } from "../dtos/Room/createRoom.dto.js";
import { GetAllRoomsDTO } from "../dtos/Room/getAllRooms.dto.js";
import { JoinRoomDTO } from "../dtos/Room/joinRoom.dto.js";
import { SubmitTriviaDto } from "../dtos/DailyTrivia/SubmitTrivia.dto.js";
export const createUserRoutes = (
  chatIo: Namespace,
  directCallController: DirectCallController
) => {
  const router = express.Router();

  //profile
  router.get(
    "/user/profile",
    authenticateToken,
    ProfileController.getProfile.bind(ProfileController)
  );
  router.put(
    "/user/profile/edit",
    authenticateToken,
    validateRequest(UpdateProfileDTO),
    ProfileController.updateProfile.bind(ProfileController)
  );
  router.get(
    "/user/profile/signature",
    authenticateToken,
    ProfileController.getCloudinarySignature.bind(ProfileController)
  );
  router.get(
    "/chat/signature",
    authenticateToken,
    ProfileController.getChatCloudinarySignature.bind(ProfileController)
  );
  router.post(
    "/user/profile/image",
    authenticateToken,
    validateRequest(UpdateProfileImageDTO),
    ProfileController.updateProfileImage.bind(ProfileController)
  );
  router.post(
    "/user/profile/streak",
    authenticateToken,
    ProfileController.updateStreak.bind(ProfileController)
  );
  router.post(
    "/user/profile/change-password",
    authenticateToken,
    validateRequest(ChangePasswordDTO),
    ProfileController.changePassword.bind(ProfileController)
  );

  //rooms
  router.post(
    "/user/room/create",
    authenticateToken,
    validateRequest(CreateRoomDTO),
    RoomController.createRoom.bind(RoomController)
  );
  router.get(
    "/user/rooms",
    authenticateToken,
    validateRequest(GetAllRoomsDTO),
    RoomController.getAllRooms.bind(RoomController)
  );
  router.post(
    "/user/room/join",
    authenticateToken,
    validateRequest(JoinRoomDTO),
    RoomController.joinRoom.bind(RoomController)
  );

  router.delete(
    "/user/room/:roomId",
    authenticateToken,
    RoomController.deleteRoom.bind(RoomController)
  );

  //friends

  const friendRepository = new FriendRepository();
  const friendController = new FriendController(friendRepository);
  router.get(
    "/user/friend/requests",
    authenticateToken,
    friendController.getPendingRequests
  );
  router.get("/user/friends", authenticateToken, friendController.getFriends);

  //Trivia
  const dailyTriviaRepository = new DailyTriviaRepository();
  const dailyTriviaService = new DailyTriviaService(dailyTriviaRepository);
  const dailyTriviaController = new DailyTriviaController(dailyTriviaService);
  router.get(
    "/user/trivia",
    authenticateToken,
    dailyTriviaController.getDailyTriviaQuestions.bind(dailyTriviaController)
  );
  router.post(
    "/user/trivia/submit",
    authenticateToken,
    validateRequest(SubmitTriviaDto),
    dailyTriviaController.submitTriviaAnswer.bind(dailyTriviaController)
  );

  const userFriendRepository = new UserFriendRespository();
  const userFriendService = new UserFriendService(userFriendRepository);
  const userFriendController = new UserFriendController(userFriendService);
  router.get(
    "/user/chat/friends",
    authenticateToken,
    userFriendController.getUserFriends.bind(userFriendController)
  );

  //chat
  const chatRepository = new ChatRepository();
  const callRepository = new FriendCallRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const subscriptionController = new SubscriptionController(
    subscriptionRepository
  );
  const chatService = new ChatService(
    chatRepository,
    chatIo,
    callRepository,
    subscriptionRepository
  );
  const chatController = new ChatController(chatService);
  router.post(
    "/chat/send",
    authenticateToken,
    chatController.sendMessage.bind(chatController)
  );
  router.get(
    "/chat/history",
    authenticateToken,
    chatController.getChatHistory.bind(chatController)
  );
  router.post(
    "/chat/mark-read",
    authenticateToken,
    chatController.markMessageAsRead.bind(chatController)
  );
  // reward
  const rewardRepository = new UserRewardRepository();
  const userRepository = new UserRepository();
  const rewardService = new UserRewardService(rewardRepository, userRepository);
  const rewardController = new UserRewardController(rewardService);
  router.get(
    "/rewards",
    authenticateToken,
    rewardController.getUserRewards.bind(rewardController)
  );
  router.post(
    "/rewards/claim/:rewardid",
    authenticateToken,
    rewardController.claimReward.bind(rewardController)
  );
  router.post(
    "/user/checkin",
    authenticateToken,
    rewardController.checkIn.bind(rewardController)
  );
  router.get(
    "/user/details/:userId",
    authenticateToken,
    rewardController.getUserDetails.bind(rewardController)
  );

  //plans
  const plansRepository = new UserPlanRepository();
  const plansService = new UserPlanService(plansRepository, userRepository);
  const plansController = new UserPlanController(plansService);
  router.get(
    "/plans",
    authenticateToken,
    plansController.getPlans.bind(plansController)
  );
  router.get(
    "/user-plan",
    authenticateToken,
    plansController.getUserPlan.bind(plansController)
  );
  router.get(
    "/plans/history",
    authenticateToken,
    plansController.getUserPlanHistory.bind(plansController)
  );

  //payment
  const paymentService = new PaymentService(plansRepository);
  const paymentController = new PaymentController(paymentService, plansService);
  router.post(
    "/payments/create",
    authenticateToken,
    paymentController.createPayment.bind(paymentController)
  );
  router.get(
    "/payments/execute",
    paymentController.executePayment.bind(paymentController)
  );

  //call detailss
  router.get(
    "/call/details",
    authenticateToken,
    directCallController.getCallDetails.bind(directCallController)
  );

  //post
  const postRepository = new PostRepository();
  const cloudinaryService = new CloudinaryService();
  const postService = new PostService(postRepository);
  const postController = new PostController(postService, cloudinaryService);
  router.post(
    "/posts",
    authenticateToken,
    [
      body("content").optional().isString().trim().isLength({ max: 1000 }),
      body("mediaUrl").optional().isString(),
      body("mediaType").optional().isIn(["text", "image", "video"]),
    ],
    postController.createPost.bind(postController)
  );
  router.delete(
    "/post/:postId",
    authenticateToken,
    postController.deletePost.bind(postController)
  );
  router.get(
    "/post/signature",
    authenticateToken,
    postController.getCloudinarySignature.bind(postController)
  );
  router.get(
    "/my-posts",
    authenticateToken,
    postController.getMyPosts.bind(postController)
  );
  router.put(
    "/posts/:postId",
    authenticateToken,
    [body("content").notEmpty().isString().trim().isLength({ max: 1000 })],
    postController.editPost.bind(postController)
  );
  router.get(
    "/posts/user",
    authenticateToken,
    postController.getUserDetails.bind(postController)
  );
  router.get(
    "/feed",
    authenticateToken,
    [
      query("page").optional().isInt({ min: 1 }),
      query("limit").optional().isInt({ min: 1, max: 50 }),
    ],
    postController.getFeed.bind(postController)
  );
  router.post(
    "/posts/:postId/like",
    authenticateToken,
    postController.likePost.bind(postController)
  );
  router.post(
    "/posts/:postId/dislike",
    authenticateToken,
    postController.dislikePost.bind(postController)
  );
  router.post(
    "/posts/:postId/comments",
    authenticateToken,
    [body("content").notEmpty().isString().trim().isLength({ max: 1000 })],
    postController.commentOnPost.bind(postController)
  );
  router.get(
    "/posts/:postId/comments",
    authenticateToken,
    postController.getPostComments.bind(postController)
  );
  router.get(
    "/posts/:postId",
    authenticateToken,
    postController.getPostById.bind(postController)
  );

  router.get(
    "/:postId/likers",
    authenticateToken,
    postController.getPostLikers.bind(postController)
  );

  router.post(
    "/subscriptions",
    authenticateToken,
    subscriptionController.saveSubscription.bind(subscriptionController)
  );
  return router;
};
