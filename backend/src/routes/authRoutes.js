import express from "express";
import { syncUser, getMe, updateMe, addAddress } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/sync", syncUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/me/addresses", protect, addAddress);

export default router;
