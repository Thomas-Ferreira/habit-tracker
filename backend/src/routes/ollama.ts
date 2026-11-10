import express, { Request, Response, Router } from "express";
import { getOllamaResponse } from "../services/llm/ollma";

const router: Router = express.Router();

// POST /api/ollama with { "prompt": "..." }
router.post("/", async (req: Request, res: Response) => {
  const { prompt } = req.body ?? {};

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return res.status(400).json({ error: "prompt must be a non-empty string" });
  }

  try {
    const response = await getOllamaResponse(prompt.trim());
    return res.json({ response });
  } catch (error) {
    console.error("Ollama request failed:", error);
    return res.status(502).json({ error: "Unable to get a response from Ollama" });
  }
});

export default router;
