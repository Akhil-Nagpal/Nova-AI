import type { Request, Response } from "express";
import { asyncHandler } from "../utils/aysynchandler";
import { registerUserService } from "../services/auth.service";
import { ApiResponse } from "../utils/apiResponse";

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
  // Note: validation are handling by zod
);
