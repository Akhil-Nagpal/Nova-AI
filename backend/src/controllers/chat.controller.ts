import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  deleteConversationService,
  getConversationsService,
  getGeminiChatService,
  getSingleConversationService,
} from "../services/chat.service";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

// get all conversations
export const getConversations = asyncHandler(
  async (req: Request, res: Response) => {
    // check if user exists or not
    if (!req.user) {
      throw new ApiError(401, "Unauthorized request!");
    }
    // get the user
    const userId = req.user._id;
    // call the service
    const conversations = await getConversationsService(userId.toString());
    // give back the response to the client
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "All conversations fetched successfully!",
          conversations,
        ),
      );
  },
);

// get single conversation
export const getSingleConversation = asyncHandler(
  async (req: Request, res: Response) => {
    // check if the user exists or not
    if (!req.user) {
      throw new ApiError(401, "Unauthorized request!");
    }
    // get the user id
    const userId = req.user._id;
    // get the conversation id from params
    const { conversationId } = req.params;
    // check if the conversation exists or not
    if (!conversationId) {
      throw new ApiError(400, "Conversation id is required");
    }
    // call the service
    const singleConversation = await getSingleConversationService(
      userId.toString(),
      conversationId.toString(),
    );
    // give back the response to the client
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Single conversation fetched successful!",
          singleConversation,
        ),
      );
  },
);

// generate chat
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

// delete the single conversation
export const deleteConversation = asyncHandler(
  async (req: Request, res: Response) => {
    // check if the user exists or not
    if (!req.user) {
      throw new ApiError(401, "Unauthorized request");
    }
    // get the user
    const userId = req.user._id;
    // get the conversation
    const { conversationId } = req.params;
    // check if conversation id exists or not
    if (!conversationId) {
      throw new ApiError(400, "Conversation ID is required");
    }
    // call the service
    await deleteConversationService(
      userId.toString(),
      conversationId?.toString(),
    );
    // give the response back to client
    res
      .status(200)
      .json(new ApiResponse(200, "Conversation deleted successfully!", null));
  },
);
