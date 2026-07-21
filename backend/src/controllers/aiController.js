import asyncHandler from "express-async-handler";
import { getGeminiModel } from "../config/gemini.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @desc  Generate an AI product description + tagline from basic details
// @route POST /api/ai/generate-description
// @access Private/Seller
export const generateDescription = asyncHandler(async (req, res) => {
  const { name, category, brand, keyFeatures } = req.body;

  if (!name || !category) {
    res.status(400);
    throw new Error("Product name and category are required");
  }

  const prompt = `You are an expert e-commerce copywriter. Write a compelling, SEO-friendly product description
for the following item. Return STRICT JSON only, no markdown fences, in this shape:
{"tagline": "one short punchy line (max 12 words)", "description": "3-4 persuasive paragraphs (max 180 words total)", "tags": ["5-8 relevant search keywords"]}

Product name: ${name}
Category: ${category}
Brand: ${brand || "N/A"}
Key features: ${keyFeatures || "N/A"}`;

  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);
    res.status(200).json({ success: true, ...parsed });
  } catch (error) {
    console.error("Gemini generation error:", error.message);
    res.status(200).json({
      success: true,
      tagline: `Discover the new ${name}`,
      description: `Introducing the ${name} — a premium addition to our ${category} collection${
        brand ? ` from ${brand}` : ""
      }. Thoughtfully designed for quality, comfort, and everyday reliability. ${
        keyFeatures ? `Highlights include ${keyFeatures}.` : ""
      } A great pick for anyone who values style and function in equal measure.`,
      tags: [category.toLowerCase(), brand?.toLowerCase()].filter(Boolean),
      note: "AI service unavailable — generated a fallback description instead.",
    });
  }
});

// @desc  Get AI-powered personalized product recommendations for the logged-in user
// @route GET /api/ai/recommendations
// @access Private
export const getRecommendations = asyncHandler(async (req, res) => {
  // Pull the user's recent order history to infer taste, then fall back to trending items
  const orders = await Order.find({ customer: req.user._id }).limit(10).sort({ createdAt: -1 });
  const purchasedCategories = new Set();
  orders.forEach((o) => o.items.forEach((i) => i.name && purchasedCategories.add(i.name)));

  const wishlist = req.user.wishlist || [];

  let recommendations = [];

  if (purchasedCategories.size > 0 || wishlist.length > 0) {
    const seedProducts = await Product.find({ _id: { $in: wishlist } }).limit(5);
    const categories = [...new Set(seedProducts.map((p) => p.category))];

    recommendations = await Product.find({
      isActive: true,
      category: { $in: categories.length ? categories : undefined },
      _id: { $nin: wishlist },
    })
      .sort({ ratingsAverage: -1, numSold: -1 })
      .limit(8);
  }

  if (recommendations.length < 8) {
    const fallback = await Product.find({ isActive: true, _id: { $nin: recommendations.map((r) => r._id) } })
      .sort({ numSold: -1, ratingsAverage: -1 })
      .limit(8 - recommendations.length);
    recommendations = [...recommendations, ...fallback];
  }

  res.status(200).json({ success: true, recommendations });
});

// @desc  AI similar-products for a given product page ("You may also like")
// @route GET /api/ai/similar/:productId
// @access Public
export const getSimilarProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const similar = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    $or: [
      { category: product.category },
      { tags: { $in: product.tags } },
      { brand: product.brand },
    ],
  })
    .sort({ ratingsAverage: -1 })
    .limit(6);

  res.status(200).json({ success: true, similar });
});

// @desc  AI shopping assistant chat — answers questions using catalog context
// @route POST /api/ai/chat
// @access Public
export const aiChat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }

  const matchedProducts = await Product.find({ isActive: true, $text: { $search: message } })
    .limit(5)
    .select("name price category ratingsAverage slug");

  const context = matchedProducts
    .map((p) => `- ${p.name} ($${p.price}, ${p.category}, rated ${p.ratingsAverage}/5)`)
    .join("\n");

  const prompt = `You are ShopSmart AI's friendly shopping assistant. Answer the user's question helpfully and concisely
(max 80 words), using this catalog context if relevant:
${context || "No matching catalog items found."}

User question: ${message}`;

  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    res.status(200).json({ success: true, reply: result.response.text(), matchedProducts });
  } catch (error) {
    res.status(200).json({
      success: true,
      reply:
        matchedProducts.length > 0
          ? `I found ${matchedProducts.length} items that might match what you're looking for — check the suggestions below!`
          : "I couldn't find an exact match — try browsing our categories or searching different keywords.",
      matchedProducts,
    });
  }
});
