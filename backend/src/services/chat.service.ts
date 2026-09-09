import { gemini } from "../config/gemini.";
import { GEMINI_MODELS } from "../config/models";
import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";
import { getSystemPrompt } from "../prompts/prompt.router";
import { ApiError } from "../utils/apiError";

// get all conversations service
export const getConversationsService = async (userId: string) => {
  // find the conversations and select the required fields
  const conversations = await Conversation.find({ user: userId })
    .select("-id title updatedAt")
    .sort({ updatedAt: -1 });
  // return the conversations
  return conversations;
};

export const getGeminiChatService = async (
  userId: string,
  conversationId: string | undefined,
  message: string,
) => {
  // STEP 1: Get or create the conversation
  let conversation;

  if (conversationId) {
    conversation = await Conversation.findOne({
      _id: conversationId,
      user: userId,
    });

    // check if the there is no conversation exists then throw an error
    if (!conversation) {
      throw new ApiError(404, "Conversation Not Found!");
    }
  } else {
    // if there is no conversation id passed then create a new conversation
    conversation = await Conversation.create({ user: userId });
  }

  // STEP 2: Retrieve the chat history from conversation and get the latest first
  const previousMessages = await Message.find({
    conversation: conversation._id,
  }).sort({ createdAt: 1 });

  // Step 3: create the user message
  const userMessage = await Message.create({
    conversation: conversation._id,
    role: "user",
    content: message,
  });

  // Step 4: combine the new message with previous history for GEMINI
  const history = [...previousMessages, userMessage];

  // STEP 5:
  // Convert our internal Message format into Gemini's expected format.
  const contents = history.map((msg) => ({
    role: msg.role,
    parts: [
      {
        text: msg.content,
      },
    ],
  }));

  // STEP 6:
  // Build a dynamic system prompt.
  // The router includes only the prompts relevant to the user's message,
  // reducing prompt size compared to sending every prompt every time.

  const systemPrompt = getSystemPrompt(message);

  // Step 7 - Send the conversation and system prompt to Gemini
  let lastError: unknown;

  // loopt through the Gemini Models
  for (let model of GEMINI_MODELS) {
    try {
      // call the gemini service
      const response = await gemini.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: systemPrompt,
          httpOptions: {
            timeout: 30000,
            retryOptions: {
              attempts: 2,
            },
          },
        },
      });

      // extract the response text from response
      const reply = response.text ?? "";

      // get the model message and save it to mongo
      await Message.create({
        role: "model",
        conversation: conversation._id,
        content: reply,
      });

      // return the conversation id and reply
      return {
        conversationId: conversation._id,
        reply,
      };
    } catch (error: any) {
      console.error("========== GEMINI ERROR ==========");
      console.error(error);
      console.error("Name:", error?.name);
      console.error("Message:", error?.message);
      console.error("Status:", error?.status);
      console.error("Stack:", error?.stack);
      console.error("==================================");
      // check if the any error comes then update the error
      lastError = error;

      // get the status from the error
      const status = error.status;

      // check if the error status is 429 from server then daily token limit is used
      if (status === 429) {
        throw {
          status: 429,
          message: "Daily Tokem limit has been used. Please try again later!",
        };
      }

      // check if the error status is from server side then try different model
      if ([500, 502, 503, 504].includes(status)) {
        console.log("Trying next fallback model");
        continue;
      }

      throw error;
    }
  }
  // if all models failed to responsed then return the error
  if (lastError) {
    throw lastError;
  } else {
    throw {
      status: 503,
      message: "Nova is temporarily unavailable. Please try again later!",
    };
  }
};
