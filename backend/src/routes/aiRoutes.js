import express from "express";
import {
  generateDescription,
  getRecommendations,
  getSimilarProducts,
  aiChat,
} from "../controllers/aiController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/generate-description", protect, authorize("seller", "admin"), generateDescription);
router.get("/recommendations", protect, getRecommendations);
router.get("/similar/:productId", getSimilarProducts);
router.post("/chat", aiChat);

export default router;
