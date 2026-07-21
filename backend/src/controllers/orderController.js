import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import stripe from "../config/stripe.js";

// @desc  Create Stripe payment intent for cart total
// @route POST /api/orders/create-payment-intent
// @access Private
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body; // amount in smallest currency unit (e.g. cents)
  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("A valid amount is required");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount),
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { userId: req.user._id.toString() },
  });

  res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret });
});

// @desc  Place a new order (after successful payment or COD)
// @route POST /api/orders
// @access Private
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, stripePaymentIntentId, itemsPrice, shippingPrice, taxPrice, totalPrice } =
    req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  const order = await Order.create({
    customer: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    stripePaymentIntentId,
    paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    trackingHistory: [{ status: "placed", note: "Order placed successfully" }],
  });

  // Decrement stock & bump sold count
  await Promise.all(
    items.map((i) =>
      Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.quantity, numSold: i.quantity } })
    )
  );

  await Notification.create({
    user: req.user._id,
    type: "order",
    title: "Order placed!",
    message: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been placed.`,
    link: `/orders/${order._id}`,
  });

  res.status(201).json({ success: true, order });
});

// @desc  Get logged-in customer's orders
// @route GET /api/orders/mine
// @access Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, orders });
});

// @desc  Get single order (owner, seller of item, or admin)
// @route GET /api/orders/:id
// @access Private
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("customer", "name email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isOwner = order.customer._id.toString() === req.user._id.toString();
  const isSellerOfItem = order.items.some((i) => i.seller.toString() === req.user._id.toString());
  if (!isOwner && !isSellerOfItem && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.status(200).json({ success: true, order });
});

// @desc  Get orders containing the logged-in seller's products
// @route GET /api/orders/seller/list
// @access Private/Seller
export const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ "items.seller": req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, orders });
});

// @desc  Update order tracking status
// @route PUT /api/orders/:id/status
// @access Private/Seller,Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.currentStatus = status;
  order.trackingHistory.push({ status, note });
  if (status === "delivered") order.deliveredAt = new Date();
  await order.save();

  await Notification.create({
    user: order.customer,
    type: "order",
    title: "Order update",
    message: `Your order #${order._id.toString().slice(-6).toUpperCase()} is now ${status.replace(/_/g, " ")}.`,
    link: `/orders/${order._id}`,
  });

  res.status(200).json({ success: true, order });
});

// @desc  Get all orders (admin)
// @route GET /api/orders
// @access Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("customer", "name email").sort({ createdAt: -1 });
  res.status(200).json({ success: true, orders });
});
