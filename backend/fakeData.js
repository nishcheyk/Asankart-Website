const mongoose = require("mongoose");
const Product = require("./Models/products");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/ECommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fakeProducts = [
  {
    title: "iPhone 15 Pro Max",
    description: "The most advanced iPhone ever with A17 Pro chip, titanium design, and pro camera system. Features 6.7-inch Super Retina XDR display, 48MP main camera, and all-day battery life.",
    price: 119999,
    discountPercentage: 5,
    rating: 4.8,
    stock: 50,
    brand: "Apple",
    category: "Smartphones",
    thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=face"
    ],
    order: 1,
    reviews: [
      {
        user: "Rahul Sharma",
        rating: 5,
        comment: "Amazing phone! The camera quality is outstanding and the battery life is incredible. Worth every penny.",
        date: new Date("2024-01-15")
      },
      {
        user: "Priya Patel",
        rating: 4,
        comment: "Great phone but a bit expensive. The performance is excellent and the design is beautiful.",
        date: new Date("2024-01-20")
      },
      {
        user: "Amit Kumar",
        rating: 5,
        comment: "Best iPhone I've ever owned. The titanium finish feels premium and the camera system is revolutionary.",
        date: new Date("2024-01-25")
      }
    ]
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    description: "Revolutionary smartphone with AI-powered features, 200MP camera, and S Pen integration. Features 6.8-inch Dynamic AMOLED display, Snapdragon 8 Gen 3, and 5000mAh battery.",
    price: 129999,
    discountPercentage: 8,
    rating: 4.7,
    stock: 35,
    brand: "Samsung",
    category: "Smartphones",
    thumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop&crop=face"
    ],
    order: 2,
    reviews: [
      {
        user: "Neha Singh",
        rating: 5,
        comment: "The S Pen is a game changer! AI features are incredible and the camera quality is top-notch.",
        date: new Date("2024-02-01")
      },
      {
        user: "Vikram Malhotra",
        rating: 4,
        comment: "Excellent phone with great features. The battery life is impressive and the display is stunning.",
        date: new Date("2024-02-05")
      },
      {
        user: "Anjali Desai",
        rating: 5,
        comment: "Love the AI features and the S Pen functionality. This phone exceeds all expectations!",
        date: new Date("2024-02-10")
      }
    ]
  },
  {
    title: "MacBook Pro 16-inch M3 Pro",
    description: "Powerful laptop with M3 Pro chip, 16-inch Liquid Retina XDR display, and up to 22 hours battery life. Perfect for professionals and creative work.",
    price: 249999,
    discountPercentage: 3,
    rating: 4.9,
    stock: 25,
    brand: "Apple",
    category: "Laptops",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&crop=face"
    ],
    order: 3,
    reviews: [
      {
        user: "Rajesh Mehta",
        rating: 5,
        comment: "Incredible performance! The M3 Pro chip is blazing fast and the display is absolutely stunning.",
        date: new Date("2024-01-10")
      },
      {
        user: "Sneha Reddy",
        rating: 5,
        comment: "Perfect for video editing and 3D rendering. The battery life is amazing and the build quality is premium.",
        date: new Date("2024-01-18")
      },
      {
        user: "Arjun Verma",
        rating: 4,
        comment: "Excellent laptop for development work. The performance is outstanding and the keyboard feels great.",
        date: new Date("2024-01-25")
      }
    ]
  },
  {
    title: "Dell XPS 15 Laptop",
    description: "Premium Windows laptop with Intel Core i9, 32GB RAM, 1TB SSD, and NVIDIA RTX 4070. Features 15.6-inch 4K OLED display and premium build quality.",
    price: 189999,
    discountPercentage: 12,
    rating: 4.6,
    stock: 30,
    brand: "Dell",
    category: "Laptops",
    thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&crop=face"
    ],
    order: 4,
    reviews: [
      {
        user: "Kavya Iyer",
        rating: 4,
        comment: "Great laptop for work and gaming. The OLED display is beautiful and the performance is solid.",
        date: new Date("2024-02-02")
      },
      {
        user: "Rohan Gupta",
        rating: 5,
        comment: "Excellent build quality and performance. The keyboard is comfortable and the trackpad is responsive.",
        date: new Date("2024-02-08")
      },
      {
        user: "Zara Khan",
        rating: 4,
        comment: "Perfect for creative work. The display is stunning and the performance handles everything I throw at it.",
        date: new Date("2024-02-15")
      }
    ]
  },
  {
    title: "Sony WH-1000XM5 Headphones",
    description: "Premium wireless noise-canceling headphones with industry-leading sound quality and 30-hour battery life. Features LDAC codec and multipoint connectivity.",
    price: 29999,
    discountPercentage: 15,
    rating: 4.8,
    stock: 60,
    brand: "Sony",
    category: "Audio",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&crop=face"
    ],
    order: 5,
    reviews: [
      {
        user: "Aditya Sharma",
        rating: 5,
        comment: "Incredible sound quality and noise cancellation! These headphones are worth every penny.",
        date: new Date("2024-01-05")
      },
      {
        user: "Meera Patel",
        rating: 4,
        comment: "Great headphones with excellent battery life. The noise cancellation works perfectly.",
        date: new Date("2024-01-12")
      },
      {
        user: "Karan Singh",
        rating: 5,
        comment: "Best headphones I've ever owned. The sound quality is amazing and they're so comfortable.",
        date: new Date("2024-01-20")
      }
    ]
  },
  {
    title: "Apple AirPods Pro 2",
    description: "Wireless earbuds with active noise cancellation, spatial audio, and sweat resistance. Features H2 chip and up to 6 hours listening time.",
    price: 24999,
    discountPercentage: 10,
    rating: 4.7,
    stock: 80,
    brand: "Apple",
    category: "Audio",
    thumbnail: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&crop=face"
    ],
    order: 6,
    reviews: [
      {
        user: "Nisha Reddy",
        rating: 5,
        comment: "Perfect earbuds! The noise cancellation is incredible and the sound quality is amazing.",
        date: new Date("2024-01-08")
      },
      {
        user: "Vivek Malhotra",
        rating: 4,
        comment: "Great earbuds with good battery life. The spatial audio feature is really impressive.",
        date: new Date("2024-01-15")
      },
      {
        user: "Ananya Desai",
        rating: 5,
        comment: "Love these earbuds! They fit perfectly and the sound quality is outstanding.",
        date: new Date("2024-01-22")
      }
    ]
  },
  {
    title: "Nike Air Jordan 1 Retro High",
    description: "Classic basketball sneakers with premium leather construction and iconic design. Features Air-Sole unit for lightweight cushioning and rubber outsole for durability.",
    price: 15999,
    discountPercentage: 0,
    rating: 4.9,
    stock: 40,
    brand: "Nike",
    category: "Shoes",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop&crop=face"
    ],
    order: 7,
    reviews: [
      {
        user: "Aryan Kumar",
        rating: 5,
        comment: "Classic design and great quality! These Jordans are absolutely perfect.",
        date: new Date("2024-01-03")
      },
      {
        user: "Ishaan Patel",
        rating: 5,
        comment: "Amazing shoes! The leather quality is premium and they're so comfortable.",
        date: new Date("2024-01-10")
      },
      {
        user: "Riya Sharma",
        rating: 4,
        comment: "Great shoes with iconic design. Perfect for both style and comfort.",
        date: new Date("2024-01-18")
      }
    ]
  },
  {
    title: "Adidas Ultraboost 22",
    description: "Premium running shoes with responsive Boost midsole and Primeknit upper. Features Continental rubber outsole and energy-returning cushioning for maximum comfort.",
    price: 18999,
    discountPercentage: 20,
    rating: 4.6,
    stock: 55,
    brand: "Adidas",
    category: "Shoes",
    thumbnail: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop&crop=face"
    ],
    order: 8,
    reviews: [
      {
        user: "Priyanka Singh",
        rating: 4,
        comment: "Excellent running shoes! The Boost technology provides amazing energy return.",
        date: new Date("2024-01-07")
      },
      {
        user: "Rahul Verma",
        rating: 5,
        comment: "Best running shoes I've ever worn. Super comfortable and great for long runs.",
        date: new Date("2024-01-14")
      },
      {
        user: "Neha Iyer",
        rating: 4,
        comment: "Great shoes with excellent cushioning. Perfect for daily runs and training.",
        date: new Date("2024-01-21")
      }
    ]
  },
  {
    title: "Samsung 65-inch QLED 4K TV",
    description: "Premium QLED TV with Quantum Dot technology, HDR10+, and Object Tracking Sound. Features 4K resolution, 120Hz refresh rate, and smart TV capabilities.",
    price: 89999,
    discountPercentage: 25,
    rating: 4.7,
    stock: 20,
    brand: "Samsung",
    category: "TVs",
    thumbnail: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=face"
    ],
    order: 9,
    reviews: [
      {
        user: "Arjun Malhotra",
        rating: 5,
        comment: "Incredible picture quality! The QLED technology makes colors pop and the sound is amazing.",
        date: new Date("2024-01-12")
      },
      {
        user: "Kavya Reddy",
        rating: 4,
        comment: "Great TV with excellent picture quality. The smart features work perfectly.",
        date: new Date("2024-01-19")
      },
      {
        user: "Vikram Singh",
        rating: 5,
        comment: "Best TV I've ever owned. The picture quality is stunning and the build quality is premium.",
        date: new Date("2024-01-26")
      }
    ]
  },
  {
    title: "LG 55-inch OLED 4K TV",
    description: "Premium OLED TV with perfect blacks, infinite contrast, and AI-powered picture enhancement. Features 4K resolution, Dolby Vision, and webOS smart platform.",
    price: 79999,
    discountPercentage: 18,
    rating: 4.8,
    stock: 15,
    brand: "LG",
    category: "TVs",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop&crop=face"
    ],
    order: 10,
    reviews: [
      {
        user: "Anjali Patel",
        rating: 5,
        comment: "Perfect blacks and incredible picture quality! OLED technology is truly amazing.",
        date: new Date("2024-01-15")
      },
      {
        user: "Rohan Kumar",
        rating: 4,
        comment: "Excellent TV with great picture quality. The webOS interface is user-friendly.",
        date: new Date("2024-01-22")
      },
      {
        user: "Zara Sharma",
        rating: 5,
        comment: "Incredible viewing experience! The picture quality is unmatched and the sound is great.",
        date: new Date("2024-01-29")
      }
    ]
  },
  {
    title: "Canon EOS R5 Mirrorless Camera",
    description: "Professional mirrorless camera with 45MP full-frame sensor, 8K video recording, and advanced autofocus. Features 5-axis image stabilization and dual card slots.",
    price: 299999,
    discountPercentage: 8,
    rating: 4.9,
    stock: 12,
    brand: "Canon",
    category: "Cameras",
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop&crop=face"
    ],
    order: 11,
    reviews: [
      {
        user: "Vikram Desai",
        rating: 5,
        comment: "Incredible camera! The 8K video quality is stunning and the autofocus is lightning fast.",
        date: new Date("2024-01-05")
      },
      {
        user: "Priya Malhotra",
        rating: 5,
        comment: "Professional grade camera with amazing image quality. Perfect for wedding photography.",
        date: new Date("2024-01-12")
      },
      {
        user: "Arjun Singh",
        rating: 4,
        comment: "Excellent camera with great features. The image stabilization works perfectly.",
        date: new Date("2024-01-19")
      }
    ]
  },
  {
    title: "Sony A7 IV Mirrorless Camera",
    description: "Full-frame mirrorless camera with 33MP sensor, 4K 60p video, and real-time eye autofocus. Features 5-axis stabilization and dual SD card slots.",
    price: 249999,
    discountPercentage: 12,
    rating: 4.8,
    stock: 18,
    brand: "Sony",
    category: "Cameras",
    thumbnail: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&crop=face"
    ],
    order: 12,
    reviews: [
      {
        user: "Neha Kumar",
        rating: 5,
        comment: "Amazing camera with incredible autofocus! The video quality is outstanding.",
        date: new Date("2024-01-08")
      },
      {
        user: "Rahul Patel",
        rating: 4,
        comment: "Great camera for both photography and videography. The eye autofocus is impressive.",
        date: new Date("2024-01-15")
      },
      {
        user: "Anjali Sharma",
        rating: 5,
        comment: "Perfect camera for professional work. The image quality is exceptional.",
        date: new Date("2024-01-22")
      }
    ]
  },
  {
    title: "iPad Pro 12.9-inch M2",
    description: "Powerful tablet with M2 chip, 12.9-inch Liquid Retina XDR display, and Apple Pencil support. Features ProMotion 120Hz and Thunderbolt connectivity.",
    price: 119999,
    discountPercentage: 5,
    rating: 4.8,
    stock: 25,
    brand: "Apple",
    category: "Tablets",
    thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=face"
    ],
    order: 13,
    reviews: [
      {
        user: "Kavya Iyer",
        rating: 5,
        comment: "Incredible tablet! The M2 chip makes it as powerful as a laptop. Perfect for creative work.",
        date: new Date("2024-01-10")
      },
      {
        user: "Vikram Reddy",
        rating: 4,
        comment: "Great tablet with amazing display. The Apple Pencil integration is seamless.",
        date: new Date("2024-01-17")
      },
      {
        user: "Priya Singh",
        rating: 5,
        comment: "Best tablet I've ever used. The performance is outstanding and the display is stunning.",
        date: new Date("2024-01-24")
      }
    ]
  },
  {
    title: "Samsung Galaxy Tab S9 Ultra",
    description: "Premium Android tablet with 14.6-inch AMOLED display, Snapdragon 8 Gen 2, and S Pen included. Features 120Hz refresh rate and 11200mAh battery.",
    price: 99999,
    discountPercentage: 15,
    rating: 4.7,
    stock: 20,
    brand: "Samsung",
    category: "Tablets",
    thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop&crop=face"
    ],
    order: 14,
    reviews: [
      {
        user: "Rohan Malhotra",
        rating: 4,
        comment: "Excellent tablet with great performance. The S Pen works perfectly for note-taking.",
        date: new Date("2024-01-06")
      },
      {
        user: "Ananya Patel",
        rating: 5,
        comment: "Amazing tablet! The display is beautiful and the battery life is impressive.",
        date: new Date("2024-01-13")
      },
      {
        user: "Arjun Kumar",
        rating: 4,
        comment: "Great Android tablet with premium features. Perfect for productivity and entertainment.",
        date: new Date("2024-01-20")
      }
    ]
  },
  {
    title: "DJI Mini 3 Pro Drone",
    description: "Ultra-lightweight drone with 4K camera, 34-minute flight time, and obstacle avoidance. Features 48MP photos and 4K/60fps video recording.",
    price: 89999,
    discountPercentage: 10,
    rating: 4.8,
    stock: 15,
    brand: "DJI",
    category: "Drones",
    thumbnail: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506947411487-a56738267384?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1506947411487-a56738267384?w=800&h=600&fit=crop&crop=face"
    ],
    order: 15,
    reviews: [
      {
        user: "Aditya Sharma",
        rating: 5,
        comment: "Incredible drone! The camera quality is amazing and it's so easy to fly.",
        date: new Date("2024-01-03")
      },
      {
        user: "Meera Patel",
        rating: 4,
        comment: "Great drone with excellent flight time. The obstacle avoidance works perfectly.",
        date: new Date("2024-01-10")
      },
      {
        user: "Karan Singh",
        rating: 5,
        comment: "Best drone I've ever owned. The video quality is stunning and it's very stable.",
        date: new Date("2024-01-17")
      }
    ]
  },
  {
    title: "GoPro Hero 11 Black",
    description: "Action camera with 5.3K video, 27MP photos, and HyperSmooth 5.0 stabilization. Features 10-bit color and 8:7 aspect ratio for creative flexibility.",
    price: 49999,
    discountPercentage: 8,
    rating: 4.7,
    stock: 30,
    brand: "GoPro",
    category: "Cameras",
    thumbnail: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&crop=face"
    ],
    order: 16,
    reviews: [
      {
        user: "Nisha Reddy",
        rating: 5,
        comment: "Amazing action camera! The stabilization is incredible and the video quality is outstanding.",
        date: new Date("2024-01-05")
      },
      {
        user: "Vivek Malhotra",
        rating: 4,
        comment: "Great camera for adventure sports. The battery life is good and it's very durable.",
        date: new Date("2024-01-12")
      },
      {
        user: "Ananya Desai",
        rating: 5,
        comment: "Perfect for capturing action shots. The HyperSmooth stabilization is game-changing.",
        date: new Date("2024-01-19")
      }
    ]
  },
  {
    title: "Apple Watch Series 9",
    description: "Latest smartwatch with S9 chip, Always-On Retina display, and advanced health features. Includes ECG, blood oxygen monitoring, and crash detection.",
    price: 44999,
    discountPercentage: 5,
    rating: 4.8,
    stock: 40,
    brand: "Apple",
    category: "Wearables",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=600&fit=crop&crop=face"
    ],
    order: 17,
    reviews: [
      {
        user: "Rahul Kumar",
        rating: 5,
        comment: "Incredible smartwatch! The health features are amazing and the battery life is great.",
        date: new Date("2024-01-08")
      },
      {
        user: "Priya Singh",
        rating: 4,
        comment: "Great watch with excellent health monitoring. The ECG feature is very useful.",
        date: new Date("2024-01-15")
      },
      {
        user: "Arjun Patel",
        rating: 5,
        comment: "Best smartwatch I've ever owned. The fitness tracking is accurate and the display is beautiful.",
        date: new Date("2024-01-22")
      }
    ]
  },
  {
    title: "Samsung Galaxy Watch 6 Classic",
    description: "Premium smartwatch with rotating bezel, Wear OS, and advanced health monitoring. Features 1.5-inch AMOLED display and 425mAh battery.",
    price: 39999,
    discountPercentage: 12,
    rating: 4.6,
    stock: 35,
    brand: "Samsung",
    category: "Wearables",
    thumbnail: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=face"
    ],
    order: 18,
    reviews: [
      {
        user: "Neha Iyer",
        rating: 4,
        comment: "Great smartwatch with beautiful design. The rotating bezel is very intuitive.",
        date: new Date("2024-01-06")
      },
      {
        user: "Vikram Reddy",
        rating: 5,
        comment: "Excellent watch with great health features. The battery life is impressive.",
        date: new Date("2024-01-13")
      },
      {
        user: "Anjali Malhotra",
        rating: 4,
        comment: "Perfect Android smartwatch. The Wear OS integration is seamless.",
        date: new Date("2024-01-20")
      }
    ]
  },
  {
    title: "PlayStation 5 Console",
    description: "Next-generation gaming console with 4K graphics, ray tracing, and ultra-high speed SSD. Features DualSense controller with haptic feedback and adaptive triggers.",
    price: 49999,
    discountPercentage: 0,
    rating: 4.9,
    stock: 25,
    brand: "Sony",
    category: "Gaming",
    thumbnail: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop&crop=face"
    ],
    order: 19,
    reviews: [
      {
        user: "Aryan Sharma",
        rating: 5,
        comment: "Incredible gaming console! The graphics are stunning and the loading times are lightning fast.",
        date: new Date("2024-01-10")
      },
      {
        user: "Ishaan Patel",
        rating: 5,
        comment: "Best gaming experience ever! The DualSense controller is revolutionary.",
        date: new Date("2024-01-17")
      },
      {
        user: "Riya Kumar",
        rating: 4,
        comment: "Amazing console with great performance. The SSD makes a huge difference in loading times.",
        date: new Date("2024-01-24")
      }
    ]
  },
  {
    title: "Xbox Series X Console",
    description: "Most powerful Xbox ever with 4K gaming, ray tracing, and 120fps support. Features Quick Resume, Smart Delivery, and Game Pass integration.",
    price: 45999,
    discountPercentage: 5,
    rating: 4.8,
    stock: 20,
    brand: "Microsoft",
    category: "Gaming",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop&crop=face"
    ],
    order: 20,
    reviews: [
      {
        user: "Karan Singh",
        rating: 5,
        comment: "Amazing gaming console! Game Pass is incredible and the performance is outstanding.",
        date: new Date("2024-01-12")
      },
      {
        user: "Priyanka Malhotra",
        rating: 4,
        comment: "Great console with excellent graphics. Quick Resume feature is very convenient.",
        date: new Date("2024-01-19")
      },
      {
        user: "Rahul Iyer",
        rating: 5,
        comment: "Best Xbox ever! The 4K gaming experience is incredible and Game Pass is a game changer.",
        date: new Date("2024-01-26")
      }
    ]
  },
  {
    title: "Nintendo Switch OLED",
    description: "Hybrid gaming console with 7-inch OLED screen, enhanced audio, and 64GB storage. Features Joy-Con controllers and dock for TV gaming.",
    price: 29999,
    discountPercentage: 8,
    rating: 4.7,
    stock: 30,
    brand: "Nintendo",
    category: "Gaming",
    thumbnail: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop&crop=face"
    ],
    order: 21,
    reviews: [
      {
        user: "Aditya Patel",
        rating: 5,
        comment: "Perfect portable gaming console! The OLED screen is beautiful and the battery life is great.",
        date: new Date("2024-01-08")
      },
      {
        user: "Meera Kumar",
        rating: 4,
        comment: "Great console for both portable and TV gaming. The Joy-Con controllers are comfortable.",
        date: new Date("2024-01-15")
      },
      {
        user: "Karan Sharma",
        rating: 5,
        comment: "Amazing hybrid console! The OLED display makes games look incredible.",
        date: new Date("2024-01-22")
      }
    ]
  },
  {
    title: "Dyson V15 Detect Absolute",
    description: "Cordless vacuum with laser technology, 240AW suction power, and 60-minute runtime. Features LCD screen, HEPA filtration, and multiple attachments.",
    price: 59999,
    discountPercentage: 10,
    rating: 4.8,
    stock: 25,
    brand: "Dyson",
    category: "Home Appliances",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&crop=face"
    ],
    order: 22,
    reviews: [
      {
        user: "Anjali Reddy",
        rating: 5,
        comment: "Incredible vacuum! The laser technology shows every speck of dust and the suction is powerful.",
        date: new Date("2024-01-05")
      },
      {
        user: "Vikram Singh",
        rating: 4,
        comment: "Great cordless vacuum with excellent battery life. The HEPA filter works perfectly.",
        date: new Date("2024-01-12")
      },
      {
        user: "Priya Malhotra",
        rating: 5,
        comment: "Best vacuum I've ever owned. The laser feature is amazing and it's so easy to use.",
        date: new Date("2024-01-19")
      }
    ]
  },
  {
    title: "Samsung Bespoke Refrigerator",
    description: "Smart refrigerator with customizable panels, Family Hub touchscreen, and AI-powered food management. Features 4-door design and 25 cu ft capacity.",
    price: 199999,
    discountPercentage: 15,
    rating: 4.6,
    stock: 8,
    brand: "Samsung",
    category: "Home Appliances",
    thumbnail: "https://images.unsplash.com/photo-1571172964276-91faaa704e1f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571172964276-91faaa704e1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571172964276-91faaa704e1f?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=face"
    ],
    order: 23,
    reviews: [
      {
        user: "Rahul Iyer",
        rating: 4,
        comment: "Great refrigerator with smart features. The Family Hub is very useful for managing groceries.",
        date: new Date("2024-01-10")
      },
      {
        user: "Kavya Patel",
        rating: 5,
        comment: "Amazing smart refrigerator! The customizable panels look beautiful and the capacity is huge.",
        date: new Date("2024-01-17")
      },
      {
        user: "Arjun Kumar",
        rating: 4,
        comment: "Excellent refrigerator with great features. The AI food management is very helpful.",
        date: new Date("2024-01-24")
      }
    ]
  },
  {
    title: "LG 9kg Front Load Washing Machine",
    description: "Smart washing machine with AI Direct Drive, Steam function, and 6 Motion technology. Features 1400 RPM spin speed and 15 wash programs.",
    price: 44999,
    discountPercentage: 12,
    rating: 4.7,
    stock: 15,
    brand: "LG",
    category: "Home Appliances",
    thumbnail: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571172964276-91faaa704e1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571172964276-91faaa704e1f?w=800&h=600&fit=crop&crop=face"
    ],
    order: 24,
    reviews: [
      {
        user: "Neha Sharma",
        rating: 5,
        comment: "Excellent washing machine! The AI features work perfectly and clothes come out very clean.",
        date: new Date("2024-01-08")
      },
      {
        user: "Vikram Reddy",
        rating: 4,
        comment: "Great washing machine with smart features. The steam function is very effective.",
        date: new Date("2024-01-15")
      },
      {
        user: "Priya Singh",
        rating: 5,
        comment: "Best washing machine I've ever used. The 6 Motion technology ensures perfect cleaning.",
        date: new Date("2024-01-22")
      }
    ]
  },
  {
    title: "Bose QuietComfort 45 Headphones",
    description: "Premium noise-canceling headphones with Acoustic Noise Canceling technology and 24-hour battery life. Features Aware mode and comfortable ear cushions.",
    price: 34999,
    discountPercentage: 8,
    rating: 4.7,
    stock: 40,
    brand: "Bose",
    category: "Audio",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop&crop=face"
    ],
    order: 25,
    reviews: [
      {
        user: "Aditya Malhotra",
        rating: 5,
        comment: "Incredible noise cancellation! These headphones are perfect for travel and work.",
        date: new Date("2024-01-06")
      },
      {
        user: "Meera Kumar",
        rating: 4,
        comment: "Great headphones with excellent comfort. The battery life is impressive.",
        date: new Date("2024-01-13")
      },
      {
        user: "Karan Patel",
        rating: 5,
        comment: "Best noise-canceling headphones I've ever used. The sound quality is amazing.",
        date: new Date("2024-01-20")
      }
    ]
  }
];

const insertFakeData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert fake data
    const result = await Product.insertMany(fakeProducts);
    console.log(`Successfully inserted ${result.length} products with reviews and images`);

    // Display inserted data
    result.forEach(product => {
      console.log(`\n${product.title} - ₹${product.price}`);
      console.log(`Reviews: ${product.reviews.length}`);
      console.log(`Images: ${product.images.length}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting fake data:", error);
    mongoose.connection.close();
  }
};

insertFakeData();