const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true },
  totalAmount: { type: String, required: true },
  items: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      title: String,
      description: String,
      price: Number,
      discountPercentage: Number,
      rating: Number,
      stock: Number,
      brand: String,
      category: String,
      thumbnail: String,
      images: [String],
      quantity: Number,
    },
  ],
  createdDate: { type: Date, required: true },
  mobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: "Please enter a valid 10-digit mobile number",
    },
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = { Order };
