import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getGeminiChatService } from "../services/chat.service";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

export const getGeminiChat = asyncHandler(
  async (req: Request, res: Response) => {
    // check if the user exists or not
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Request!");
    }
    // get the conversation Id and message from user
    const { conversationId, message } = req.body;
    // get the user Id
    const userId = req.user._id;

    // check if both exists or not, if not throw error
    if (!message) {
      throw new ApiError(400, "Content is required");
    }
    // call the service
    const geminiResponse = await getGeminiChatService(
      userId.toString(),
      conversationId,
      message,
    );
    // give back the response to the client
    res
      .status(200)
      .json(new ApiResponse(200, "Chat fetched successfully", geminiResponse));
  },
);
