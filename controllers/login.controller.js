const fs = require("fs");
const path = require("path");
const { renderPage } = require("../utils/login.pagerender");

const renderLoginPage = async (req, res) => {
    try{
      const pagePath = path.join(__dirname, "../views/pages/login/index.html");
      const pageContent = fs.readFileSync(pagePath, "utf-8");
  
      const fullPage = renderPage(pageContent, "Home", "home");
      res.status(200).send(fullPage)
    }
    catch(error) {
      res.status(500).json({ message: error.message});
    }
  }

  module.exports = {
    renderLoginPage
  }