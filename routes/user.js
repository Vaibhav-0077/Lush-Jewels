// routes/user.js
import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Order from "../models/Order.js";
// import { requireUserLogin } from "../middleware/auth.js"; // middleware



const router = express.Router();

// router.get("/ping", (req, res) => {
//   console.log("✅ /user/ping route hit");
//   res.send("pong");
// });

router.get("/is-logged-in", (req, res) => {
  res.json({ loggedIn: !!req.session.user });
});


// // ✅ Login Page
// router.get("/login", (req, res) => {
//   res.render("user/login", { error: null });
// });

// ✅ GET Login Page
// ✅ GET Login Page
router.get("/login", (req, res) => {
  const message = req.query.message || null;
  res.render("user/login", { error: null, message });
});

// ✅ POST Login Page
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("user/login", { error: "Invalid email or password", message: null });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("user/login", { error: "Invalid email or password", message: null });
    }

    // ✅ Login success
    // ✅ Login success
    // ✅ Successful login
    // req.session.user = {
    //   _id: user._id,
    //   name: user.name,
    //   email: user.email,
    // };
    // console.log("🟢 User logged in:", req.session.user);
    // res.redirect("/");

    req.session.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email
    };

    req.session.save(err => {
      if (err) {
        console.error("⚠️  Session save error:", err);
        return res.render("user/login", { error: "Login failed, try again." });
      }
      res.redirect("/"); // now cookie + session synced
    });



  } catch (err) {
    console.error("❌ Login error:", err);
    res.render("user/login", { error: "Server error. Try again later.", message: null });
  }
});



// ✅ Signup Page
router.get("/signup", (req, res) => {
  res.render("user/signup", { error: null });
});

// ✅ Handle Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.render("user/signup", { error: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash });

    req.session.user = { name, email };
    res.redirect("/");
  } catch (err) {
    console.error("❌ Signup failed:", err);
    res.render("user/signup", { error: "Something went wrong. Try again." });
  }
});

// ✅ Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});




//========================== ✅ Checkout Page — only for logged-in users==========================================
// ✅ Checkout Page — supports both Cart and Buy Now
// routes/user.js
// ✅ Checkout Page — supports both Cart and Buy Now
router.get("/checkout", requireUserLogin, (req, res) => {
  try {
    let singleItem = null;
    let isSingle = false;

    // 🟢 Detect "Buy Now" query parameters
    if (req.query.single === "true" && req.query.name && req.query.price) {
      isSingle = true;
      singleItem = {
        name: req.query.name,
        price: req.query.price,
        img: req.query.img || "",
        qty: parseInt(req.query.qty) || 1
      };
    }

    // Render checkout with both variables
    res.render("checkout", {
      user: req.session.user,
      singleItem,
      isSingle
    });
  } catch (err) {
    console.error("❌ Checkout render error:", err);
    res.status(500).send("Server error rendering checkout");
  }
});






// =================================== SAVE ORDER =======================================================================
// ✅ Save order when user clicks “Complete Order”
// ✅ Checkout route (save order for logged-in user)
router.post("/checkout", requireUserLogin, async (req, res) => {
  try {
    const { userInfo, items, totalAmount } = req.body;
    const userSession = req.session.user; // ✅ get current user

    if (!userSession || !userSession._id) {
      console.error("❌ Missing user info in session");
      return res.status(401).json({ success: false, message: "User not logged in" });
    }

    const newOrder = new Order({
      userId: userSession._id, // ✅ correctly link user
      userName: `${userInfo.fname} ${userInfo.lname}`,
      email: userInfo.email,
      phone: userInfo.phone,
      address: `${userInfo.address}, ${userInfo.landmark}`,
      city: userInfo.city,
      state: userInfo.state,
      pin: userInfo.pin,
      items: items.map(i => ({
        name: i.name,
        price: i.price,
        qty: i.qty,
        img: i.img,
      })),
      total: totalAmount,
      paymentMethod: userInfo.paymentMethod || "Cash on Delivery",
    });

    await newOrder.save();
    console.log("✅ Order saved for user:", userSession.email, "→", newOrder._id);

    res.json({ success: true, orderId: newOrder._id });
  } catch (err) {
    console.error("❌ Checkout save error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// ✅ User account page
router.get("/account", requireUserLogin, async (req, res) => {
  try {
    const user = req.session.user;
    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
    res.render("user/account", { user, orders });
  } catch (err) {
    console.error("❌ Account page error:", err);
    res.status(500).send("Server error");
  }
});





// ==========================✅ middleware/auth.js  (only login user can buy product)============================
export function requireUserLogin(req, res, next) {
  if (req.session && req.session.user) {
    // user is logged in
    return next();
  } else {
    // redirect to login page
    return res.redirect("/user/login?message=Please login to continue");
  }
}



export default router;
