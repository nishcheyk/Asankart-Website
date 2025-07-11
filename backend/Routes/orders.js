const express = require("express");
const mongoose = require("mongoose");
const { Order } = require("../Models/orders.js");
const Product = require("../Models/products");
const router = express.Router();

// Post new order
// Create API
router.post("/create", async (req, res) => {
  try {
    const orderData = req.body.data;

    // Validate the mobile number (Ensure it is exactly 10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(orderData.mobileNumber)) {
      return res.status(400).json({ message: "Please enter a valid 10-digit mobile number." });
    }

    // Check if all items are in stock and update stock
    const items = orderData.items;
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(404).json({ message: `Product ${item._id} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Product ${product.title} is out of stock. Available: ${product.stock}` });
      }
    }

    // Update product stock
    const stockUpdatePromises = items.map(async (item) => {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { stock: -item.quantity },
      });
    });
    await Promise.all(stockUpdatePromises);

    // Create the new order with a default status of 'Pending'
    const newOrder = new Order({
      userID: orderData.userID,
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      address: orderData.address,
      city: orderData.city,
      country: orderData.country,
      zipCode: orderData.zipCode,
      totalAmount: orderData.totalAmount,
      items: orderData.items, // Assuming items is an array of objects
      createdDate: orderData.createdDate || new Date(),
      mobileNumber: orderData.mobileNumber, // Store mobile number
      orderStatus: 'Pending', // Default status when the order is created
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order saved to the database", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to save order to the database" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const allOrders = await Order.find().sort({ createdDate: -1 }); // Newest first
    res.status(200).json(allOrders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
});

// Get orders by user ID
router.get("/:userId", async (req, res) => {
  const userID = req.params.userId;

  try {
    const orderList = await Order.find({ userID: userID }).sort({ createdDate: -1 });
    res.status(200).json(orderList);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders for the user" });
  }
});

// Update order status (PUT route)
router.put("/:orderId/status", async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  // Validate order status
  const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(orderStatus)) {
    return res.status(400).json({ message: "Invalid status. Valid statuses are: 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

module.exports = router;
