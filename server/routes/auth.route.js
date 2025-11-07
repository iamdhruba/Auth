import express from "express";
import { login, logout, register, sendOTP, verifyOTPAndResetPassword } from "../controller/auth.controller.js";
import {
  loginValidation,
  singupValidation,
} from "../middleware/auth.middleware.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/send-otp", sendOTP);
router.post("/verify-otp-reset", verifyOTPAndResetPassword);

export default router;