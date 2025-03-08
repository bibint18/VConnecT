import express from 'express'
import { signup,verifyOTP ,ResendOtp,login,refresh,LoginAdmin,adminLogout} from '../controllers/AuthController'
import { getAllUsers,blockUser,unblockUser,deleteUser } from '../controllers/AdminUsersController'
import verifyRecaptcha from '../middlewares/recaptchaMiddleware'

const router = express.Router()
router.post("/signup",signup)
router.post("/verify-otp",verifyOTP)
router.post('/resend-otp',ResendOtp)
router.post('/login',verifyRecaptcha,login)
router.post('/refresh',refresh)
router.post("/adminLogin",LoginAdmin)
router.post('/adminLogout',adminLogout)



//adminUser MAnagement
router.get('/admin/users',getAllUsers)
router.post('/admin/users/block/:id',blockUser)
router.post('/admin/users/unblock/:id',unblockUser)
router.post('/admin/users/delete/:id',deleteUser)
export default router