import express from 'express'
import { signup,verifyOTP } from '../controllers/AuthController'

const router = express.Router()
router.post("/signup",signup)
router.post("/verify-otp",verifyOTP)
export default router