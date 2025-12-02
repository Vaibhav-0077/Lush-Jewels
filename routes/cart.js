import express from "express";
const router = express.Router();

// Cart page route
router.get("/", (req, res) => {
  res.render("cart");
});

export default router;
