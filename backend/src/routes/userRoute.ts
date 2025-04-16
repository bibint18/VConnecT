import express from 'express'
import { authenticateToken } from '../middlewares/authMiddleware'
import ProfileController from '../controllers/ProfileController'
import RoomController from '../controllers/RoomController'
import { FriendController } from '../controllers/FriendController'
import { FriendRepository } from '../repositories/FriendRepository'
import { DailyTriviaRepository } from '../repositories/DailyTriviaRepository'
import { DailyTriviaService } from '../services/DailyTriviaService'
import { DailyTriviaController } from '../controllers/DailyTriviaController'
import { auth } from 'google-auth-library'
import { UserFriendRespository } from '../repositories/UserFriendRepository'
import { UserFriendService } from '../services/UserFriendService'
import { UserFriendController } from '../controllers/UserFriendController'
import { ChatRepository } from '../repositories/User/Chat/ChatRepository'
import { ChatService } from '../services/User/Chat/IChatServices'
import { ChatController } from '../controllers/Admin/Chat/ChatController'
import { Namespace } from 'socket.io'
import { FriendCallRepository } from '../repositories/User/call/FriendCallRepository'

export const createUserRoutes = (chatIo:Namespace) => {
const router = express.Router()

//profile
router.get('/user/profile',authenticateToken,ProfileController.getProfile.bind(ProfileController))
router.put('/user/profile/edit',authenticateToken,ProfileController.updateProfile.bind(ProfileController))
router.get('/user/profile/signature',authenticateToken,ProfileController.getCloudinarySignature.bind(ProfileController))
router.post('/user/profile/image',authenticateToken,ProfileController.updateProfileImage.bind(ProfileController))
router.post('/user/profile/streak',authenticateToken,ProfileController.updateStreak.bind(ProfileController))


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

// chatIo.on("connection", (socket) => {
//   console.log("New chat connection:", socket.id, "Namespaces:", Object.keys(socket.nsp.server._nsps));
//   chatService.handleSocketEvents(socket);

//   socket.on("join-chat", ({ userId }, callback) => {
//     console.log(`${userId} joined chat room with socket ${socket.id}`);
//     socket.join(userId); // Join user-specific room
//     if (callback) callback({ status: "success", userId });
//   });

//   socket.on("disconnect", (reason) => {
//     console.log("Chat client disconnected:", socket.id, "Reason:", reason);
//   });
// });
router.post('/chat/send',authenticateToken,chatController.sendMessage.bind(chatController))
router.get('/chat/history',authenticateToken,chatController.getChatHistory.bind(chatController))
// export default router
return router

}