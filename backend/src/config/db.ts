import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()


const conneectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI as string; // Type assertion to avoid TS error
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in .env file");
    }
    await mongoose.connect(mongoUri)
    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed", error);
    process.exit(1)
  }
}

export default conneectDB