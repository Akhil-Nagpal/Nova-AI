import type { Request, Response } from "express";
import { asyncHandler } from "../utils/aysynchandler";
import {
  loginUserService,
  logoutUserService,
  registerUserService,
  tokenRotationService,
} from "../services/auth.service";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

// Note: validation are handling by zod

const isProduction = Bun.env.NODE_ENV === "production";

const accessTokenCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: isProduction,
  maxAge: Number(Bun.env.ACCESS_TOKEN_MAX_AGE),
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: isProduction,
  maxAge: Number(Bun.env.REFRESH_TOKEN_MAX_AGE),
};

// Register User
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    // get the data from user in req.body
    const { fullName, email, password } = req.body;

    // call the service
    const user = await registerUserService({ fullName, email, password });
    // give back the response to the client
    res
      .status(201)
      .json(new ApiResponse(201, "User Registered Succussfully!", user));
  },
);

// User Login
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  // get the credentials from user
  const { email, password } = req.body;
  // call the service
  const { user, accessToken, refreshToken } = await loginUserService({
    email,
    password,
  });
  // give back the reposne to the client
  res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(new ApiResponse(200, "Login Successfull", user));
});

// User Logout
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  // check if the user exists or not
  if (!req.user) {
    throw new ApiError(401, "Unauthorized request!");
  }
  // get the userid
  const userId = req.user._id;
  // call the service
  await logoutUserService(userId.toString());
  // give back the response to the client
  res
    .status(200)
    .clearCookie("accessToken", accessTokenCookieOptions)
    .clearCookie("refreshToken", refreshTokenCookieOptions)
    .json(new ApiResponse(200, "Logout successfull", null));
});

// Refresh Token Rotation
export const tokenRotation = asyncHandler(
  async (req: Request, res: Response) => {
    // get the refresh token from cookies
    const incomingToken = req.cookies?.refreshToken;
    // check if it exists or not
    if (!incomingToken) {
      throw new ApiError(401, "Refresh Token does not exist!");
    }
    // call the service
    const { accessToken, refreshToken } =
      await tokenRotationService(incomingToken);
    // give back the reposne to the client
    res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenCookieOptions)
      .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
      .json(new ApiResponse(200, "Refresh token roatated!", null));
  },
);
