import express from "express";
import { getAnalytics, getUsers, updateUser, getSellerAnalytics } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/analytics", protect, authorize("admin"), getAnalytics);
router.get("/seller-analytics", protect, authorize("seller", "admin"), getSellerAnalytics);
router.get("/users", protect, authorize("admin"), getUsers);
router.put("/users/:id", protect, authorize("admin"), updateUser);

export default router;
