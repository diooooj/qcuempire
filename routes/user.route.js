const express = require("express");
const router = express.Router();
const { registerUser, loginUser, userProfile, saveUserProfile, uploadImage, deleteImage } = require("../controllers/user.controller");
const authenticateToken = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const jwt = require("jsonwebtoken");

// Role-based authorization middleware
const authorizeRole = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/saveChanges", authenticateToken, authorizeRole("user"), upload.single("profilePicture"), saveUserProfile);
router.get("/", authenticateToken, authorizeRole("user"), userProfile);
router.get("/protected-route", authenticateToken, authorizeRole("user"), (req, res) => {
  res.status(200).json({ message: "You have access to this route", user: req.user });
});

router.get("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.redirect(`/login`);
});

module.exports = router;
