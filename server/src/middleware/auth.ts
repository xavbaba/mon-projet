import { Request, Response, NextFunction } from "express";

// Placeholder for Supabase auth middleware (Step 6)
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // TODO: Verify Supabase JWT token
  next();
}
