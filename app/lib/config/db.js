import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    return connection;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

export default connectToDatabase;
