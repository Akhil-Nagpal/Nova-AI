import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/aysynchandler";
import { ApiError } from "../utils/apiError";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the token from cookies
    const token = req.cookies?.accessToken;
    // check if the token exists or not
    if (!token) {
      throw new ApiError(401, "Token required");
    }
    try {
      // verify the token, does that meatch
      const verifyToken = jwt.verify(token, Bun.env.ACCESS_TOKEN_SECRET!) as {
        _id: string;
      };
      // find the user by id
      const user = await User.findById(verifyToken._id);
      // check user exists or not
      if (!user) {
        throw new ApiError(401, "User does not exists!");
      }
      // set the user in request
      req.user = user;
      // move to next
      next();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, "Invalide or expire token");
    }
  },
);
