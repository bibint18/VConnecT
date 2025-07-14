import express from 'express'
import verifyRecaptcha from '../middlewares/recaptchaMiddleware.js'
import 
{ signup,
  verifyOTP ,
  ResendOtp,
  login,
  refresh,
  LoginAdmin,
  adminLogout,
  userLogout,
  googleLogin,
  HomeData
} 
from '../controllers/AuthController.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { LoginDTO } from '../dtos/auth/login.dto.js'
import { SignupDTO } from '../dtos/auth/signup.dto.js'
import { VerifyOtpDTO } from '../dtos/auth/verifyOtp.dto.js'

const router = express.Router()
router.post("/signup",validateRequest(SignupDTO),signup)
router.post("/verify-otp",validateRequest(VerifyOtpDTO),verifyOTP)
router.post('/resend-otp',ResendOtp)
router.post('/login',verifyRecaptcha,validateRequest(LoginDTO),login)
router.post('/refresh',refresh)
router.post("/adminLogin",LoginAdmin)
router.post('/adminLogout',adminLogout)
router.post('logout',userLogout)
router.post('/google-login',googleLogin)
router.get('/HomeData',HomeData)
export default router