import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";

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
export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
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

// Adding password hashing using bcrypt
userSchema.pre("save", async function () {
  // check if the password modified or not, if not then dont hash
  if (!this.isModified("password")) return;
  // if the password is modified then hash the password
  this.password = await bcrypt.hash(this.password, 10);
});

// function for comparing the password, when changing
userSchema.methods.comparePassword = async function (password: string) {
  // compare the new password with saved one
  return await bcrypt.compare(password, this.password);
};

// adding method for generating access token
userSchema.methods.generateAccessToken = function () {
  const payload = { _id: this._id };
  const secretKey = Bun.env.ACCESS_TOKEN_SECRET!;
  const options: SignOptions = {
    expiresIn: Number(Bun.env.ACCESS_TOKEN_EXPIRY),
  };
  return jwt.sign(payload, secretKey, options);
};

// adding method for generating refresh token
userSchema.methods.generateRefreshToken = function () {
  const payload = { _id: this._id };
  const secretKey = Bun.env.REFRESH_TOKEN_SECRET!;
  const options: SignOptions = {
    expiresIn: Number(Bun.env.REFRESH_TOKEN_EXPIRY),
  };
  return jwt.sign(payload, secretKey, options);
};

export const User = mongoose.model<IUser, UserModel>("User", userSchema);
