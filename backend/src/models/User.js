import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    // Seller-specific
    storeName: { type: String, default: "" },
    storeDescription: { type: String, default: "" },
    storeApproved: { type: Boolean, default: false },
    // Status
    isActive: { type: Boolean, default: true },
    notificationPrefs: {
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
