const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Eva ke sab responses yahan store hain - different categories mein
const chatResponses = {
  greetings: [
    "Hello! 👋 I'm Eva, your intelligent shopping assistant. How can I help you today?",
    "Hi there! I'm Eva, ready to help you with your shopping needs. What can I assist you with?",
    "Welcome! I'm Eva, your virtual shopping companion. How may I help you today?"
  ],
  orderHelp: [
    "To place an order: 1) Browse products 2) Add to cart 3) Proceed to checkout 4) Enter shipping details 5) Complete payment. Need help with any specific step?",
    "Ordering is easy! Just browse our products, add what you like to cart, and checkout. Would you like me to guide you through any particular step?"
  ],
  payment: [
    "We accept multiple payment methods: 💳 Credit/Debit Cards, 📱 UPI, 💰 PayPal, and 🏦 Net Banking. All payments are secure and encrypted.",
    "Payment options include cards, UPI, PayPal, and net banking. Your payment information is always protected with bank-level security."
  ],
  delivery: [
    "Standard delivery: 3-5 business days. Express delivery: 1-2 days (available for select products). Track your order in real-time from 'My Orders'.",
    "We offer standard (3-5 days) and express (1-2 days) delivery. Look for the 'Fast Delivery' badge while shopping for express options."
  ],
  refund: [
    "To request a refund: 1) Go to 'My Orders' 2) Select the order 3) Click 'Request Refund' 4) Choose reason 5) Submit. Refunds are processed within 3-5 business days.",
    "Refund requests can be made from your order history. Select the order and click 'Request Refund'. We process refunds within 3-5 business days."
  ],
  cancel: [
    "To cancel an order: 1) Go to 'My Orders' 2) Find the order 3) Click 'Cancel Order' 4) Confirm cancellation. Note: Orders in shipping cannot be cancelled.",
    "You can cancel orders from your order history. Just select the order and click 'Cancel Order'. Orders already in transit cannot be cancelled."
  ],
  profile: [
    "To update your profile: 1) Go to Account Settings 2) Click 'Edit Profile' 3) Update information 4) Save changes. You can also change your profile picture there.",
    "Profile updates can be made in Account Settings. You can change your name, email, address, and profile picture from there."
  ],
  tracking: [
    "Track your order: 1) Go to 'My Orders' 2) Find your order 3) Click 'Track Order' for real-time updates. You'll also receive email notifications.",
    "You can track orders from your order history. Click 'Track Order' for live updates, or check your email for shipping notifications."
  ],
  contact: [
    "Need human support? Contact us at: 📧 support@ecommerce.com 📞 1-800-SHOP-NOW 💬 Live chat available 24/7",
    "For immediate assistance, call us at 1-800-SHOP-NOW or email support@ecommerce.com. Our team is available 24/7."
  ],
  thanks: [
    "You're very welcome! 😊 I'm here whenever you need help. Happy shopping!",
    "Glad I could help! Don't hesitate to ask if you need anything else. Enjoy your shopping!",
    "My pleasure! Feel free to reach out anytime. Have a great day! 🛍️"
  ],
  complaint: [
    "I'm sorry to hear about your issue. Let me help you resolve this. Can you provide more details about what happened?",
    "I understand your frustration. Let's work together to fix this. What specific problem are you experiencing?"
  ],
  escalation: [
    "I'm connecting you to a human agent who can better assist with your specific needs. Please wait a moment...",
    "Let me transfer you to our customer service team for personalized assistance."
  ],
  default: [
    "I'm not sure I understood that. Could you rephrase or ask about orders, payments, delivery, refunds, or account settings?",
    "I didn't catch that. Try asking about: 📦 Orders, 💳 Payments, 🚚 Delivery, 💰 Refunds, or ⚙️ Account settings.",
    "Let me help you better. You can ask about: shopping, orders, payments, delivery, refunds, or account help."
  ]
};

// User context store karta hai - conversation memory ke liye
let userContext = {};

// Conversation memory - user ke sab interactions store karta hai
let conversationMemory = {};

