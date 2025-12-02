// routes/admin.js
import express from "express";
import bcrypt from "bcrypt";
import Product from "../models/Product.js";
import Admin from "../models/Admin.js";
import upload from "../config/multer.js";
import Order from "../models/Order.js"; // ✅ Make sure this import is at the top


const router = express.Router();

// ------------------- ADMIN LOGIN -------------------

// ✅ Admin Login Page
router.get("/login", (req, res) => {
  res.render("admin/login", { error: null });
});

// ✅ Handle Admin Login (POST)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.render("admin/login", { error: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.render("admin/login", { error: "Invalid password" });
    }

    // ✅ Save admin info to session
    req.session.admin = {
      username: admin.username,
      id: admin._id,
      isAdmin: true,
    };

    console.log("🟢 Admin logged in:", req.session.admin);
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("❌ Admin login failed:", err);
    res.render("admin/login", { error: "Something went wrong. Try again." });
  }
});


// ✅ Admin Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
});

// ✅ Middleware to protect admin routes & prevent browser caching
export function requireAdmin(req, res, next) {
  if (!req.session.admin || !req.session.admin.isAdmin) {
    return res.redirect("/admin/login");
  }
  next();
}



// ------------------- LOGOUT -------------------

// Preferred: Logout via POST (safer)
router.post("/logout", (req, res) => {
  // destroy session and clear cookie
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session on logout:", err);
      // still try to clear cookie and redirect
      res.clearCookie("connect.sid");
      return res.redirect("/admin/login");
    }
    res.clearCookie("connect.sid"); // default cookie name for express-session
    res.redirect("/admin/login");
  });
});

// Optional GET fallback (if you still want to support GET logout)
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    res.redirect("/admin/login");
  });
});



// ------------------- DASHBOARD -------------------

// ------------------- DASHBOARD & PROTECTED ROUTES -------------------

// Use requireAdmin middleware on protected routes, e.g.:
router.get("/dashboard", requireAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
      res.render("admin/dashboard", { 
      products, 
      admin: req.session.admin.username 
    });

  } catch (err) {
    console.error("Failed to load dashboard:", err);
    res.status(500).send("Error loading admin dashboard");
  }
});

// ✅ Add Product Page
router.get("/add-product", requireAdmin, (req, res) => {
  res.render("admin/add-product");
});

// ✅ Handle Add Product
router.post("/add-product", requireAdmin, upload.array("images", 4), async (req, res) => {
  try {
    const { name, price, category, design, material, occasion, description, itemDescription } = req.body;
    const imageUrls = req.files.map(file => file.path);

    const product = new Product({
      name,
      price,
      category: category || "all",
      design,
      material,
      occasion,
      description,
      itemDescription,
      img: imageUrls[0] || "https://placehold.co/600x400?text=No+Image",
      thumbnails: imageUrls,
    });

    await product.save();
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("❌ Add product failed:", err);
    res.status(500).send("Error adding product");
  }
});

// ✅ Delete Product
router.post("/delete/:id", requireAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    console.log(`🗑️ Deleted product ${req.params.id}`);
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).send("Error deleting product");
  }
});


// ✅ Admin orders page
router.get("/orders", async (req, res) => {
  if (!req.session.admin) {
    console.log("🔴 Admin not logged in — redirecting");
    return res.redirect("/admin/login");
  }

  try {
    const orders = await Order.find().sort({ date: -1 });
    res.render("admin/orders", { orders });
  } catch (err) {
    console.error("❌ Error loading orders:", err);
    res.status(500).send("Error loading orders");
  }
});


// ✅ Delete an order by ID
router.post("/orders/delete/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    console.log("🗑️ Deleted order:", req.params.id);
    return res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to delete order:", err);
    return res.status(500).json({ success: false });
  }
});



export default router;
