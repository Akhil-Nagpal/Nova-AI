import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUser);

router.post("/login");

router.post("/logout");

router.post("/refresh-token");

export default router;
