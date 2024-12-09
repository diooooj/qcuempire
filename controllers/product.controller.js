const Product = require("../models/product.model");
const fs = require("fs");
const path = require("path");
const { renderPage } = require("../utils/product.pagerender");


const renderProductsPage = async (req, res) => {
  try{
    const products = await Product.find({});

    const productCards = products
    .map(
      (product) => `
      <a href="/products/${product._id}" class="card">
        <img src="${product.image ||"/images/cheese.svg"}" alt="${product.name}">
        <h2 class="shadow">${product.name}</h2>
        <p>Stock: ${product.stock}</p>
      </a>`
    )
    .join("");

    const pagePath = path.join(__dirname, "../views/pages/products/products.html");
    let pageContent = fs.readFileSync(pagePath, "utf-8");
    pageContent = pageContent.replace("<!-- PRODUCTS_PLACEHOLDER -->", productCards);

    const fullPage = renderPage(pageContent, "Products", "products");
    res.status(200).send(fullPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const renderDetailsPage = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const pagePath = path.join(__dirname, "../views/pages/products/details.html");
    let pageContent = fs.readFileSync(pagePath, "utf-8");

    pageContent = pageContent
      .replace(/<!-- NAME -->/g, product.name || "Unnamed Product")
      .replace(/<!-- DETAILS -->/g, product.description || "No details available.")
      .replace(/<!-- STOCK -->/g, product.stock?.toString() || "N/A")
      .replace(/<!-- PRICE -->/g, product.price?.toFixed(2) || "0.00")
      .replace(/<!-- PRODUCTID -->/g, product._id);

    const fullPage = renderPage(pageContent, `${product.name} Details`, "products");
    res.status(200).send(fullPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getProductsApi = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
    renderProductsPage,
    renderDetailsPage,
    getProductsApi
};