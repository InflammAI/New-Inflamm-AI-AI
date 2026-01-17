// src/routes/flammy.ts

import { Router } from "express";
import { isAllowedHealthTopic } from "../utils/isAllowedHealthTopic";
import { generateHealthExplanation } from "../services/flammyExplainer";

const router = Router();

router.post("/explain", async (req, res) => {
  const { question } = req.body;

  if (!isAllowedHealthTopic(question)) {
    return res.status(400).json({
      error:
        "Flammy only explains inflammation, wellness, and general health topics.",
    });
  }

  const explanation = await generateHealthExplanation(question);

  res.json({
    assistant: "Flammy",
    disclaimer:
      "Educational information only. Not medical advice.",
    ...explanation,
  });
});

export default router;
