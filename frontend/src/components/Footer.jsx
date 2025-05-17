import React from 'react';
import { motion } from 'framer-motion';
import '../css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <motion.div className="footer-section" initial={{ opacity: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                    <h3>AsnaKart</h3>
                    <p>Your trusted general store from Chandigarh — delivering daily essentials with desi values across India.</p>
                </motion.div>

                <motion.div className="footer-section" initial={{ opacity: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/products">Shop</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/faq">FAQs</a></li>
                    </ul>
                </motion.div>

                <motion.div className="footer-section" initial={{ opacity: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                    <h4>Customer Support</h4>
                    <ul>
                        <li>📞 +91-172-600-4321</li>
                        <li>📧 support@asnakart.in</li>
                        <li>🕘 Mon–Sun: 9 AM – 9 PM</li>
                        <li>💬 24/7 WhatsApp Support</li>
                    </ul>
                </motion.div>

                <motion.div className="footer-section" initial={{ opacity: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                    <h4>Follow Us</h4>
                    <ul className="footer-socials">
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">YouTube</a></li>
                        <li><a href="#">X (Twitter)</a></li>
                    </ul>
                </motion.div>
            </div>
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} AsnaKart. Built with ❤️ in Chandigarh.</p>
            </div>
        </footer>
    );
};

export default Footer;
