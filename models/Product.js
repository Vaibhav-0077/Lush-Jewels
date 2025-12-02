import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  img: { type: String, required: true }, // main image
  thumbnails: [{ type: String }],        // ✅ array for additional images
  design: { type: String },
  material: { type: String },
  occasion: { type: String },
  description: { type: String },
  itemDescription: { type: String },
  category: { type: String, required: true }, // e.g., "rings", "necklaces"
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
