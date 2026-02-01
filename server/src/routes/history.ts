import { Router } from "express";

export interface HistoryItem {
  id: string;
  name: string;
  epoch: string;
  usage: string;
  estimatedValue: string;
  description: string;
  imageUri: string;
  createdAt: string;
}

// In-memory store (will be replaced by Supabase later)
const history: HistoryItem[] = [];

export function addToHistory(item: HistoryItem) {
  history.unshift(item);
}

const router = Router();

router.get("/", (_req, res) => {
  res.json(history);
});

export default router;
