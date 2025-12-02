// routes/category.js
import express from "express";
import Product from "../models/Product.js"; // ✅ Import your Product model

const router = express.Router();

// Redirect /category → home
router.get("/", (req, res) => {
  res.redirect("/"); 
});

// ✅ Handle specific category pages
router.get("/:type", async (req, res) => {
  const { type } = req.params;
  const valid = ["necklaces", "rings", "earrings", "bracelets"];

  if (!valid.includes(type)) {
    return res.status(404).render("404", { message: "Category not found" });
  }
  

  try {
    // Fetch all products from DB where category matches
    const products = await Product.find({ category: type }).sort({ createdAt: -1 });

    // Render that category EJS file dynamically (e.g., rings.ejs)
    res.render(type, { products });
  } catch (err) {
    console.error(`❌ Error loading ${type}:`, err);
    res.status(500).send("Server error while loading category");
  }
});

export default router;
