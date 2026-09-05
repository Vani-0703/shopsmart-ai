// Product-specific demo photography used when a product has no uploaded image.
// These are remote Unsplash image URLs so the Vercel deployment does not need binary assets.

const PRODUCT_IMAGE_GALLERIES = {
  "Aurora Wireless Headphones": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=90",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=90",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=90",
  ],
  "Nimbus Running Sneakers": [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=90",
    "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=90",
  ],
  "Lumen Smart Desk Lamp": [
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=90",
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=90",
    "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=90",
  ],
};

export const getProductImages = (product) => {
  const uploadedImages = (product?.images || [])
    .map((image) => (typeof image === "string" ? image : image?.url))
    .filter(Boolean);

  if (uploadedImages.length) return uploadedImages;
  return PRODUCT_IMAGE_GALLERIES[product?.name] || [];
};

export const getProductImage = (product) =>
  getProductImages(product)[0] || "https://placehold.co/600x600?text=ShopSmart+AI";

export default PRODUCT_IMAGE_GALLERIES;
