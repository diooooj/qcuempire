const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      spicyLevel: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },  
})

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
