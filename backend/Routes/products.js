const express = require("express");
const mongoose = require("mongoose");
const Product = require("../Models/products");
const { Order } = require("../Models/orders");
const router = express.Router();

// Get all products from the database
router.get("/", async (req, res) => {
  try {
    const productList = await Product.find().sort({ order: 1 });
    res.json(productList);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add this route BEFORE the '/:id' route to prevent CastError for 'meta'
router.get("/meta", async (req, res) => {
  try {
    const products = await Product.find();
    const prices = products.map((p) => p.price);
    const brands = [...new Set(products.map((p) => p.brand))];
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    res.json({ minPrice, maxPrice, brands });
  } catch (error) {
    console.error("Error fetching meta:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Create a new product
router.post("/create", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    req.body.data.order = count;
    const newProduct = new Product(req.body.data);
    await newProduct.save();
    res.send("Product saved to the database!");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update a product by ID
router.put("/update/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body.data,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }
    res.send("Product updated successfully!");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a product by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }
    res.send("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Handle product purchase and update stock
router.post("/purchase", async (req, res) => {
  const { items } = req.body.data;

  try {
    // Check if all items are in stock
    const productsToUpdate = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res
          .status(400)
          .send(`Product ${item.productId} is out of stock`);
      }
      productsToUpdate.push({
        id: item.productId,
        quantity: item.quantity,
      });
    }

    // Update product stock and create order
    const promises = productsToUpdate.map(async (product) => {
      await Product.findByIdAndUpdate(product.id, {
        $inc: { stock: -product.quantity },
      });
    });
    await Promise.all(promises);

    // Create order in the database (assuming Order model and DB setup)
    const newOrder = new Order(req.body.data);
    await newOrder.save();

    res.send("Purchase successful!");
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/reorder", async (req, res) => {
  const reordered = req.body.productIds;
  if (!Array.isArray(reordered)) {
    return res.status(400).send("Invalid productIds array");
  }
  try {
    // Fetch current orders from DB for these products
    const ids = reordered.map((p) => p._id || p);
    const products = await Product.find({ _id: { $in: ids } });
    const orderMap = {};
    products.forEach((p) => {
      orderMap[p._id.toString()] = p.order;
    });
    // Only update if order has changed
    const updates = reordered
      .map((productId, index) => {
        const id = productId._id || productId;
        if (orderMap[id] !== index) {
          return {
            updateOne: {
              filter: { _id: id },
              update: { $set: { order: index } },
            },
          };
        }
        return null;
      })
      .filter(Boolean);
    if (updates.length === 0) {
      return res.send("No products needed reordering.");
    }
    await Product.bulkWrite(updates);
    res.send("Products reordered successfully!");
  } catch (error) {
    console.error("Error reordering products:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add review to a product (only for users who have delivered orders)
router.post("/:id/review", async (req, res) => {
  try {
    const { id } = req.params;
    const { user, userName, rating, comment } = req.body;

    // Validate required fields
    if (!user || !rating || !comment) {
      return res.status(400).json({
        message: "Missing required fields: user, rating, and comment are required."
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5."
      });
    }

    // First check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user has a delivered order for this product
    const userOrders = await Order.find({
      userID: user,
      orderStatus: "Delivered"
    });

    if (userOrders.length === 0) {
      return res.status(403).json({
        message: "You haven't purchased any products yet, or none of your orders have been delivered. You can only review products you have purchased and received."
      });
    }

    const hasDeliveredOrder = userOrders.some(order => {
      // Parse items if it's a string
      const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');

      return items.some(item => {
        // Handle different possible item structures
        let itemId = null;

        // Check if item has _id field
        if (item._id) {
          itemId = item._id.toString();
        }
        // Check if item has id field
        else if (item.id) {
          itemId = item.id.toString();
        }
        // Check if item itself is the ID
        else if (typeof item === 'string') {
          itemId = item;
        }

        const productId = id.toString();

        return itemId === productId;
      });
    });

    if (!hasDeliveredOrder) {
      return res.status(403).json({
        message: "You can only review products that you have purchased and received. Please ensure you have bought this specific product and it has been delivered."
      });
    }

    // Check if user has already reviewed this product
    const hasAlreadyReviewed = product.reviews.some(review =>
      review.user === user || review.userName === userName
    );

    if (hasAlreadyReviewed) {
      return res.status(409).json({
        message: "You have already reviewed this product. You can only submit one review per product."
      });
    }

    const newReview = {
      user: user,
      userName: userName || "Anonymous",
      rating,
      comment,
      date: new Date()
    };

    product.reviews.push(newReview);
    // Update product rating to average of all reviews
    const totalRatings = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRatings / product.reviews.length;
    await product.save();

    res.status(201).json({
      message: "Review added successfully! Thank you for your feedback.",
      review: newReview
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Failed to add review. Please try again." });
  }
});

// Delete review from a product (only for the user who created it)
router.delete("/:id/review/:reviewId", async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const { user } = req.body;

    // Validate required fields
    if (!user) {
      return res.status(400).json({
        message: "User ID is required."
      });
    }

    // First check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the review
    const reviewIndex = product.reviews.findIndex(review =>
      review._id.toString() === reviewId && review.user === user
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        message: "Review not found or you don't have permission to delete this review"
      });
    }

    // Remove the review
    product.reviews.splice(reviewIndex, 1);
    await product.save();

    res.json({
      message: "Review deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Failed to delete review. Please try again." });
  }
});

// Debug endpoint to check user's order data
router.get("/debug/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userOrders = await Order.find({
      userID: userId
    });

    const deliveredOrders = userOrders.filter(order => order.orderStatus === "Delivered");

    res.json({
      totalOrders: userOrders.length,
      deliveredOrders: deliveredOrders.length,
      orders: userOrders.map(order => ({
        _id: order._id,
        orderStatus: order.orderStatus,
        items: order.items,
        createdDate: order.createdDate
      }))
    });
  } catch (error) {
    console.error("Error fetching debug data:", error);
    res.status(500).json({ message: "Failed to fetch debug data" });
  }
});

module.exports = router;
