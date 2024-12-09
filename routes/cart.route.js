const express = require("express");
const router = express.Router();
const { cartPage, checkOutPage, addToCart, updateCartItemQuantity, removeCartItem } = require("../controllers/cart.controller");
const authenticateToken = require("../middleware/auth.middleware");
const jwt = require("jsonwebtoken");


// Role-based authorization middleware
const authorizeRole = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

router.get("/", authenticateToken, authorizeRole("user"), cartPage);
router.get("/checkout", authenticateToken, authorizeRole("user"), checkOutPage);
router.post("/add", authenticateToken, authorizeRole("user"), addToCart);
router.post("/update/:cartItemId", authenticateToken, authorizeRole("user"), updateCartItemQuantity);
router.post("/remove", authenticateToken, authorizeRole("user"), removeCartItem);

module.exports = router;
