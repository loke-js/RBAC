import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
      max: 5,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    lastLoginAttempt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", UserSchema);
