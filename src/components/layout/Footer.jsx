import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Send } from 'lucide-react';
import { useState } from 'react';
import './Footer.css';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer className="footer">
            <div className="footer-wave">
                <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
                    <path d="M0,50 C200,100 400,0 600,50 C800,100 1000,0 1200,50 L1200,100 L0,100 Z" fill="var(--bg-secondary)" />
                </svg>
            </div>

            <div className="footer-content">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-about">
                            <Link to="/" className="footer-logo">
                                <Compass size={28} />
                                <span>Travel<span className="logo-accent">Vista</span></span>
                            </Link>
                            <p className="footer-desc">
                                Your trusted partner for unforgettable travel experiences across India. We curate the finest tour packages to make your journey smooth and memorable.
                            </p>
                            <div className="footer-social">
                                <a href="#" className="social-link" aria-label="Facebook"><Facebook size={18} /></a>
                                <a href="#" className="social-link" aria-label="Instagram"><Instagram size={18} /></a>
                                <a href="#" className="social-link" aria-label="Twitter"><Twitter size={18} /></a>
                                <a href="#" className="social-link" aria-label="Youtube"><Youtube size={18} /></a>
                            </div>
                        </div>

                        <div className="footer-links-col">
                            <h4 className="footer-heading">Quick Links</h4>
                            <Link to="/" className="footer-link">Home</Link>
                            <Link to="/packages" className="footer-link">Tour Packages</Link>
                            <Link to="/about" className="footer-link">About Us</Link>
                            <Link to="/contact" className="footer-link">Contact</Link>
                        </div>

                        <div className="footer-links-col">
                            <h4 className="footer-heading">Tour Types</h4>
                            <Link to="/packages?category=Beach" className="footer-link">Beach Tours</Link>
                            <Link to="/packages?category=Mountain" className="footer-link">Mountain Tours</Link>
                            <Link to="/packages?category=Adventure" className="footer-link">Adventure Tours</Link>
                            <Link to="/packages?category=Heritage" className="footer-link">Heritage Tours</Link>
                        </div>

                        <div className="footer-contact-col">
                            <h4 className="footer-heading">Contact Info</h4>
                            <div className="footer-contact-item">
                                <MapPin size={16} />
                                <span>42, MG Road, Pune, Maharashtra</span>
                            </div>
                            <div className="footer-contact-item">
                                <Phone size={16} />
                                <span>+91 9876543210</span>
                            </div>
                            <div className="footer-contact-item">
                                <Mail size={16} />
                                <span>info@travelvista.com</span>
                            </div>

                            <form className="footer-newsletter" onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    placeholder="Your email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="newsletter-input"
                                />
                                <button type="submit" className="newsletter-btn">
                                    <Send size={16} />
                                </button>
                            </form>
                            {subscribed && <p className="newsletter-success">Subscribed! 🎉</p>}
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© 2026 TravelVista. All rights reserved. Made with ❤️ in India</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
