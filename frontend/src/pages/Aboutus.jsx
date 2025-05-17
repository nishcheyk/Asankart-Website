import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../css/Aboutus.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Aboutus = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <>
            <NavBar />
            <div className="about-us">
                <div className="about-us-container">
                    <h1 data-aos="fade-up">About Us</h1>
                    <p data-aos="fade-up">
                        Welcome to <strong>AsnaKart</strong> — a proudly Indian e-commerce platform founded in the vibrant city of Chandigarh in 2020.
                    </p>
                    <p data-aos="fade-up" data-aos-delay="100">
                        What began as a small venture in Sector 34 has grown into one of North India's most trusted online stores.
                    </p>
                    <p data-aos="fade-up" data-aos-delay="200">
                        Whether it's festive items, local crafts, groceries, or daily essentials, we deliver a seamless and affordable experience.
                    </p>

                    <h2 data-aos="zoom-in">Why Shop With Us?</h2>
                    <ul data-aos="fade-up">
                        <li>Wide range of desi and modern products</li>
                        <li>Lightning-fast delivery across Punjab, Haryana & Delhi NCR</li>
                        <li>Secure payment through UPI, NetBanking, and Cash on Delivery</li>
                        <li>Support for local vendors and artisans</li>
                        <li>Multilingual support: Hindi, Punjabi & English</li>
                    </ul>

                    <h2 data-aos="zoom-in">Voices From Our Customers</h2>
                    <div className="about-us-testimonials">
                        <div className="testimonial" data-aos="fade-up" data-aos-delay="100">
                            <p>"AsnaKart delivers even in remote Punjab villages! Love their service."</p>
                            <span>- Jaspreet K., Mohali</span>
                        </div>
                        <div className="testimonial" data-aos="fade-up" data-aos-delay="200">
                            <p>"I gifted hampers from AsnaKart during Lohri — fantastic packaging and delivery."</p>
                            <span>- Reema M., Chandigarh</span>
                        </div>
                        <div className="testimonial" data-aos="fade-up" data-aos-delay="300">
                            <p>"Their handmade items section is a gem. I found unique crafts from Jammu here."</p>
                            <span>- Harsh K., Amritsar</span>
                        </div>
                    </div>

                    <h2 data-aos="zoom-in">Our Chandigarh Story</h2>
                    <div className="about-us-timeline">
                        {[
                            { year: '2020', text: 'Launched from a garage in Sector 34, Chandigarh.' },
                            { year: '2021', text: 'Onboarded 150+ local vendors.' },
                            { year: '2022', text: 'Expanded to 10 Indian states and launched mobile app.' },
                            { year: '2023', text: 'Opened hubs in Jaipur, Amritsar & Noida.' },
                            { year: '2024', text: 'Crossed 6 lakh customers, launched eco-friendly packaging.' }
                        ].map((item, i) => (
                            <div className="timeline-item" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                                <span className="year">{item.year}</span>
                                <p>{item.text}</p>
                            </div>
                        ))}
                    </div>

                    <h2 data-aos="zoom-in">Meet Our Founders</h2>
                    <div className="about-us-founders">
                        {[
                            { name: 'Nishchey Khajuria', desc: 'Visionary leader and strategist.' },
                            { name: 'Prinkle Sharma', desc: 'Creative head and UX expert.' },
                            { name: 'Sunil Kumar Mahajan', desc: 'Finance and logistics lead.' },
                            { name: 'Surinder Khajuria', desc: 'Retail mentor and advisor.' }
                        ].map((founder, i) => (
                            <div className="founder-card" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                                <h3>{founder.name}</h3>
                                <p>{founder.desc}</p>
                            </div>
                        ))}
                    </div>

                    <h2 data-aos="zoom-in">Our Core Values</h2>
                    <ul data-aos="fade-up">
                        <li><strong>Desi Roots:</strong> Culture, craftsmanship, and care of its region.</li>
                        <li><strong>Community-Driven:</strong> Partnering with small businesses from Tier 2 & 3 cities.</li>
                        <li><strong>Transparency:</strong> Honest pricing, easy returns, live tracking.</li>
                        <li><strong>Sustainability:</strong> Recyclable packaging & lower emissions.</li>
                    </ul>

                    <h2 data-aos="zoom-in">Our Impact So Far</h2>
                    <ul data-aos="fade-up">
                        <li>🧵 1,500+ artisans empowered</li>
                        <li>📦 Over 6 lakh orders delivered</li>
                        <li>⭐ 97.9% satisfaction score (2024)</li>
                        <li>🌱 100% eco-packaging since 2023</li>
                    </ul>

                    <h2 data-aos="zoom-in">Customer Support</h2>
                    <p data-aos="fade-up">Reach out to our Chandigarh-based support team:</p>
                    <ul data-aos="fade-up">
                        <li>📞 +91-172-400-9876</li>
                        <li>📧 care@asnakart.in</li>
                        <li>🕘 Mon–Sat: 9 AM – 8 PM</li>
                        <li>💬 24/7 WhatsApp Chat</li>
                    </ul>

                    <h2
                        data-aos="fade-up"
                        style={{ marginTop: '40px', fontStyle: 'italic', color: '#555' }}
                    >
                        “Apna bharosa, apni dukaan – AsnaKart.”
                    </h2>
                    <p style={{ fontStyle: 'italic' }} data-aos="fade-up">
                        – Built in Chandigarh, for every Indian home.
                    </p>

                    <p data-aos="fade-up">
                        Thank you for choosing <strong>AsnaKart</strong>. We’re honored to serve you and your family.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Aboutus;
