const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const path = require("path");
const fs = require("fs");
const { renderPage } = require("../utils/product.pagerender");


const updateCartItemQuantity = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.query;

    if (!cartItemId || !quantity) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cartItem = await Cart.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = parsedQuantity;
    await cartItem.save();

    res.redirect("/cart");
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({ message: "An error occurred while updating cart item", error: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body; 

    const userId = req.user.id;
    const cartItem = await Cart.findOneAndDelete({ _id: productId, user: userId });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.redirect("/cart");
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "An error occurred while removing cart item", error: error.message });
  }
};

const cartPage = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.find({ user: userId }).populate("product");

    const total = cartItems.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);


    const cartRows = cartItems.map(
      (item) => `
              <tr>
          <td>
            <div class="cart-product-info">
              <img src="${item.productImage || "/images/cheese.svg"}" alt="${item.productName}" />
              <div>
                <h5 class="h5-1 shadow">P’KA CHIPS</h5>
                <p>Spicy Level:${item.product.name}</p>
                <p>Spicy Level:${item.spicyLevel}</p>
              </div>
            </div>
          </td>
          <td>₱${item.product.price}</td>
          <td>
            <div class="cart-quantity">
              <input
                type="number"
                value="${item.quantity}"
                min="1"
                id="quantity-${item.product._id}"
                onChange="manualQuantityUpdate('${item._id}', this.value)"
                onkeydown="handleEnterKey(event, '${item._id}', this.value)"
              />
            </div>
          </td>
          <td>₱${item.quantity * item.product.price}</td>
          <td><a href="#" onclick="removeItem('${item._id}')">Delete</a></td>
        </tr>`
    ).join("");

    const pagePath = path.join(__dirname, "../views/pages/cart/cart.html");
    let pageContent = fs.readFileSync(pagePath, "utf-8");
    pageContent = pageContent
    .replace("<!-- Placeholder for cart items -->", cartRows)
    .replace("<!-- Placeholder for total amount -->", total );

    const fullPage = renderPage(pageContent, "Cart", "cart");
    res.status(200).send(fullPage);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const addToCart = async (req, res) => {
  try {
    const productId = req.body.productId;
    const spicyLevel = Array.isArray(req.body.spicyLevel)
      ? req.body.spicyLevel[0]
      : req.body.spicyLevel || "none";
    const quantity = parseInt(req.body.quantity, 10);
    const userId = req.user.id;

    if (!productId || !spicyLevel || isNaN(quantity) || quantity <= 0) {
      res.redirect("/products");
    }

    const existing = await Cart.findOne({
      product: productId,
      user: userId,
      spicyLevel,
    });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      res.redirect("/products");
    }

    const cart = new Cart({
      user: userId,
      product: productId,
      spicyLevel,
      quantity,
    });

    await cart.save();
    res.redirect("/products");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const checkOutPage = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.find({ user: userId }).populate("product");

    // Check if the cart is empty
    if (cartItems.length === 0) {
      return res.redirect('/cart?empty=true');
    }

    const total = cartItems.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

    const cartRows = cartItems.map(
      (item) => `
        <tr>
          <td>
            <div class="cart-product-info">
              <img src="${item.productImage || "/images/cheese.svg"}" alt="${item.productName}" />
              <div>
                <h5 class="h5-1 shadow">P’KA CHIPS</h5>
                <p>Spicy Level: ${item.product.name}</p>
                <p>Spicy Level: ${item.spicyLevel}</p>
              </div>
            </div>
          </td>
          <td>${item.quantity}</td>
          <td>₱${item.quantity * item.product.price}</td>
        </tr>`
    ).join("");

    const pagePath = path.join(__dirname, "../views/pages/cart/checkout.html");
    let pageContent = fs.readFileSync(pagePath, "utf-8");
    pageContent = pageContent
      .replace("<!-- Placeholder for cart items -->", cartRows)
      .replace("<!-- Placeholder for total amount -->", total);

    const fullPage = renderPage(pageContent, "Check Out", "checkout");
    res.status(200).send(fullPage); // Only send this response if the cart is not empty

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  cartPage,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  checkOutPage
};
