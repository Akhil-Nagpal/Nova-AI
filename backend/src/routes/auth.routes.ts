import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout");

router.post("/refresh-token");

export default router;
