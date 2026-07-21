import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import webhookRoutes from "./routes/webhookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "*", credentials: true },
});

// Make io accessible in controllers via req.app.get("io") if needed later
app.set("io", io);

io.on("connection", (socket) => {
  socket.on("join", (userId) => socket.join(userId)); // per-user room for live notifications
  socket.on("disconnect", () => {});
});

connectDB();

// IMPORTANT: Stripe webhook route needs the raw body, so it's mounted BEFORE express.json()
app.use("/api/webhooks", webhookRoutes);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/health", (req, res) => res.json({ success: true, message: "ShopSmart AI API is running 🚀" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// When running locally or on a persistent host (Render/Railway/EC2), start the HTTP + Socket.io server normally.
// On Vercel's serverless functions, this file is imported as a handler instead (see vercel.json) and
// app.listen is skipped — note that Socket.io real-time notifications require a persistent server,
// so for full real-time functionality prefer Render/Railway for the backend (see README).
if (process.env.VERCEL !== "1") {
  server.listen(PORT, () => {
    console.log(`🚀 ShopSmart AI server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
}

export default app;
