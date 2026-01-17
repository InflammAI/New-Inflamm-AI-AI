import express from "express";
import type { Request, Response } from "express";
import type { Server as HTTPServer } from "http";
import { createServer } from "http";
type NextFunction = (err?: any) => void;
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import vytapRoutes from "./routes/vytap";
import vytalSyncRoutes from "./routes/vytal-sync";
import { errorHandler } from "./middleware/error-handling";

dotenv.config();

const app = express();
const server: HTTPServer = createServer(app);
const PORT = process.env.PORT || 3001;

// Check for JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is required for real-time tracking');
  process.exit(1);
}

// ---------- Middleware ----------
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
app.use("/api/vytap", vytapRoutes);
app.use("/api/vytal-sync", vytalSyncRoutes);

// Test endpoint
app.get("/api/vytal-sync/server-public-key", (req: Request, res: any) => {
  res.json({ 
    success: true,
    data: { publicKey: "test-public-key-base64" },
    timestamp: Date.now()
  });
});

// ---------- Health Check ----------
app.get("/", (req: Request, res: any) => {
  res.json({ message: "Inflamm AI API is running!", timestamp: new Date().toISOString() });
});

// ---------- Error Handler ----------
app.use(errorHandler);

// ---------- Start Server ----------
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});