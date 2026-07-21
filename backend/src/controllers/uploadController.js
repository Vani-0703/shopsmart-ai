import asyncHandler from "express-async-handler";

// @desc  Upload one or more images to Cloudinary via multer middleware
// @route POST /api/upload
// @access Private/Seller
export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("No files uploaded");
  }

  const images = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
  res.status(200).json({ success: true, images });
});
