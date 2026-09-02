import express, { type Request, type Response } from "express";
import chatRoutes from "./routes/chat.routes";
import authRoutes from "./routes/auth.routes";
import { corsOption } from "./config/cors.config";
import cors from "cors";
import { globalErrorHnadler } from "./middleware/globalError.middleware";
import cookieParser from "cookie-parser";

export const app = express();

// middleware for express json limit
app.use(express.json({ limit: "16kb" }));

app.use(cors(corsOption));

// middleware for Url Encoding - example - this change the link in the browser like akhil+nagpal or akhil%20nagpal
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running 🚀");
});

// Routes
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/", chatRoutes);

// Global error middleware
app.use(globalErrorHnadler);
