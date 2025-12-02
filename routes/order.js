// routes/user.js  (or routes/order.js)
import express from "express";
import Order from "../models/Order.js"; // create below if you don't have it
// import Product from "../models/Product.js"; // optional, only if you want to validate product ids
const router = express.Router();

// POST /user/checkout
router.post("/checkout", async (req, res) => {
  try {
    // req.body expected: { userInfo: {...}, items: [...], totalAmount: Number, single: boolean }
    const { userInfo, items, totalAmount, single } = req.body;

    if (!userInfo || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing order details" });
    }

    // Optional: validate items or map product ids if you store them
    // const validatedItems = items.map(i => ({ name: i.name, price: i.price, qty: i.qty, img: i.img }));

    const orderDoc = new Order({
      userName: `${userInfo.fname} ${userInfo.lname}`,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
      city: userInfo.city,
      state: userInfo.state,
      pin: userInfo.pin,
      items: items.map(it => ({
        name: it.name,
        price: it.price,
        img: it.img,
        qty: it.qty || 1
      })),
      total: Number(totalAmount),
      date: new Date()
    });

    await orderDoc.save();

    return res.status(201).json({ success: true, message: "Order saved", orderId: orderDoc._id });
  } catch (err) {
    console.error("❌ Checkout save error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
