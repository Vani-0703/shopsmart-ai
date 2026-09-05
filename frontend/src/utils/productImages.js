// Fast, stable product photography resolver for ShopSmart AI.
// Uses curated Unsplash CDN images instead of LoremFlickr's on-demand image generation.
const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=78`;

const TYPE_IMAGES = {
  "wireless earbuds": U("photo-1606220945770-b5b6c2c55bf1"), headphones: U("photo-1505740420928-5e560c06d30e"),
  "charging cable": U("photo-1583863788434-e58a36330cf0"), "power bank": U("photo-1609592424714-0b8d1b5f1f3a"),
  "computer keyboard": U("photo-1511467687858-23d96c32e4ae"), "computer mouse": U("photo-1527814050087-3793815479db"),
  smartphone: U("photo-1511707171634-5f897ff02aa9"), "laptop computer": U("photo-1496181133206-80ce9b88a853"),
  "tablet computer": U("photo-1544244015-0df4b3ffc6b0"), smartwatch: U("photo-1523275335684-37898b6baf30"),
  "digital camera": U("photo-1516035069371-29a1b244cc32"), "bluetooth speaker": U("photo-1608043152269-423dbba4e7e1"),
  "computer monitor": U("photo-1527443224154-c4a3942d3acf"), "induction cooktop": U("photo-1556911220-e15b29be8c8f"),
  "air fryer": U("photo-1556910103-1c02745aae4d"), "kitchen blender": U("photo-1570222094114-d054a817e56b"),
  toaster: U("photo-1585238342024-78d387f4a707"), "coffee maker": U("photo-1495474472287-4d71bcdd2085"),
  "electric kettle": U("photo-1594212699903-ec8a3eca50f5"), cookware: U("photo-1556910103-1c02745aae4d"),
  "microwave oven": U("photo-1585659722983-3a675dabf23d"), "yoga mat": U("photo-1544367567-0f2fcb009e0b"),
  dumbbells: U("photo-1583454110551-21f2fa2afe61"), "resistance bands": U("photo-1598971639058-a4e3d2d9b4a6"),
  treadmill: U("photo-1576678927484-cc907957088c"), "fitness equipment": U("photo-1534438327276-14e5300c3a48"),
  "running shoes": U("photo-1542291026-7eec264c27ff"), "leather wallet": U("photo-1627123424574-724758594e93"),
  sunglasses: U("photo-1511499767150-a48a237f0083"), backpack: U("photo-1553062407-98eeb64c6a62"),
  handbag: U("photo-1584917865442-de89df76afd3"), "wrist watch": U("photo-1523275335684-37898b6baf30"),
  "leather belt": U("photo-1624222247344-550fb60583dc"), "desk lamp": U("photo-1507473885765-e6ed057f782c"),
  "home mirror": U("photo-1618220179428-22790b1a42a1"), "home vase": U("photo-1612196808214-b8e1d6145a8c"),
  cushion: U("photo-1584100936595-c0654b55a2e2"), "home organizer": U("photo-1558997519-83ea9252edf8"),
  "home decor": U("photo-1618221195710-dd6b41faaea6"), "camping tent": U("photo-1504280390367-361c6d9f38f4"),
  "camping gear": U("photo-1475483768296-6163e08872a1"), "hiking backpack": U("photo-1551632811-561732d1e306"),
  bicycle: U("photo-1485965120184-e220f721d03e"), "outdoor chair": U("photo-1600210492486-724fe5c67fb0"),
  sofa: U("photo-1555041469-a586c61ea9bc"), "chair furniture": U("photo-1503602642458-232111445657"),
  "table furniture": U("photo-1533090481720-856c6e3c1fdc"), "bedroom furniture": U("photo-1505693416388-ac5ce068fe85"),
  bookshelf: U("photo-1594620302200-9a762244a156"), "shirt clothing": U("photo-1521572163474-6864f9cf17ab"),
  "jeans clothing": U("photo-1542272604-787c3835535d"), "jacket clothing": U("photo-1551028719-00167b16eac5"),
  "dress clothing": U("photo-1595777457583-95e059d581b8"),
};

const PRODUCT_IMAGE_GALLERIES = {
  "Aurora Wireless Headphones": [TYPE_IMAGES.headphones],
  "Nimbus Running Sneakers": [TYPE_IMAGES["running shoes"]],
  "Lumen Smart Desk Lamp": [TYPE_IMAGES["desk lamp"]],
};

const PRODUCT_KEYWORDS = [
  [["earbud", "airpod", "earphone"], "wireless earbuds"], [["headphone"], "headphones"],
  [["charging cable", "usb cable", "type c", "usb-c", "charger"], "charging cable"], [["power bank", "powerbank"], "power bank"],
  [["keyboard"], "computer keyboard"], [["mouse"], "computer mouse"], [["smartphone", "phone", "mobile"], "smartphone"],
  [["laptop", "notebook"], "laptop computer"], [["tablet"], "tablet computer"], [["smartwatch", "smart watch"], "smartwatch"],
  [["camera", "dslr"], "digital camera"], [["speaker", "soundbar"], "bluetooth speaker"], [["monitor", "display"], "computer monitor"],
  [["induction", "cooktop", "stove"], "induction cooktop"], [["air fryer"], "air fryer"], [["blender", "mixer"], "kitchen blender"],
  [["toaster"], "toaster"], [["coffee", "espresso"], "coffee maker"], [["microwave"], "microwave oven"], [["kettle"], "electric kettle"],
  [["cookware", "pan", "pot"], "cookware"], [["yoga"], "yoga mat"], [["dumbbell", "weight"], "dumbbells"], [["treadmill"], "treadmill"],
  [["resistance"], "resistance bands"], [["fitness", "gym"], "fitness equipment"], [["running", "sneaker", "shoe"], "running shoes"],
  [["wallet"], "leather wallet"], [["sunglass", "eyewear"], "sunglasses"], [["backpack"], "backpack"], [["handbag", "purse"], "handbag"],
  [["watch"], "wrist watch"], [["belt"], "leather belt"], [["lamp", "light"], "desk lamp"], [["mirror"], "home mirror"],
  [["vase"], "home vase"], [["cushion", "pillow"], "cushion"], [["organizer", "storage"], "home organizer"], [["sofa", "couch"], "sofa"],
  [["chair"], "chair furniture"], [["table", "desk"], "table furniture"], [["bed"], "bedroom furniture"], [["bookshelf", "shelf"], "bookshelf"],
  [["tent"], "camping tent"], [["camping"], "camping gear"], [["hiking"], "hiking backpack"], [["bicycle", "bike"], "bicycle"],
  [["jacket", "coat"], "jacket clothing"], [["shirt", "t-shirt", "tee"], "shirt clothing"], [["jeans", "denim"], "jeans clothing"], [["dress"], "dress clothing"],
];

const normalize = (value) => String(value || "").trim().toLowerCase().replace(/&/g, "and");
const hashString = (value) => { let hash = 2166136261; for (let i = 0; i < value.length; i += 1) { hash ^= value.charCodeAt(i); hash = Math.imul(hash, 16777619); } return Math.abs(hash >>> 0); };

const getProductKeyword = (product) => {
  const name = normalize(product?.name);
  for (const [terms, keyword] of PRODUCT_KEYWORDS) if (terms.some((term) => name.includes(term))) return keyword;
  const category = normalize(product?.category);
  const options = {
    electronics: ["wireless earbuds", "headphones", "smartphone", "smartwatch", "digital camera", "bluetooth speaker"],
    kitchen: ["induction cooktop", "kitchen blender", "air fryer", "toaster", "coffee maker", "electric kettle", "cookware"],
    fitness: ["dumbbells", "yoga mat", "resistance bands", "treadmill", "fitness equipment", "running shoes"],
    accessories: ["leather wallet", "sunglasses", "backpack", "handbag", "wrist watch", "leather belt"],
    home: ["desk lamp", "home mirror", "home vase", "cushion", "home organizer", "home decor"],
    outdoor: ["camping tent", "camping gear", "hiking backpack", "bicycle", "outdoor chair"],
    furniture: ["sofa", "chair furniture", "table furniture", "bedroom furniture", "bookshelf"],
    clothing: ["shirt clothing", "jeans clothing", "jacket clothing", "dress clothing"],
    fashion: ["shirt clothing", "jeans clothing", "jacket clothing", "dress clothing"],
  }[category] || ["smartphone", "headphones", "desk lamp"];
  return options[hashString(`${name}:${product?._id || ""}`) % options.length];
};

const isKnownGenericImage = (url) => {
  const value = String(url || "").toLowerCase();
  return value.includes("photo-1496181133206-80ce9b88a853") || value.includes("photo-1468495244123-6c6c332eeece") || value.includes("photo-1523206489230-c012c64b2b48");
};

export const getProductImages = (product) => {
  const uploadedImages = (product?.images || []).map((image) => (typeof image === "string" ? image : image?.url)).filter(Boolean);
  const usableUploadedImages = uploadedImages.filter((image) => !isKnownGenericImage(image));
  if (usableUploadedImages.length) return usableUploadedImages;
  const exactDemoGallery = PRODUCT_IMAGE_GALLERIES[product?.name];
  if (exactDemoGallery) return exactDemoGallery;
  const keyword = getProductKeyword(product);
  const image = TYPE_IMAGES[keyword] || TYPE_IMAGES.smartphone;
  return [image, image, image];
};

export const getProductImage = (product) => getProductImages(product)[0];
export default PRODUCT_IMAGE_GALLERIES;
