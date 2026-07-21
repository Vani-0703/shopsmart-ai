import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";

// @desc  Get logged-in user's notifications
// @route GET /api/notifications
// @access Private
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.status(200).json({ success: true, notifications });
});

// @desc  Mark a notification as read
// @route PUT /api/notifications/:id/read
// @access Private
export const markAsRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isRead: true });
  res.status(200).json({ success: true });
});

// @desc  Mark all notifications as read
// @route PUT /api/notifications/read-all
// @access Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json({ success: true });
});
