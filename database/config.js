import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Database connection failed");
  }
};

export { dbConnection };
