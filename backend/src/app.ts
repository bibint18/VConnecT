import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import conneectDB from "./config/db"
import authRoutes from "./routes/authRoutes"
dotenv.config();
const app = express()

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
}));
app.use(express.json())
app.use("/api/auth",authRoutes)
// app.use("/api/user",adminRoutes)
conneectDB()
export default app