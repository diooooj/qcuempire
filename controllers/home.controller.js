const fs = require("fs");
const path = require("path");
const { renderPage } = require("../utils/home.pagerender");

const renderHomePage = async (req, res) => {
  try{
    const pagePath = path.join(__dirname, "../views/pages/index.html");
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    const fullPage = renderPage(pageContent, "Home", "home");
    res.status(200).send(fullPage)
  }
  catch(error) {
    res.status(500).json({ message: error.message});
  }
}

const renderAboutPage = async (req, res) => {
  try{
    const pagePath = path.join(__dirname, "../views/pages/about.html");
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    const fullPage = renderPage(pageContent, "About", "about");
    res.status(200).send(fullPage)
  }
  catch(error) {
    res.status(500).json({ message: error.message});
  }
}

module.exports = {
  renderHomePage,
  renderAboutPage
};
