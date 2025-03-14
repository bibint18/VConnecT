import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import conneectDB from "./config/db"
import authRoutes from "./routes/authRoutes"
import { errorHandler } from "./middlewares/globalErrorHandler"
dotenv.config();
const app = express()

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
}));
app.use(express.json())
app.use("/api/auth",authRoutes)
// app.use("/api/user",adminRoutes)
app.use(errorHandler)
conneectDB()
export default app