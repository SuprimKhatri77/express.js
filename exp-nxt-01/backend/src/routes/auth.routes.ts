import { Router } from "express";
import {
  getUserSessionController,
  login,
  resendVerificationEmail,
  forgotPassword,
  signout,
  singup,
  verifyEmail,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", singup);
router.post("/login", login);
router.post("/signout", signout);
router.get("/get-user-session", getUserSessionController);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;
