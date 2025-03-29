import { Response, Request, Router } from "express";
import { githubAuth, googleAuth } from "../controllers/auth.controllers";
import passport from "passport";

const router: Router = Router();

router.post(
  "/email",
  passport.authenticate("local"),
  (_req: Request, res: Response) => {
    res.send("Logged In Successfully");
  },
);
router.post("/google", googleAuth);
router.post("/github", githubAuth);

export default router;
