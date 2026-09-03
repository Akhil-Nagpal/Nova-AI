import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  tokenRotation,
} from "../controllers/auth.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", verifyJWT, logoutUser);

router.post("/refresh-token", tokenRotation);

export default router;
