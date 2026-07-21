import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const trackingEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
    },
    note: String,
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: { type: String, enum: ["card", "cod"], default: "card" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    stripePaymentIntentId: { type: String, default: "" },
    itemsPrice: Number,
    shippingPrice: { type: Number, default: 0 },
    taxPrice: { type: Number, default: 0 },
    totalPrice: Number,
    currentStatus: {
      type: String,
      enum: ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
      default: "placed",
    },
    trackingHistory: [trackingEventSchema],
    deliveredAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
