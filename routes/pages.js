// import express from "express";
// import Product from "../models/Product.js";

// const router = express.Router();

// // ✅ Product Page Route — loads details from DB
// // ✅ Product details route (using :id)
// router.get("/product/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).render("404", { message: "Product not found" });
//     }

//     const thumbnails =
//       Array.isArray(product.thumbnails) && product.thumbnails.length > 0
//         ? product.thumbnails
//         : [product.img];

//     res.render("product", {
//       name: product.name,
//       price: product.price,
//       img: product.img,
//       thumbnails,
//       design: product.design || "Classic Design",
//       material: product.material || "Gold Plated",
//       occasion: product.occasion || "Party, Wedding",
//       description: product.description || "Beautiful handcrafted jewelry piece.",
//       itemDescription: product.itemDescription || "Elegant and timeless design perfect for any occasion.",
//     });
//   } catch (err) {
//     console.error("❌ Error fetching product:", err);
//     res.status(500).render("404", { message: "Server error while loading product" });
//   }
// });


// router.get("/checkout", (req, res) => {
//   const { name, price, img, qty } = req.query;

//   // If user clicked Buy Now
//   if (req.query.single === 'true' && name && price && img) {
//     return res.render("checkout", {
//       cart: [{ name, price, img, qty: qty || 1 }]
//     });
//   }

//   // Otherwise show full cart
//   res.render("checkout", { cart: [] });
// });


// export default router;
















// // routes/pages.js
// import express from "express";
// import Product from "../models/Product.js";

// const router = express.Router();

// /* ----------------------------- PRODUCT PAGE ----------------------------- */
// // ✅ 1️⃣ View product by ID (preferred)
// router.get("/product/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).render("404", { message: "Product not found" });
//     }

//     // Safe thumbnails
//     const thumbnails =
//       Array.isArray(product.thumbnails) && product.thumbnails.length > 0
//         ? product.thumbnails
//         : [product.img];

//     res.render("product", {
//       name: product.name,
//       price: product.price,
//       img: product.img,
//       thumbnails,
//       design: product.design || "Classic Design",
//       material: product.material || "Gold Plated",
//       occasion: product.occasion || "Party, Wedding",
//       description: product.description || "Beautiful handcrafted jewelry piece.",
//       itemDescription: product.itemDescription || "Elegant and timeless design perfect for any occasion.",
//     });
//   } catch (err) {
//     console.error("❌ Error fetching product by ID:", err);
//     res.status(500).render("404", { message: "Server error while loading product" });
//   }
// });

// /* ---------------------- BACKWARD COMPATIBLE FALLBACK ---------------------- */
// // ✅ 2️⃣ View product via query params (old style — optional)
// router.get("/product", (req, res) => {
//   const { name, price, img } = req.query;

//   if (!name || !price || !img) {
//     return res.status(404).render("404", { message: "Missing product details" });
//   }

//   res.render("product", {
//     name,
//     price,
//     img,
//     thumbnails: [img],
//     design: "Classic Design",
//     material: "Gold Plated",
//     occasion: "Wedding, Party, Festive",
//     description: "Perfect gold ring for all occasions.",
//     itemDescription: "Elegant and timeless design.",
//   });
// });

// /* ----------------------------- CHECKOUT PAGE ----------------------------- */
// router.get("/checkout", (req, res) => {
//   const { name, price, img, qty } = req.query;

//   if (req.query.single === "true" && name && price && img) {
//     return res.render("checkout", {
//       cart: [{ name, price, img, qty: qty || 1 }],
//     });
//   }

//   // Empty cart view
//   res.render("checkout", { cart: [] });
// });

// export default router;




// routes/pages.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/* ✅ Product Details Page — /product/:id */
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).render("404", { message: "Product not found" });
    }

    const thumbnails =
      Array.isArray(product.thumbnails) && product.thumbnails.length > 0
        ? product.thumbnails
        : [product.img];

    res.render("product", {
      name: product.name,
      price: product.price,
      img: product.img,
      thumbnails,
      design: product.design || "Classic Design",
      material: product.material || "Gold Plated",
      occasion: product.occasion || "Party, Wedding",
      description:
        product.description || "Beautiful handcrafted jewelry piece.",
      itemDescription:
        product.itemDescription ||
        "Elegant and timeless design perfect for any occasion.",
    });
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res
      .status(500)
      .render("404", { message: "Server error while loading product" });
  }
});

/* ✅ Checkout Page — /checkout */
router.get("/checkout", (req, res) => {
  const { name, price, img, qty } = req.query;

  // If user clicked Buy Now
  if (req.query.single === "true" && name && price && img) {
    return res.render("checkout", {
      cart: [{ name, price, img, qty: qty || 1 }],
    });
  }

  // Otherwise show full cart
  res.render("checkout", { cart: [] });
});

export default router;
