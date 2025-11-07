import express from "express";
import { sendMessage, getMessages, getUsers } from "../controller/message.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = express.Router();

router.post("/send", verifyToken, sendMessage);
router.get("/users", verifyToken, getUsers);
router.get("/:userId", verifyToken, getMessages);

export default router;