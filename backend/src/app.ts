import express from "express"
import { createServer } from "http"
import { Namespace, Server } from "socket.io"
import cors from 'cors'
import dotenv from 'dotenv'
import conneectDB from "./config/db"
import authRoutes from "./routes/authRoutes"
import publicRoutes from './routes/publicRoute'
// import userRoutes from './routes/userRoute'
import { createUserRoutes } from "./routes/userRoute"
import { errorHandler } from "./middlewares/globalErrorHandler"
import { CallService } from "./services/CallService"
import { CallRepository } from "./repositories/CallRepository"
import cookieParser from "cookie-parser"
import { FriendService } from "./services/FriendService"
import { FriendRepository } from "./repositories/FriendRepository"

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

// export const chatIo =new Server(httpServer,{
//   path:'/socket.io/chat',
//   cors:{
//     origin:'http://localhost:5173',
//     methods:["GET","POST"],
//     credentials:true
//   }
// })

export const chatIo:Namespace = io.of('/chat')
console.log("from app.ts chatIo initialized in app.ts:", chatIo ? "present" : "undefined");
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
}));
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.use('/api/auth',publicRoutes)
app.use("/api/auth",createUserRoutes(chatIo))
app.use(errorHandler)
const callService = new CallService(new CallRepository(),io)
const friendService = new FriendService(new FriendRepository(),io)


//make changes here

conneectDB()
export default httpServer