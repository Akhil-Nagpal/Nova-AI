import { Router } from "express";
import { getGeminiChat } from "../controllers/chat.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { chatMessageSchema } from "../validation/chat.validation";

const router = Router();

// chat route
router.post("/chat", verifyJWT, validate(chatMessageSchema), getGeminiChat);

export default router;
