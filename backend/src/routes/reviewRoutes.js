import express from "express";
import {
  getProductReviews,
  createReview,
  replyToReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.post("/product/:productId", protect, createReview);
router.put("/:id/reply", protect, authorize("seller", "admin"), replyToReview);
router.delete("/:id", protect, deleteReview);

export default router;
