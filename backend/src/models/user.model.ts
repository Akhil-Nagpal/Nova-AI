import mongoose from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  avatar: string;
  isEmailVerified: boolean;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

// Indexes
userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>("User", userSchema);
