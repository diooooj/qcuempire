const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { salesPage, loginEntrep, ordersPage } = require("../controllers/entrep.controller");
const authenticateToken = require("../middleware/auth.middleware");


const authorizeRole = (requiredRole) => (req, res, next) => {
  if (req.entrep.role !== requiredRole) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};


router.get("/", authenticateToken, authorizeRole("entrepreneur"), salesPage);
router.get("/orders", authenticateToken, authorizeRole("entrepreneur"), ordersPage);

router.post("/login", loginEntrep);

module.exports = router;
