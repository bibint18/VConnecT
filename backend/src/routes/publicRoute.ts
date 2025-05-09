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
router.get('/HomeData',HomeData)
export default router