import asyncHandler from "express-async-handler";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const recalcProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  await Product.findByIdAndUpdate(productId, {
    ratingsAverage: stats[0]?.avg?.toFixed(1) || 0,
    ratingsCount: stats[0]?.count || 0,
  });
};

// @desc  Get reviews for a product
// @route GET /api/reviews/product/:productId
// @access Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, reviews });
});

// @desc  Create a review (only if user purchased the product)
// @route POST /api/reviews/product/:productId
// @access Private
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, images } = req.body;
  const productId = req.params.productId;

  const purchased = await Order.exists({
    customer: req.user._id,
    "items.product": productId,
    currentStatus: "delivered",
  });

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
    images,
    verifiedPurchase: !!purchased,
  });

  await recalcProductRating(productId);
  res.status(201).json({ success: true, review });
});

// @desc  Seller replies to a review
// @route PUT /api/reviews/:id/reply
// @access Private/Seller
export const replyToReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  review.sellerReply = req.body.reply;
  await review.save();
  res.status(200).json({ success: true, review });
});

// @desc  Delete a review (author or admin)
// @route DELETE /api/reviews/:id
// @access Private
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }
  await review.deleteOne();
  await recalcProductRating(review.product);
  res.status(200).json({ success: true, message: "Review removed" });
});
