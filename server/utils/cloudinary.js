// server/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// ngarko .env këtu, përpara se të konfigurojmë Cloudinary
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// (opsionale) debug i vogël – komentoje pasi të punojë
// console.log("[Cloudinary] cloud:", process.env.CLOUDINARY_CLOUD_NAME, "key:", (process.env.CLOUDINARY_API_KEY||"").slice(0,4)+"****");

export default cloudinary;
