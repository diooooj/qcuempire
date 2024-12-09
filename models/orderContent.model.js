const mongoose = require("mongoose");

const OrderContent = mongoose.Schema({
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

      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: false
      }
})

const orderContent = mongoose.model("OrderContent", OrderContent);

module.exports = orderContent;
