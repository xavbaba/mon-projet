import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || "";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Allow unauthenticated requests for now (graceful degradation)
    // History won't be saved but analysis still works
    next();
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!SUPABASE_JWT_SECRET) {
    console.warn("SUPABASE_JWT_SECRET not set, skipping auth verification");
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET) as { sub: string };
    (req as any).userId = decoded.sub;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
