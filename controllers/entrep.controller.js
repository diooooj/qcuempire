const User = require("../models/entrep.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { renderPage } = require("../utils/entrep.pagerender");
const path = require("path");
const fs = require("fs");

const loginEntrep = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.redirect(
        `/login?error=${encodeURIComponent(
          "Invalid email or password"
        )}&form=entrepreneur`
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect(
        `/login?error=${encodeURIComponent(
          "Invalid email or password"
        )}&form=entrepreneur`
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "entrepreneur" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.redirect("/entrep/");
  } catch (error) {
    res.redirect(`/login?error=${encodeURIComponent(error.message)}&form=entrepreneur`);
  }
};

const salesPage = async (req, res) => {
  try {
    const pagePath = path.join(__dirname, "../views/pages/entrep/index.html");
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    const fullPage = renderPage(pageContent, "Sales", "sales");
    res.status(200).send(fullPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ordersPage = async (req, res) => {
    try {
      const pagePath = path.join(__dirname, "../views/pages/entrep/orders.html");
      const pageContent = fs.readFileSync(pagePath, "utf-8");
  
      const fullPage = renderPage(pageContent, "Orders", "orders");
      res.status(200).send(fullPage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = {
  salesPage,
  loginEntrep,
  ordersPage
};
