// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import connectDB from "./config/db.js";
import categoryRoutes from "./routes/category.js";
import pageRoutes from "./routes/pages.js";
import cartRoutes from "./routes/cart.js";
import adminRoutes from "./routes/admin.js";
import expressListRoutes from "express-list-routes";
import Product from "./models/Product.js";
import userRoutes from "./routes/user.js";
import MongoStore from "connect-mongo";
// import orderRoutes from "./routes/order.js";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// ✅ EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // for uploaded images

// ✅ Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 3,
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",        // ✅ allows navigation from same site
      maxAge: 1000 * 60 * 60 * 24 * 3,
    },
  })
);

// app.use((req, res, next) => {
//   console.log("🔍 Incoming:", req.method, req.url);
//   console.log("  Cookie header:", req.headers.cookie);
//   console.log("  Session user:", req.session?.user || "❌ none");
//   next();
// });


// ✅ Add this small middleware right after the session setup:
// ✅ Make session globally available to all EJS views
app.use((req, res, next) => {
  res.locals.session = req.session || {};
  next();
});

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});


// ✅ ROUTES (Order is very important)
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/cart", cartRoutes);
app.use("/", pageRoutes);        // handles /product/:id, /checkout, /
app.use("/category", categoryRoutes); // category routes last


// app.use("/order", orderRoutes);//save user order



// ✅ Home page — show latest 8 products
app.get("/", async (req, res) => {
  try {
    const products = await Product.find().limit(8);
    res.render("index", { products });
  } catch (err) {
    console.error("❌ Failed to load products:", err);
    res.render("index", { products: [] });
  }
});


// 🚫 Prevent browsers from caching any admin pages
app.use((req, res, next) => {
  if (req.url.startsWith("/admin")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
});


// =============================================POLICIES PAGES ROUTE============================================
app.get("/privacy-policy", (req, res) => {
  res.render("policies/privacy-policy");
});

app.get("/terms", (req, res) => {
  res.render("policies/terms");
});

app.get("/refund-policy", (req, res) => {
  res.render("policies/refund-policy");
});

app.get("/shipping-policy", (req, res) => {
  res.render("policies/shipping-policy");
});

app.get("/help-center", (req, res) => {
  res.render("policies/help-center");
});


// 🧭 Debugging — list all routes in console
expressListRoutes(app, { prefix: "" });

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
