import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import vytapRoutes from "../routes/vytap";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ---------- Middleware ----------
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Health Check ----------
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ---------- API Routes ----------
app.use("/api/v1/vytap", vytapRoutes);

// ---------- 404 Handler ----------
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// ---------- Error Handler ----------
app.use(
  (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Response => {
    console.error("Server error:", err);

    const message =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err instanceof Error
        ? err.message
        : String(err);

    return res.status(500).json({
      success: false,
      error: message,
    });
  }
);

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  );
});

export default app;
