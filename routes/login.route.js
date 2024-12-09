const express = require("express");
const path = require('path')
const router = express.Router();
const loginController = require("../controllers/login.controller");
const jwt = require("jsonwebtoken");

router.get("/", loginController.renderLoginPage);

module.exports = router;