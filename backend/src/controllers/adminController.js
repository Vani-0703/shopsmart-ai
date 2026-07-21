import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @desc  Platform-wide analytics for admin dashboard
// @route GET /api/admin/analytics
// @access Private/Admin
export const getAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalSellers, totalProducts, totalOrders, revenueAgg, salesByDay, topProducts] =
    await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "seller" }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            orders: { $sum: 1 },
            revenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 30 },
      ]),
      Product.find().sort({ numSold: -1 }).limit(5).select("name numSold price images"),
    ]);

  res.status(200).json({
    success: true,
    analytics: {
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      salesByDay,
      topProducts,
    },
  });
});

// @desc  Get all users (admin)
// @route GET /api/admin/users
// @access Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, users });
});

// @desc  Update a user's role or active status
// @route PUT /api/admin/users/:id
// @access Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const fields = ["role", "isActive", "storeApproved"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) user[f] = req.body[f];
  });
  await user.save();
  res.status(200).json({ success: true, user });
});

// @desc  Analytics scoped to the logged-in seller
// @route GET /api/admin/seller-analytics
// @access Private/Seller
export const getSellerAnalytics = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const [totalProducts, orders, topProducts] = await Promise.all([
    Product.countDocuments({ seller: sellerId }),
    Order.find({ "items.seller": sellerId }),
    Product.find({ seller: sellerId }).sort({ numSold: -1 }).limit(5).select("name numSold price images"),
  ]);

  let totalRevenue = 0;
  let totalOrders = 0;
  orders.forEach((o) => {
    const mine = o.items.filter((i) => i.seller.toString() === sellerId.toString());
    if (mine.length) {
      totalOrders += 1;
      totalRevenue += mine.reduce((sum, i) => sum + i.price * i.quantity, 0);
    }
  });

  res.status(200).json({
    success: true,
    analytics: { totalProducts, totalOrders, totalRevenue, topProducts },
  });
});
