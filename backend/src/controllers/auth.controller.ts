import type { Request, Response } from "express";
import { asyncHandler } from "../utils/aysynchandler";
import {
  loginUserService,
  registerUserService,
} from "../services/auth.service";
import { ApiResponse } from "../utils/apiResponse";

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
  samSite: "strict" as const,
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
      .json(new ApiResponse(200, "User Registered Succussfully!", user));
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
    .json(new ApiResponse(200, "Login Successfull", user))
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
});
