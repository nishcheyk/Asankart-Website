import React from 'react';
import '../css/Aboutus.css'; // Optional: Add custom styling for the About Us page
import NavBar from '../components/NavBar';


const Aboutus = () => {

    return (
        <>
        <NavBar/>
        <div className="about-us">
    <div className="about-us-container">
        <h1>About Us</h1>
        <p>
            Welcome to our E-commerce platform! We are dedicated to providing you with the best online shopping experience.
        </p>
        <p>
            Our mission is to offer high-quality products at competitive prices, ensuring customer satisfaction at every step.
        </p>
        <p>
            With a wide range of products and a user-friendly interface, we aim to make your shopping journey seamless and enjoyable.
        </p>
        <h2>Why Choose Us?</h2>
        <ul>
            <li>Wide variety of products</li>
            <li>Secure payment options</li>
            <li>Fast and reliable delivery</li>
            <li>24/7 customer support</li>
        </ul>

        <h2>What Our Customers Say</h2>
<div className="about-us-testimonials">
    <div className="testimonial">
        <p>"Amazing shopping experience! Fast delivery and great support!"</p>
        <span>- Sarah D.</span>
    </div>
    <div className="testimonial">
        <p>"High-quality products at unbeatable prices. Highly recommended!"</p>
        <span>- John M.</span>
    </div>
    <div className="testimonial">
        <p>"The customer service team was incredibly helpful and responsive."</p>
        <span>- Emily R.</span>
    </div>
</div>

<h2>Our Journey</h2>
<div className="about-us-timeline">
    <div className="timeline-item">
        <span className="year">2020</span>
        <p>Founded with a vision to simplify online shopping.</p>
    </div>
    <div className="timeline-item">
        <span className="year">2021</span>
        <p>Launched our first product line and reached 10K users.</p>
    </div>
    <div className="timeline-item">
        <span className="year">2022</span>
        <p>Expanded to international markets and doubled our team.</p>
    </div>
    <div className="timeline-item">
        <span className="year">2023</span>
        <p>Introduced AI-driven recommendations and improved logistics.</p>
    </div>
</div>

        <p>

            Thank you for choosing us. We look forward to serving you!
        </p>

    </div>
</div>

        </>
    );
};

export default Aboutus;