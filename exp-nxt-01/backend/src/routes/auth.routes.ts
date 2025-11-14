import { Router } from "express";
import {
  getUserSessionController,
  login,
  signout,
  singup,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", singup);
router.post("/login", login);
router.post("/signout", signout);
router.get("/get-user-session", getUserSessionController);
export default router;
