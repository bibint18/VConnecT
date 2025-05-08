"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatIo = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db.js"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes.js"));
const publicRoute_1 = __importDefault(require("./routes/publicRoute.js"));
// import userRoutes from './routes/userRoute'
const userRoute_1 = require("./routes/userRoute.js");
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler.js");
const CallService_1 = require("./services/CallService.js");
const CallRepository_1 = require("./repositories/CallRepository.js");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const FriendService_1 = require("./services/FriendService.js");
const FriendRepository_1 = require("./repositories/FriendRepository.js");
const DirectCallRepository_1 = require("./repositories/User/call/DirectCallRepository.js");
const DirectCallController_1 = require("./controllers/User/Call/DirectCallController.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true
    }
});
console.log("Root IO initialized:", io.path());
// export const chatIo =new Server(httpServer,{
//   path:'/socket.io/chat',
//   cors:{
//     origin:'http://localhost:5173',
//     methods:["GET","POST"],
//     credentials:true
//   }
// })
exports.chatIo = io.of('/chat');
console.log("Chat IO initialized:", exports.chatIo.name);
// console.log("from app.ts chatIo initialized in app.ts:", chatIo ? "present" : "undefined");
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
io.on("connection", (socket) => {
    console.log("Root connection:", socket.id, "Namespaces:", Object.keys(io._nsps));
});
exports.chatIo.on("connection", (socket) => {
    console.log("Chat connection:", socket.id, "Namespaces:", Object.keys(io._nsps));
});
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", authRoutes_1.default);
app.use('/api/auth', publicRoute_1.default);
const directCallRepository = new DirectCallRepository_1.DirectCallRepository();
const directCallController = new DirectCallController_1.DirectCallController(directCallRepository);
const callService = new CallService_1.CallService(new CallRepository_1.CallRepository(), directCallRepository, io);
const friendService = new FriendService_1.FriendService(new FriendRepository_1.FriendRepository(), io);
app.use("/api/auth", (0, userRoute_1.createUserRoutes)(exports.chatIo, directCallController));
app.use(globalErrorHandler_1.errorHandler);
(0, db_1.default)();
exports.default = httpServer;
