import mongoose from "mongoose";

export const connectToDb = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    mongoose.set("bufferCommands", false);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`Connected to MongoDB`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw error;
  }

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });
};
