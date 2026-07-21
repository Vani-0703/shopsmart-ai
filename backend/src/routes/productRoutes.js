import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getCategories,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/meta/categories", getCategories);
router.get("/mine/list", protect, authorize("seller", "admin"), getMyProducts);
router.get("/:id", getProduct);
router.post("/", protect, authorize("seller", "admin"), createProduct);
router.put("/:id", protect, authorize("seller", "admin"), updateProduct);
router.delete("/:id", protect, authorize("seller", "admin"), deleteProduct);

export default router;
