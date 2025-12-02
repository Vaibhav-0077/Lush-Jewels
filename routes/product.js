// // routes/product.js
// import express from "express";
// import Product from "../models/Product.js";

// const router = express.Router();

// // View single product by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).send("Product not found");

//     res.render("product", {
//       name: product.name,
//       price: product.price,
//       img: product.img,
//       material: product.material,
//       design: product.design,
//       occasion: product.occasion,
//       description: product.description,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

// export default router;
