const express = require("express");
const path = require('path')
const router = express.Router();
const homeController = require("../controllers/home.controller");
const authenticateToken = require("../middleware/auth.middleware");
const jwt = require("jsonwebtoken");


router.get("/",authenticateToken ,homeController.renderHomePage);
router.get("/About",authenticateToken  ,homeController.renderAboutPage);
  
module.exports = router;
