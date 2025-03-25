import express from 'express'
import { authenticateToken } from '../middlewares/authMiddleware'
import ProfileController from '../controllers/ProfileController'
import RoomController from '../controllers/RoomController'
import { FriendController } from '../controllers/FriendController'
import { FriendRepository } from '../repositories/FriendRepository'


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

export default router