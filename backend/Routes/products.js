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

module.exports = router;
