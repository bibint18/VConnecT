import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()


const conneectDB = async () => {
  try {
    await mongoose.connect(ProcessingInstruction.env.MONGO_URI)
    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed", error);
    process.exit(1)
  }
}

export default conneectDB