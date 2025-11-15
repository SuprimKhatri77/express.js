import { Router } from "express";
import {
  getUserSessionController,
  login,
  resendVerificationEmail,
  signout,
  singup,
  verifyEmail,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", singup);
router.post("/login", login);
router.post("/signout", signout);
router.get("/get-user-session", getUserSessionController);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
export default router;
