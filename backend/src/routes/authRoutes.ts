import express from 'express'
import { signup,verifyOTP ,ResendOtp,login,refresh,LoginAdmin,adminLogout} from '../controllers/AuthController'
import verifyRecaptcha from '../middlewares/recaptchaMiddleware'

const router = express.Router()
router.post("/signup",signup)
router.post("/verify-otp",verifyOTP)
router.post('/resend-otp',ResendOtp)
router.post('/login',verifyRecaptcha,login)
router.post('/refresh',refresh)
router.post("/adminLogin",LoginAdmin)
router.post('/adminLogout',adminLogout)
export default router