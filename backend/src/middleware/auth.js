import asyncHandler from "express-async-handler";
import admin from "../config/firebaseAdmin.js";
import User from "../models/User.js";

// Verifies the Firebase ID token sent in the Authorization header (Bearer <token>)
// and attaches the matching MongoDB user document to req.user
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      res.status(401);
      throw new Error("User not found, please complete registration");
    }
    if (!user.isActive) {
      res.status(403);
      throw new Error("This account has been deactivated");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token invalid or expired");
  }
});

// Restricts access to specific roles, e.g. authorize("seller", "admin")
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role '${req.user.role}' is not permitted to access this resource`);
    }
    next();
  };
