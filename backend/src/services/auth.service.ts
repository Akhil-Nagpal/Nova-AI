import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import jwt from "jsonwebtoken";

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

// Register User Servbice
export const registerUserService = async ({
  // get the data from controller
  fullName,
  email,
  password,
}: RegisterPayload) => {
  // check if the user already exists or not
  const existingUser = await User.findOne({ email: email });
  // if user exists throw error
  if (existingUser) {
    throw new ApiError(409, "User with email already exists");
  }
  // create the user document in mongo
  const user = await User.create({
    fullName,
    email,
    password,
  });
  // return the response
  return user;
};

// Login User Service
export const loginUserService = async ({ email, password }: LoginPayload) => {
  // find the user
  const existingUser = await User.findOne({ email: email }).select("+password");
  // check if the user exists, if not throw error
  if (!existingUser) {
    throw new ApiError(404, "User not found!");
  }
  // if yes then check the password is same as in DB
  const isPasswordValid = await existingUser.comparePassword(password);
  //   check if password exists or not
  if (!isPasswordValid) {
    throw new ApiError(401, "Wrong Password!");
  }
  // generate the tokens
  const accessToken = existingUser.generateAccessToken();
  const refreshToken = existingUser.generateRefreshToken();
  // update the refresh token feild with new one
  existingUser.refreshToken = refreshToken;
  // save the user
  await existingUser.save({ validateBeforeSave: false });
  //   convert the existing user doc to oibject and delete the sensitive info
  const {
    password: _password,
    refreshToken: _refreshToken,
    ...safeUser
  } = existingUser.toObject();
  // return the user and tokens
  return { user: safeUser, accessToken, refreshToken };
};

// Logout user service
export const logoutUserService = async (userId: string) => {
  // find the user by userId
  const user = await User.findById(userId);
  // check if the user exists or not
  if (!user) {
    throw new ApiError(404, "User not found!");
  }
  // delete the refresh token from user doc
  user.refreshToken = undefined;
  // save the user
  await user.save({ validateBeforeSave: false });
  // return true for compeletion
  return true;
};

// Token Rotation Service
export const tokenRotationService = async (incomingToken: string) => {
  // get the user and verify the token
  const verifyToken = jwt.verify(
    incomingToken,
    Bun.env.REFRESH_TOKEN_SECRET!,
  ) as { _id: string };
  // find the user by id
  const user = await User.findById(verifyToken._id).select("+refreshToken");
  // check if the user exists or not
  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }
  // check if the token is same as saved in DB
  if (incomingToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is reused or expired");
  }
  // if not make the user logout forcefully by deleting the refesh token and save the user
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });
  // generate the new token
  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();
  // set the refresh token and save the user
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });
  // return the tokens
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
