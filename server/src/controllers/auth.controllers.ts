import { Request, Response } from "express";

export async function googleAuth(req: Request, res: Response) {
  return res.send("google Auth");
}

export async function githubAuth(req: Request, res: Response) {
  return res.send("Github Auth");
}
