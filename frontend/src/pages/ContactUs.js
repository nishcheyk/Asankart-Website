import React, { useState } from "react";
import "../css/ContactUs.css";
import NavBar from "../components/NavBar";
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when typing
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, message } = formData;
    if (!name || !email || !message) {
      setError("All fields are required!");
      return;
    }

    // Simulating form submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" }); // Reset form
    }, 1000);
  };

  return (
    <div>
      <NavBar />
      <div className="contact-container">
        <h2>Contact Us</h2>

        {/* Success Message */}
        {submitted && <p className="success">Your message has been sent!</p>}

        {/* Error Message */}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>

        {/* Contact Info */}
        <div className="contact-info">
          <p>
            <strong>Address:</strong> 123 Street, City, Country
          </p>
          <p>
            <strong>Email:</strong> contact@yourcompany.com
          </p>
          <p>
            <strong>Phone:</strong> +1 234 567 890
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
