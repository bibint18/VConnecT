import express from "express";
const router = express.Router()
import {LoginAdmin} from '../controllers/AuthController'
router.post("/adminLogin",LoginAdmin)
export default router