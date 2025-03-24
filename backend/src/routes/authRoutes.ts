import express from 'express'
import 
{ signup,
  verifyOTP ,
  ResendOtp,
  login,
  refresh,
  LoginAdmin,
  adminLogout,
  userLogout,
  getAbout,
  googleLogin
} 
from '../controllers/AuthController'
import {
   getAllUsers,blockUser,unblockUser,deleteUser 
  }
from '../controllers/AdminUsersController'
import {
   createPlan ,
   getAllPlans,
   getPlanById,
   updatePlan,
   deletePlan
  }
from '../controllers/AdminPlansController'
import { getProfile,updateProfile,getCloudinarySignature,updateProfileImage ,updateStreak} from '../controllers/ProfileController'
import RoomController from '../controllers/RoomController'
import { authenticateToken,restrictToAdmin} from '../middlewares/authMiddleware'
import verifyRecaptcha from '../middlewares/recaptchaMiddleware'
import { FriendController } from '../controllers/FriendController'
import { FriendRepository } from '../repositories/FriendRepository'
const router = express.Router()
router.post("/signup",signup)
router.post("/verify-otp",verifyOTP)
router.post('/resend-otp',ResendOtp)
router.post('/login',verifyRecaptcha,login)
router.post('/refresh',refresh)
router.post("/adminLogin",LoginAdmin)
router.post('/adminLogout',adminLogout)
router.post('logout',userLogout)
router.post('/google-login',googleLogin)

//adminUser MAnagement
router.get('/admin/users',authenticateToken,restrictToAdmin,getAllUsers )
router.post('/admin/users/block/:id',blockUser)
router.post('/admin/users/unblock/:id',unblockUser)
router.post('/admin/users/delete/:id',deleteUser)

//admin plans management
router.post('/admin/plans/add',createPlan)
router.get('/admin/plans',getAllPlans)
router.get('/admin/plans/:id',getPlanById)
router.put('/admin/plans/edit/:id',updatePlan)
router.post('/admin/plans/delete/:id',deletePlan)

router.get('/user/about',authenticateToken,getAbout)


//user Profile
router.get('/user/profile',authenticateToken,getProfile)
router.put('/user/profile/edit',authenticateToken,updateProfile)
router.get('/user/profile/signature',authenticateToken,getCloudinarySignature)
router.post('/user/profile/image',authenticateToken,updateProfileImage)
router.post('/user/profile/streak',authenticateToken,updateStreak)

//ROOMs

router.post('/user/room/create',authenticateToken,RoomController.createRoom.bind(RoomController))
router.get('/user/rooms',authenticateToken,RoomController.getAllRooms.bind(RoomController))
router.post('/user/room/join',authenticateToken,RoomController.joinRoom.bind(RoomController))



//friends
const friendRepository = new FriendRepository();
const friendController = new FriendController(friendRepository);
router.get('/user/friend/requests',authenticateToken,friendController.getPendingRequests)

export default router