import express from "express";
import type { Request, Response } from "express";
type NextFunction = (err?: any) => void;
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import vytapRoutes from "./routes/vytap";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ---------- Middleware ----------
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
app.use("/api/vytap", vytapRoutes);

// ---------- Health Check ----------
app.get("/", (req: Request, res: any) => {
  res.json({ message: "Inflamm AI API is running!", timestamp: new Date().toISOString() });
});

// ---------- Error Handler ----------
app.use((err: Error, req: Request, res: any, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});