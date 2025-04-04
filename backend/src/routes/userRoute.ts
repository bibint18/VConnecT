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


export default router