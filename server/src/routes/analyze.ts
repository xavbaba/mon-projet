import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { analyzeObjectImage } from "../services/openai";
import { searchSimilarItems, EbaySimilarItem } from "../services/ebay";
import { requireAuth } from "../middleware/auth";
import { saveAnalysis } from "../services/supabase";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image provided" });
      return;
    }

    const analysis = await analyzeObjectImage(req.file.path);

    let similarItems: EbaySimilarItem[] = [];
    try {
      similarItems = await searchSimilarItems(analysis.name);
    } catch (err) {
      console.warn("eBay search failed, continuing without:", err);
    }

    const result = {
      id: uuidv4(),
      ...analysis,
      similarItems,
      imageUri: "",
      createdAt: new Date().toISOString(),
    };

    const userId = (req as any).userId as string | undefined;
    if (userId) {
      try {
        await saveAnalysis(userId, result);
      } catch (err) {
        console.warn("Failed to save to Supabase, continuing:", err);
      }
    }

    res.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

export default router;
