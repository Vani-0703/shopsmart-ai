// Product photography resolver for ShopSmart AI.
//
// The live catalog previously stored the same laptop photo on many products.
// This resolver intentionally replaces that known generic/catalog laptop image
// with a stable, product-relevant photo. Real seller uploads still win unless
// they are one of the known generic catalog placeholders.

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

// Product-type keywords are checked before category keywords so, for example,
// an "USB-C Charging Cable" gets a cable image instead of a random laptop.
const PRODUCT_KEYWORDS = [
  [["earbud", "airpod", "earphone"], "wireless earbuds"],
  [["headphone"], "headphones"],
  [["charging cable", "usb cable", "type c", "usb-c", "charger"], "charging cable"],
  [["power bank", "powerbank"], "power bank"],
  [["keyboard"], "computer keyboard"],
  [["mouse"], "computer mouse"],
  [["smartphone", "phone", "mobile"], "smartphone"],
  [["laptop", "notebook"], "laptop computer"],
  [["tablet"], "tablet computer"],
  [["smartwatch", "smart watch"], "smartwatch"],
  [["camera", "dslr"], "digital camera"],
  [["speaker", "soundbar"], "bluetooth speaker"],
  [["monitor", "display"], "computer monitor"],
  [["induction", "cooktop", "stove"], "induction cooktop"],
  [["air fryer"], "air fryer"],
  [["blender", "mixer"], "kitchen blender"],
  [["toaster"], "toaster"],
  [["coffee", "espresso"], "coffee maker"],
  [["microwave"], "microwave oven"],
  [["kettle"], "electric kettle"],
  [["cookware", "pan", "pot"], "cookware"],
  [["yoga"], "yoga mat"],
  [["dumbbell", "weight"], "dumbbells"],
  [["treadmill"], "treadmill"],
  [["resistance"], "resistance bands"],
  [["fitness", "gym"], "fitness equipment"],
  [["running", "sneaker", "shoe"], "running shoes"],
  [["watch"], "wrist watch"],
  [["wallet"], "leather wallet"],
  [["sunglass", "eyewear"], "sunglasses"],
  [["backpack"], "backpack"],
  [["handbag", "purse"], "handbag"],
  [["belt"], "leather belt"],
  [["lamp", "light"], "desk lamp"],
  [["mirror"], "home mirror"],
  [["vase"], "home vase"],
  [["cushion", "pillow"], "cushion"],
  [["organizer", "storage"], "home organizer"],
  [["sofa", "couch"], "sofa"],
  [["chair"], "chair furniture"],
  [["table", "desk"], "table furniture"],
  [["bed"], "bedroom furniture"],
  [["bookshelf", "shelf"], "bookshelf"],
  [["tent"], "camping tent"],
  [["camping"], "camping gear"],
  [["hiking"], "hiking backpack"],
  [["bicycle", "bike"], "bicycle"],
  [["jacket", "coat"], "jacket clothing"],
  [["shirt", "t-shirt", "tee"], "shirt clothing"],
  [["jeans", "denim"], "jeans clothing"],
  [["dress"], "dress clothing"],
];

const CATEGORY_KEYWORDS = {
  electronics: [
    "wireless earbuds",
    "smartphone",
    "charging cable",
    "computer keyboard",
    "smartwatch",
    "bluetooth speaker",
    "digital camera",
    "power bank",
  ],
  kitchen: [
    "induction cooktop",
    "kitchen blender",
    "air fryer",
    "toaster",
    "coffee maker",
    "electric kettle",
    "cookware",
  ],
  appliances: [
    "air fryer",
    "coffee maker",
    "microwave oven",
    "electric kettle",
    "kitchen blender",
    "induction cooktop",
    "toaster",
  ],
  fitness: [
    "dumbbells",
    "yoga mat",
    "resistance bands",
    "treadmill",
    "fitness equipment",
    "running shoes",
  ],
  accessories: [
    "leather wallet",
    "sunglasses",
    "backpack",
    "handbag",
    "wrist watch",
    "leather belt",
  ],
  home: [
    "desk lamp",
    "home decor",
    "home organizer",
    "home mirror",
    "cushion",
    "home vase",
  ],
  outdoor: [
    "camping tent",
    "hiking backpack",
    "bicycle",
    "camping gear",
    "outdoor chair",
  ],
  furniture: [
    "sofa",
    "chair furniture",
    "table furniture",
    "bedroom furniture",
    "bookshelf",
  ],
  clothing: [
    "shirt clothing",
    "jeans clothing",
    "jacket clothing",
    "dress clothing",
  ],
  fashion: [
    "shirt clothing",
    "jeans clothing",
    "jacket clothing",
    "dress clothing",
  ],
};

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and");

const hashString = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
};

const getProductKeyword = (product) => {
  const name = normalize(product?.name);

  for (const [terms, keyword] of PRODUCT_KEYWORDS) {
    if (terms.some((term) => name.includes(term))) return keyword;
  }

  const category = normalize(product?.category);
  const options = CATEGORY_KEYWORDS[category] || CATEGORY_KEYWORDS.electronics;
  return options[hashString(`${name}:${product?._id || ""}`) % options.length];
};

const isKnownGenericImage = (url) => {
  const value = String(url || "").toLowerCase();

  // This is the laptop image that was stored against many live catalog items.
  return (
    value.includes("photo-1496181133206-80ce9b88a853") ||
    value.includes("photo-1468495244123-6c6c332eeece") ||
    value.includes("photo-1523206489230-c012c64b2b48")
  );
};

const buildCatalogGallery = (product) => {
  const name = normalize(product?.name) || "product";
  const id = String(product?._id || product?.id || "");
  const keyword = getProductKeyword(product);
  const seed = hashString(`${name}:${id}:${normalize(product?.category)}`) || 1;

  // LoremFlickr supports keyword-specific photos and a stable lock value, so
  // every catalog item gets a deterministic but different relevant image.
  return [0, 1, 2].map((offset) =>
    `https://loremflickr.com/1200/1200/${encodeURIComponent(keyword)}?lock=${seed + offset * 7919}`
  );
};

export const getProductImages = (product) => {
  const uploadedImages = (product?.images || [])
    .map((image) => (typeof image === "string" ? image : image?.url))
    .filter(Boolean);

  const usableUploadedImages = uploadedImages.filter(
    (image) => !isKnownGenericImage(image)
  );

  if (usableUploadedImages.length) return usableUploadedImages;

  const exactDemoGallery = PRODUCT_IMAGE_GALLERIES[product?.name];
  if (exactDemoGallery) return exactDemoGallery;

  return buildCatalogGallery(product);
};

export const getProductImage = (product) => getProductImages(product)[0];

export default PRODUCT_IMAGE_GALLERIES;
