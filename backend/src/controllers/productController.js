import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// @desc  Get all products with search, filters, sort & pagination
// @route GET /api/products
// @access Public
export const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    brand,
    rating,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const query = { isActive: true };

  if (keyword) query.$text = { $search: keyword };
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (rating) query.ratingsAverage = { $gte: Number(rating) };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { ratingsAverage: -1 },
    newest: { createdAt: -1 },
    popular: { numSold: -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("seller", "name storeName"),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    products,
  });
});

// @desc  Get single product by slug or id
// @route GET /api/products/:id
// @access Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { slug: req.params.id }],
  }).populate("seller", "name storeName storeDescription avatar");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({ success: true, product });
});

// @desc  Create product (seller/admin)
// @route POST /api/products
// @access Private/Seller
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, seller: req.user._id });
  res.status(201).json({ success: true, product });
});

// @desc  Update product (owner seller/admin only)
// @route PUT /api/products/:id
// @access Private/Seller
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to edit this product");
  }
  Object.assign(product, req.body);
  await product.save();
  res.status(200).json({ success: true, product });
});

// @desc  Delete product
// @route DELETE /api/products/:id
// @access Private/Seller
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this product");
  }
  await product.deleteOne();
  res.status(200).json({ success: true, message: "Product removed" });
});

// @desc  Get products belonging to the logged-in seller
// @route GET /api/products/mine/list
// @access Private/Seller
export const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, products });
});

// @desc  Get distinct categories with counts (for filter sidebar)
// @route GET /api/products/meta/categories
// @access Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  res.status(200).json({ success: true, categories });
});
