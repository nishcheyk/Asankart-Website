
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../css/FAQ.css';  // Ensure you update your CSS accordingly
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const FAQ = () => {
  const [active, setActive] = useState(null);
  const toggleAnswer = (index) => {
    setActive(active === index ? null : index);
  };

  const faqData = [
    {
      question: "What products do you sell?",
      answer: "At AsnaKart, we offer a wide variety of general store items, including groceries, home essentials, personal care products, and Indian snacks. Our goal is to provide all your daily needs under one roof.",
    },
    {
      question: "Do you offer delivery to my location?",
      answer: "Yes! We deliver across India. Whether you're in Chandigarh, Delhi, or remote areas in Punjab and Haryana, we ensure quick and reliable delivery.",
    },
    {
      question: "What payment options are available?",
      answer: "We offer various payment options including UPI, NetBanking, Credit/Debit Cards, and Cash on Delivery (COD). Your convenience is our priority.",
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order in real-time through our order tracking page or contact our support team on WhatsApp for instant updates.",
    },
    {
      question: "How can I contact customer support?",
      answer: "Our customer support team is available via email at support@asnakart.in, or you can reach us on WhatsApp and phone at +91-172-600-4321. We're here to assist you.",
    },
    {
      question: "How do I return or exchange a product?",
      answer: "We accept returns or exchanges within 7 days of purchase. Simply reach out to our support team, and we'll guide you through the process.",
    },
    {
      question: "Do you offer discounts or coupons?",
      answer: "Yes! We regularly offer discounts and coupons. Follow us on social media or subscribe to our newsletter to stay updated on the latest deals.",
    },
    {
      question: "Are your products authentic?",
      answer: "Yes, we ensure that all products sold on AsnaKart are authentic and sourced directly from trusted manufacturers and local artisans.",
    },
    {
      question: "Can I cancel my order after placing it?",
      answer: "Orders can be canceled within 24 hours of placing them. If you wish to cancel, please contact our customer support team as soon as possible.",
    },
  ];

  return (
    <>
      <NavBar />
      <div className="faq-container">
        <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" className="faq-title">
          Frequently Asked Questions
        </motion.h1>

        <div className="faq-list">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              className="faq-item"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              custom={index}
            >
              <div className="faq-question" onClick={() => toggleAnswer(index)}>
                <h3>{item.question}</h3>
                <span className={`arrow ${active === index ? 'active' : ''}`}>
                  {active === index ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              <motion.div
                className={`faq-answer ${active === index ? 'active' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: active === index ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {item.answer}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;