// Random response pick karta hai category se
function getRandomResponse(category) {
  const responses = chatResponses[category] || chatResponses.default;
  return responses[Math.floor(Math.random() * responses.length)];
}

// User ke message ka sentiment analyze karta hai - positive, negative, neutral
function analyzeSentiment(message) {
  const lowerMessage = message.toLowerCase();
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'like', 'happy', 'satisfied', 'thank'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'frustrated', 'disappointed', 'complaint'];

  let sentiment = 'neutral';
  let score = 0;

  // Positive words count karta hai
  positiveWords.forEach(word => {
    if (lowerMessage.includes(word)) score += 1;
  });

  // Negative words count karta hai
  negativeWords.forEach(word => {
    if (lowerMessage.includes(word)) score -= 1;
  });

  // Score ke hisab se sentiment decide karta hai
  if (score > 0) sentiment = 'positive';
  else if (score < 0) sentiment = 'negative';

  return sentiment;
}

// User ke message ko analyze karta hai - kya puch raha hai
function analyzeMessage(message, userId) {
  const lowerMessage = message.toLowerCase();
  const sentiment = analyzeSentiment(message);

  // Conversation memory mein store karta hai
  if (!conversationMemory[userId]) {
    conversationMemory[userId] = {
      messages: [],
      topics: new Set(),
      sentiment: 'neutral',
      lastInteraction: Date.now()
    };
  }

  // Message ko memory mein add karta hai
  conversationMemory[userId].messages.push({
    text: message,
    sentiment: sentiment,
    timestamp: Date.now()
  });

  // Overall sentiment update karta hai
  conversationMemory[userId].sentiment = sentiment;
  conversationMemory[userId].lastInteraction = Date.now();

  // Agar negative sentiment hai aur multiple messages hain to escalation
  if (sentiment === 'negative' && conversationMemory[userId].messages.length > 2) {
    return 'escalation';
  }

  // Different keywords check karta hai message mein
  // Greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    conversationMemory[userId].topics.add('greeting');
    return 'greetings';
  }

  // Order related
  if (lowerMessage.includes('order') && (lowerMessage.includes('place') || lowerMessage.includes('how') || lowerMessage.includes('buy'))) {
    conversationMemory[userId].topics.add('ordering');
    return 'orderHelp';
  }

  // Payment related
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('upi')) {
    conversationMemory[userId].topics.add('payment');
    return 'payment';
  }

  // Delivery related
  if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping') || lowerMessage.includes('track') || lowerMessage.includes('when')) {
    conversationMemory[userId].topics.add('delivery');
    return 'delivery';
  }

  // Refund related
  if (lowerMessage.includes('refund') || lowerMessage.includes('return') || lowerMessage.includes('money back')) {
    conversationMemory[userId].topics.add('refund');
    return 'refund';
  }

  // Cancel related
  if (lowerMessage.includes('cancel') || lowerMessage.includes('cancel order')) {
    conversationMemory[userId].topics.add('cancellation');
    return 'cancel';
  }

  // Profile related
  if (lowerMessage.includes('profile') || lowerMessage.includes('account') || lowerMessage.includes('settings')) {
    conversationMemory[userId].topics.add('profile');
    return 'profile';
  }

  // Tracking related
  if (lowerMessage.includes('track') || lowerMessage.includes('where') || lowerMessage.includes('status')) {
    conversationMemory[userId].topics.add('tracking');
    return 'tracking';
  }

  // Contact related
  if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('human')) {
    conversationMemory[userId].topics.add('support');
    return 'contact';
  }

  // Complaint related
  if (lowerMessage.includes('complaint') || lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('wrong')) {
    conversationMemory[userId].topics.add('complaint');
    return 'complaint';
  }

  // Thanks
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    conversationMemory[userId].topics.add('gratitude');
    return 'thanks';
  }

  return 'default';
}

