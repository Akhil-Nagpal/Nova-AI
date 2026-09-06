import { z } from "zod";

export const chatMessageSchema = z.object({
  body: z.object({
    message: z
      .string()
      .min(1, "Message cannot be empty")
      .max(2000, "Message must not exceed 2000 characters"),
    conversationId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid conversation ID format")
      .optional(),
  }),
});
