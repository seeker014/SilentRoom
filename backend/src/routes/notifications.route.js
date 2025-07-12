import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getUserNotifications } from "../controllers/notifications.controller.js";

const router = express.Router();

router.get("/:userId", protect, getUserNotifications);

export default router;
