import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const singleConversationSchema = z.object({
  params: z.object({
    conversationId: z.string().refine((val) => isValidObjectId(val), {
      message: "Invalid conversation ID format",
    }),
  }),
});

export const chatMessageSchema = z.object({
  body: z.object({
    message: z
      .string()
      .min(1, "Message cannot be empty")
      .max(2000, "Message must not exceed 2000 characters"),
    conversationId: z
      .string()
      .refine((val) => isValidObjectId(val), {
        message: "Invalid conversation ID format",
      })
      .optional(),
  }),
});
