import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";

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
    throw new ApiError(404, "User Not Found!");
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
