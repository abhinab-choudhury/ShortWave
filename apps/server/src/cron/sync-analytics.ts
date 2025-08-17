import type { VercelRequest, VercelResponse } from "@vercel/node";
import { flushRedishStatsToMongo } from "../utils/redis-helpers";
import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  try {
    await flushRedishStatsToMongo(req, res);
    return res.status(200).json({ message: "Analytics synced to MongoDB" });
  } catch (error) {
    console.error("Error in sync-alaytics: ", error);
    return res.status(500).json({ error: "Sync Failed" });
  }
}
