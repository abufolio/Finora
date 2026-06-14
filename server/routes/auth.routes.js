import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  uploadAvatar,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, updatePassword);
router.post("/avatar", authMiddleware, upload.single("avatar"), uploadAvatar);

export default router;
