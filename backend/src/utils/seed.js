// Optional helper: seeds a few demo products for local development.
// Run with: npm run seed  (make sure MONGO_URI is set in .env and a seller user already exists)
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const run = async () => {
  await connectDB();

  const seller = await User.findOne({ role: "seller" });
  if (!seller) {
    console.log("⚠️  No seller user found. Sign up as a seller in the app first, then re-run this script.");
    process.exit(0);
  }

  const sampleProducts = [
    {
      name: "Aurora Wireless Headphones",
      description: "Immersive sound with active noise cancellation and 40-hour battery life.",
      category: "Electronics",
      brand: "Aurora",
      price: 129.99,
      discountPrice: 99.99,
      stock: 50,
      images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", publicId: "" }],
      tags: ["headphones", "wireless", "audio"],
    },
    {
      name: "Nimbus Running Sneakers",
      description: "Lightweight, breathable running shoes with responsive cushioning.",
      category: "Fashion",
      brand: "Nimbus",
      price: 89.99,
      stock: 80,
      images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", publicId: "" }],
      tags: ["shoes", "running", "sports"],
    },
    {
      name: "Lumen Smart Desk Lamp",
      description: "Adjustable LED desk lamp with app control and wireless charging base.",
      category: "Home",
      brand: "Lumen",
      price: 49.99,
      stock: 120,
      images: [{ url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c", publicId: "" }],
      tags: ["lamp", "smart-home", "office"],
    },
  ];

  for (const p of sampleProducts) {
    await Product.create({ ...p, seller: seller._id });
  }

  console.log(`✅ Seeded ${sampleProducts.length} products for seller ${seller.name}`);
  await mongoose.disconnect();
  process.exit(0);
};

run();
