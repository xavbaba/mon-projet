import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getAnalysesForUser } from "../services/supabase";

export interface HistoryItem {
  id: string;
  name: string;
  epoch: string;
  usage: string;
  estimatedValue: string;
  description: string;
  similarItems?: any[];
  imageUri: string;
  createdAt: string;
}

// In-memory fallback when Supabase is not configured
const memoryHistory: HistoryItem[] = [];

export function addToHistory(item: HistoryItem) {
  memoryHistory.unshift(item);
}

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string | undefined;

  if (userId) {
    try {
      const items = await getAnalysesForUser(userId);
      res.json(items);
      return;
    } catch (err) {
      console.warn("Supabase history fetch failed, falling back to memory:", err);
    }
  }

  res.json(memoryHistory);
});

export default router;
