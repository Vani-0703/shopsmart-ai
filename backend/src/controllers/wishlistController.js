import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// @desc  Get logged-in user's wishlist
// @route GET /api/wishlist
// @access Private
export const getWishlist = asyncHandler(async (req, res) => {
  const products = await Product.find({ _id: { $in: req.user.wishlist } });
  res.status(200).json({ success: true, products });
});

// @desc  Toggle a product in/out of wishlist
// @route POST /api/wishlist/:productId
// @access Private
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const exists = req.user.wishlist.some((id) => id.toString() === productId);

  if (exists) {
    req.user.wishlist = req.user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    req.user.wishlist.push(productId);
  }

  await req.user.save();
  res.status(200).json({ success: true, wishlist: req.user.wishlist, added: !exists });
});
