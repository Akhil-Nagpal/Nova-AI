import { Router } from "express";
import {
  deleteConversation,
  getConversations,
  getGeminiChat,
  getSingleConversation,
} from "../controllers/chat.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  chatMessageSchema,
  singleConversationSchema,
} from "../validation/chat.validation";

const router = Router();

// get conversation in the sidebar
router.get("/conversations", verifyJWT, getConversations);

// get single conversation
router.get(
  "/conversations/:conversationId",
  verifyJWT,
  validate(singleConversationSchema),
  getSingleConversation,
);

// delete the conversation
router.delete("/conversations/:conversationId", verifyJWT, deleteConversation);

// chat route
router.post("/chat", verifyJWT, validate(chatMessageSchema), getGeminiChat);

export default router;
