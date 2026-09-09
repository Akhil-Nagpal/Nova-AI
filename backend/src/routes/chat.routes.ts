import { Router } from "express";
import {
  getConversations,
  getGeminiChat,
} from "../controllers/chat.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { chatMessageSchema } from "../validation/chat.validation";

const router = Router();

// get conversation in the sidebar
router.get("/conversations", verifyJWT, getConversations);

// chat route
router.post("/chat", verifyJWT, validate(chatMessageSchema), getGeminiChat);

export default router;
