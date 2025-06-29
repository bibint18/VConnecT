import express from "express";
import { createServer } from "http";
import { Namespace, Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import conneectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoute.js";
// import userRoutes from './routes/userRoute'
import { createUserRoutes } from "./routes/userRoute.js";
import { errorHandler } from "./middlewares/globalErrorHandler.js";
import { CallService } from "./services/CallService.js";
import { CallRepository } from "./repositories/CallRepository.js";
import cookieParser from "cookie-parser";
import { FriendService } from "./services/FriendService.js";
import { FriendRepository } from "./repositories/FriendRepository.js";
import { DirectCallRepository } from "./repositories/User/call/DirectCallRepository.js";
import { DirectCallController } from "./controllers/User/Call/DirectCallController.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
export const chatIo: Namespace = io.of("/chat");
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

io.on("connection", (socket) => {
  console.log(
    "Root connection:",
    socket.id,
    "Namespaces:",
    Object.keys(io._nsps)
  );
});
chatIo.on("connection", (socket) => {
  console.log(
    "Chat connection:",
    socket.id,
    "Namespaces:",
    Object.keys(io._nsps)
  );
});
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/auth", publicRoutes);

const directCallRepository = new DirectCallRepository();
const directCallController = new DirectCallController(directCallRepository);
export const callService = new CallService(
  new CallRepository(),
  directCallRepository,
  io
);
export const friendService = new FriendService(new FriendRepository(), io);
app.use("/api/auth", createUserRoutes(chatIo, directCallController));
app.use(errorHandler);

conneectDB();
export default httpServer;
