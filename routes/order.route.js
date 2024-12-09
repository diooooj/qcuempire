const express = require("express");
const router = express.Router();
const { checkOut } = require("../controllers/order.controller");
const authenticateToken = require("../middleware/auth.middleware");
const jwt = require("jsonwebtoken");

// Role-based authorization middleware
const authorizeRole = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

router.post("/checkout", authenticateToken, authorizeRole("user"), checkOut);

module.exports = router;
