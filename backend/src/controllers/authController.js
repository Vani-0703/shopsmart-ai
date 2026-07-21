import asyncHandler from "express-async-handler";
import admin from "../config/firebaseAdmin.js";
import User from "../models/User.js";

// @desc  Sync/create a MongoDB profile after Firebase signup/login
// @route POST /api/auth/sync
// @access Public (requires Firebase token in header)
export const syncUser = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401);
    throw new Error("No Firebase token provided");
  }

  const decoded = await admin.auth().verifyIdToken(token);
  const { name, role } = req.body;

  let user = await User.findOne({ firebaseUid: decoded.uid });

  if (!user) {
    user = await User.create({
      firebaseUid: decoded.uid,
      name: name || decoded.name || decoded.email.split("@")[0],
      email: decoded.email,
      avatar: decoded.picture || "",
      role: ["customer", "seller"].includes(role) ? role : "customer",
    });
  }

  res.status(200).json({ success: true, user });
});

// @desc  Get current logged-in user profile
// @route GET /api/auth/me
// @access Private
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// @desc  Update current user profile
// @route PUT /api/auth/me
// @access Private
export const updateMe = asyncHandler(async (req, res) => {
  const fields = ["name", "phone", "avatar", "storeName", "storeDescription", "notificationPrefs"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) req.user[f] = req.body[f];
  });
  await req.user.save();
  res.status(200).json({ success: true, user: req.user });
});

// @desc  Add or update a shipping address
// @route POST /api/auth/me/addresses
// @access Private
export const addAddress = asyncHandler(async (req, res) => {
  if (req.body.isDefault) {
    req.user.addresses.forEach((a) => (a.isDefault = false));
  }
  req.user.addresses.push(req.body);
  await req.user.save();
  res.status(201).json({ success: true, addresses: req.user.addresses });
});
