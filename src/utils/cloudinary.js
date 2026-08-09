import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "rentease",
  api_key: process.env.CLOUDINARY_API_KEY || "853974441586524",
  api_secret: process.env.CLOUDINARY_API_SECRET || "k3lLdhScAXDnerpFJTLoQMdzVcI",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "rentease_products",
    });
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return { url: response.secure_url, isCloudinary: true };
  } catch (error) {
    console.warn(
      "[Cloudinary Upload Warning] Cloudinary service returned error, serving from local static storage:",
      error.message || error
    );
    if (fs.existsSync(localFilePath)) {
      const fileName = path.basename(localFilePath);
      return { url: `http://localhost:5000/temp/${fileName}`, isCloudinary: false };
    }
    return null;
  }
};

export { uploadOnCloudinary };
