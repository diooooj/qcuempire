const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authenticateToken = require("../middleware/auth.middleware");
const jwt = require("jsonwebtoken");

const authorizeRole = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

router.get("/", authenticateToken, authorizeRole("user"), productController.renderProductsPage);
router.get("/:id", authenticateToken, authorizeRole("user"), productController.renderDetailsPage);

module.exports = router;
