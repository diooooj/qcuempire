const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const OrderContent = require("../models/orderContent.model");

const getSmallestAvailableNumber = async () => {
    // Find all numbers in the orders collection
    const existingNumbers = await Order.find({}, "number").sort("number").lean();

    // Create a set of existing numbers
    const numberSet = new Set(existingNumbers.map(order => order.number));

    // Start from 1 and find the smallest missing positive number
    let smallestAvailable = 1;
    while (numberSet.has(smallestAvailable)) {
        smallestAvailable++;
    }

    return smallestAvailable;
};

const checkOut = async (req, res) => {
    try {
        const { locationCombined, selectedPaymentMethod } = req.body;
        const userId = req.user.id;

        const smallestAvailableNumber = await getSmallestAvailableNumber();

        const order = new Order({
            user: userId,
            location: locationCombined,
            paymentMethod: selectedPaymentMethod,
            status: "Pending",
            number: smallestAvailableNumber, 
        });
        await order.save();

        const cartItems = await Cart.find({ user: userId });

        const orderContents = cartItems.map(item => ({
            product: item.product,
            spicyLevel: item.spicyLevel,
            quantity: item.quantity,
            order: order._id,
        }));

        await OrderContent.insertMany(orderContents);

        // Clear the cart after checkout
        await Cart.deleteMany({ user: userId });

        res.status(200).json({ message: "Order placed successfully!" });
    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(500).json({ message: "An error occurred while processing your order." });
    }
};

module.exports = {
    checkOut,
};