// Personalized response banata hai user ke context ke hisab se
function getPersonalizedResponse(responseType, userId) {
  const context = conversationMemory[userId];
  let response = getRandomResponse(responseType);

  // Agar user ka context hai to personalization add karta hai
  if (context && context.messages.length > 1) {
    if (context.sentiment === 'positive') {
      response += " I'm glad I could help! 😊";
    } else if (context.sentiment === 'negative') {
      response += " I understand this might be frustrating. Let me help you resolve this.";
    }

    // Agar multiple topics hain to related help offer karta hai
    if (context.topics.size > 1) {
      response += " Is there anything else I can help you with today?";
    }
  }

  return response;
}

// Main chat endpoint - user ka message receive karta hai
app.post('/', (req, res) => {
  const userMessage = req.body.message;
  const userId = req.body.userId || 'anonymous';

  // Message analyze karta hai aur response type decide karta hai
  const responseType = analyzeMessage(userMessage, userId);
  const reply = getPersonalizedResponse(responseType, userId);

  // Context store karta hai future ke liye
  userContext[userId] = {
    lastMessage: userMessage,
    lastResponseType: responseType,
    timestamp: Date.now()
  };

  // Typing delay add karta hai - message length ke hisab se
  const typingDelay = Math.min(Math.max(userMessage.length * 20, 500), 2000);

  setTimeout(() => {
    res.json({
      reply,
      responseType,
      suggestions: getSuggestions(responseType, userId),
      sentiment: conversationMemory[userId]?.sentiment || 'neutral'
    });
  }, typingDelay);
});

// Suggestions generate karta hai response type ke hisab se
function getSuggestions(responseType, userId) {
  const context = conversationMemory[userId];
  const baseSuggestions = {
    orderHelp: ['How to track orders?', 'Payment methods', 'Delivery options'],
    payment: ['Order help', 'Delivery info', 'Account settings'],
    delivery: ['Track my order', 'Order status', 'Contact support'],
    refund: ['Cancel order', 'Contact support', 'Order tracking'],
    cancel: ['Refund policy', 'Track order', 'Contact support'],
    profile: ['Order history', 'Payment methods', 'Delivery addresses'],
    tracking: ['Order status', 'Contact support', 'Account settings'],
    contact: ['Order help', 'Payment info', 'Delivery options'],
    complaint: ['Contact human agent', 'Refund request', 'Order cancellation'],
    escalation: ['Wait for agent', 'Alternative contact', 'Email support'],
    default: ['How to order?', 'Payment methods', 'Track order', 'Contact support']
  };

  let suggestions = baseSuggestions[responseType] || baseSuggestions.default;

  // Context ke hisab se additional suggestions add karta hai
  if (context && context.topics.size > 0) {
    const topics = Array.from(context.topics);
    if (topics.includes('ordering') && !suggestions.includes('Track my order')) {
      suggestions.push('Track my order');
    }
    if (topics.includes('payment') && !suggestions.includes('Delivery options')) {
      suggestions.push('Delivery options');
    }
  }

  return suggestions.slice(0, 3); // Maximum 3 suggestions
}

// Suggestions endpoint - frontend ke liye
app.get('/suggestions', (req, res) => {
  const suggestions = [
    'How do I place an order?',
    'What payment methods do you accept?',
    'How can I track my order?',
    'How do I request a refund?',
    'How do I cancel an order?',
    'How do I update my profile?',
    'What are your delivery options?',
    'How do I contact support?',
    'I have a complaint',
    'I need human assistance'
  ];

  res.json({ suggestions });
});

// Analytics endpoint - conversation data ke liye
app.get('/analytics/:userId', (req, res) => {
  const userId = req.params.userId;
  const context = conversationMemory[userId];

  if (!context) {
    return res.json({ message: 'No conversation history found' });
  }

  res.json({
    messageCount: context.messages.length,
    topics: Array.from(context.topics),
    sentiment: context.sentiment,
    lastInteraction: context.lastInteraction
  });
});

// Old conversation data clean karta hai - 24 hours ke baad
setInterval(() => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  Object.keys(conversationMemory).forEach(userId => {
    if (now - conversationMemory[userId].lastInteraction > oneDay) {
      delete conversationMemory[userId];
    }
  });
}, 60 * 60 * 1000); // Har hour mein run karta hai

module.exports = app;
