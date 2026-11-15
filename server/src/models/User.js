import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isDemo: {
    type: Boolean,
    default: false,
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

export default mongoose.model("User", userModel);
