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
      images: [
        { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=90", publicId: "" },
        { url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=90", publicId: "" },
        { url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=90", publicId: "" },
      ],
      tags: ["headphones", "wireless", "audio"],
    },
    {
      name: "Nimbus Running Sneakers",
      description: "Lightweight, breathable running shoes with responsive cushioning.",
      category: "Fashion",
      brand: "Nimbus",
      price: 89.99,
      stock: 80,
      images: [
        { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90", publicId: "" },
        { url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=90", publicId: "" },
        { url: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=90", publicId: "" },
      ],
      tags: ["shoes", "running", "sports"],
    },
    {
      name: "Lumen Smart Desk Lamp",
      description: "Adjustable LED desk lamp with app control and wireless charging base.",
      category: "Home",
      brand: "Lumen",
      price: 49.99,
      stock: 120,
      images: [
        { url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=90", publicId: "" },
        { url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=90", publicId: "" },
        { url: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=90", publicId: "" },
      ],
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
