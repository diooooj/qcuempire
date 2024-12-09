const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress' ,'Completed', 'Cancelled'],
    default: 'Pending'
  }
},{ timestamps: true });

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
