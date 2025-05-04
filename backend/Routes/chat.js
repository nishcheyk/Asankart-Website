const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/', (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let reply = "Sorry, I didn’t understand that. Can you rephrase?";

  if (userMessage.includes('hello') || userMessage.includes('hi')) {
    reply = "Hello! 👋 I'm Ava, your virtual assistant. How can I help you today?";
  } else if (userMessage.includes('refund')) {
    reply = "To request a refund, go to your Orders and select 'Request Refund'.";
  } else if (userMessage.includes('order status')) {
    reply = "You can track your order from the 'My Orders' section.";
  } else if (userMessage.includes('cancel')) {
    reply = "To cancel an order, go to your orders and select 'Cancel Order'.";
  } else if (userMessage.includes('payment')) {
    reply = "We accept cards, UPI, and PayPal. Let us know if there’s an issue.";
  } else if (userMessage.includes('profile') && userMessage.includes('picture')) {
    reply = "To change your profile picture, go to your Account Settings and upload a new image.";
  } else if (userMessage.includes('how to order')) {
    reply = "To place an order, just browse products, add them to cart, and proceed to checkout.";
  } else if (userMessage.includes('fast delivery') || userMessage.includes('express delivery')) {
    reply = "We offer express delivery for select products. Look for the 'Fast Delivery' badge while shopping.";
  } else if (userMessage.includes('thank you')) {
    reply = "You're welcome! Let me know if you need any more help 😊";
  }

  res.json({ reply });
});

module.exports = app;
