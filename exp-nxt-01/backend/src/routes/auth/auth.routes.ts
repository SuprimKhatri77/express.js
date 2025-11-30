import { Router } from "express";
import { signupController } from "../../controllers/auth/signup.controller";
import { loginController } from "../../controllers/auth/login.controller";
import { signoutController } from "../../controllers/auth/signout.controller";
import { getUserSessionController } from "../../controllers/auth/getUserSession.controller";
import { verifyEmailController } from "../../controllers/auth/verifyEmail.controller";
import { resendVerificationEmailController } from "../../controllers/auth/resendVerificationEmail.controller";
import { forgotPasswordController } from "../../controllers/auth/forgotPassword.controller";
import { resetPasswordController } from "../../controllers/auth/resetPassword.controller";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/signout", signoutController);
router.get("/get-user-session", getUserSessionController);
router.get("/verify-email", verifyEmailController);
router.post("/resend-verification-email", resendVerificationEmailController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

export default router;
