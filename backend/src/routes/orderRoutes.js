import express from "express";
import {
  createPaymentIntent,
  createOrder,
  getMyOrders,
  getOrder,
  getSellerOrders,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-payment-intent", protect, createPaymentIntent);
router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/seller/list", protect, authorize("seller", "admin"), getSellerOrders);
router.get("/", protect, authorize("admin"), getAllOrders);
router.get("/:id", protect, getOrder);
router.put("/:id/status", protect, authorize("seller", "admin"), updateOrderStatus);

export default router;
