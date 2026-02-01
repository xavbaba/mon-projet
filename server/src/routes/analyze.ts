import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { analyzeObjectImage } from "../services/openai";
import { addToHistory } from "./history";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image provided" });
      return;
    }

    const analysis = await analyzeObjectImage(req.file.path);

    const result = {
      id: uuidv4(),
      ...analysis,
      imageUri: "",
      createdAt: new Date().toISOString(),
    };

    addToHistory(result);

    res.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

export default router;
