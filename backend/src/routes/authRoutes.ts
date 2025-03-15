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
import { getProfile } from '../controllers/ProfileController'
import { authenticateToken,restrictToAdmin} from '../middlewares/authMiddleware'
import verifyRecaptcha from '../middlewares/recaptchaMiddleware'

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



export default router