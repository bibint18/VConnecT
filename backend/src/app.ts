import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from 'cors'
import dotenv from 'dotenv'
import conneectDB from "./config/db"
import authRoutes from "./routes/authRoutes"
import publicRoutes from './routes/publicRoute'
import userRoutes from './routes/userRoute'
import { errorHandler } from "./middlewares/globalErrorHandler"
import { CallService } from "./services/CallService"
import { CallRepository } from "./repositories/CallRepository"
import cookieParser from "cookie-parser"
import { FriendService } from "./services/FriendService"
import { FriendRepository } from "./repositories/FriendRepository"
import { authenticateToken,restrictToAdmin } from "./middlewares/authMiddleware"
import { AdminDailyTriviaService } from "./services/AdminDailyTriviaService"
import { AdminDailyTriviaReposiroy } from "./repositories/AdminDailyTriviaRepository"
dotenv.config();
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer,{
  cors:{
    origin:'http://localhost:5173',
    methods:["GET","POST"],
    credentials:true
  }
})
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
}));
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.use('/api/auth',publicRoutes)
app.use("/api/auth",userRoutes)
app.use(errorHandler)
const callService = new CallService(new CallRepository(),io)
const friendService = new FriendService(new FriendRepository(),io)

conneectDB()
export default httpServer