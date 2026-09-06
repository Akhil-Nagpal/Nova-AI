import { Router } from "express";
import { getGeminiChat } from "../controllers/chat.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

// chat route
router.post("/chat", verifyJWT, getGeminiChat);

export default router;
