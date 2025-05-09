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
import { DirectCallRepository } from "./repositories/User/call/DirectCallRepository"
import { DirectCallController } from "./controllers/User/Call/DirectCallController"

dotenv.config();
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer,{
  cors:{
    origin:process.env.FRONTEND_URL,
    methods:["GET","POST"],
    credentials:true
  }
})
console.log("Root IO initialized:", io.path());

// export const chatIo =new Server(httpServer,{
//   path:'/socket.io/chat',
//   cors:{
//     origin:'http://localhost:5173',
//     methods:["GET","POST"],
//     credentials:true
//   }
// })

export const chatIo:Namespace = io.of('/chat')
console.log("Chat IO initialized:", chatIo.name);
// console.log("from app.ts chatIo initialized in app.ts:", chatIo ? "present" : "undefined");
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true, 
}));

io.on("connection", (socket) => {
  console.log("Root connection:", socket.id, "Namespaces:", Object.keys(io._nsps));
});
chatIo.on("connection", (socket) => {
  console.log("Chat connection:", socket.id, "Namespaces:", Object.keys(io._nsps));
});
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.json({message:'vconnect backend running...'});
});

app.use("/api/auth",authRoutes)
app.use('/api/auth',publicRoutes)

const directCallRepository=new DirectCallRepository()
const directCallController = new DirectCallController(directCallRepository)
export const callService = new CallService(new CallRepository(),directCallRepository,io)
export const friendService = new FriendService(new FriendRepository(),io)
app.use("/api/auth",createUserRoutes(chatIo,directCallController))
app.use(errorHandler)

conneectDB()
export default httpServer