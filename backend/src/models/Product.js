import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    aiGeneratedDescription: { type: Boolean, default: false },
    shortTagline: { type: String, default: "" },
    category: { type: String, required: true, index: true },
    subCategory: { type: String, default: "" },
    brand: { type: String, default: "" },
    tags: [{ type: String }],
    images: [{ url: String, publicId: String }],
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, default: "" },
    ratingsAverage: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    numSold: { type: Number, default: 0 },
    attributes: [{ key: String, value: String }], // e.g. color, size
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    aiEmbeddingTags: [{ type: String }], // keywords for AI recommendation matching
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text", brand: "text" });

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${Date.now()
      .toString()
      .slice(-5)}`;
  }
  next();
});

export default mongoose.model("Product", productSchema);
