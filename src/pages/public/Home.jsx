import { Link } from 'react-router-dom';
import { usePackages } from '../../contexts/PackageContext';
import { useBookings } from '../../contexts/BookingContext';
import { useReviews } from '../../contexts/ReviewContext';
import {
    MapPin, Star, Clock, ArrowRight, Shield, Headphones,
    CreditCard, Users, ChevronRight, TrendingUp, Award, Heart
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import './Home.css';

function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const counted = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !counted.current) {
                counted.current = true;
                let start = 0;
                const step = end / (duration / 16);
                const timer = setInterval(() => {
                    start += step;
                    if (start >= end) {
                        setCount(end);
                        clearInterval(timer);
                    } else {
                        setCount(Math.floor(start));
                    }
                }, 16);
            }
        });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
    const { getFeaturedPackages, getActivePackages } = usePackages();
    const { bookings } = useBookings();
    const { reviews } = useReviews();
    const featured = getFeaturedPackages();
    const [currentSlide, setCurrentSlide] = useState(0);

    const banners = [
        { image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=80', title: 'Explore the World', subtitle: 'One Journey at a Time' },
        { image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80', title: 'Discover Paradise', subtitle: 'Your Adventure Awaits' },
        { image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1400&q=80', title: 'Create Memories', subtitle: 'That Last Forever' },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const testimonials = reviews.slice(0, 3);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                {banners.map((banner, index) => (
                    <div
                        key={index}
                        className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${banner.image})` }}
                    />
                ))}
                <div className="hero-overlay" />
                <div className="hero-content">
                    <div className="hero-badge animate-slide-up">✨ Premium Travel Experiences</div>
                    <h1 className="hero-title animate-slide-up">{banners[currentSlide].title}</h1>
                    <p className="hero-subtitle animate-slide-up">{banners[currentSlide].subtitle}</p>
                    <div className="hero-actions animate-slide-up">
                        <Link to="/packages" className="btn btn-primary btn-lg">
                            Explore Packages <ArrowRight size={18} />
                        </Link>
                        <Link to="/contact" className="btn btn-secondary btn-lg">
                            Contact Us
                        </Link>
                    </div>
                    <div className="hero-dots">
                        {banners.map((_, i) => (
                            <button
                                key={i}
                                className={`hero-dot ${i === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(i)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <TrendingUp className="stat-icon-svg" />
                            <div className="stat-number"><AnimatedCounter end={500} suffix="+" /></div>
                            <div className="stat-text">Tours Completed</div>
                        </div>
                        <div className="stat-item">
                            <Users className="stat-icon-svg" />
                            <div className="stat-number"><AnimatedCounter end={10000} suffix="+" /></div>
                            <div className="stat-text">Happy Travelers</div>
                        </div>
                        <div className="stat-item">
                            <MapPin className="stat-icon-svg" />
                            <div className="stat-number"><AnimatedCounter end={50} suffix="+" /></div>
                            <div className="stat-text">Destinations</div>
                        </div>
                        <div className="stat-item">
                            <Award className="stat-icon-svg" />
                            <div className="stat-number"><AnimatedCounter end={15} suffix="+" /></div>
                            <div className="stat-text">Years Experience</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Packages */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Featured Tour Packages</h2>
                    <p className="section-subtitle">Handpicked destinations for unforgettable experiences</p>

                    <div className="packages-grid">
                        {featured.map((pkg) => (
                            <Link to={`/packages/${pkg.id}`} key={pkg.id} className="package-card glass-card">
                                <div className="package-image-wrap">
                                    <img src={pkg.image} alt={pkg.title} className="package-image" />
                                    <div className="package-badge">{pkg.category}</div>
                                    {pkg.originalPrice > pkg.price && (
                                        <div className="package-discount">
                                            {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% OFF
                                        </div>
                                    )}
                                </div>
                                <div className="package-info">
                                    <div className="package-location">
                                        <MapPin size={14} /> {pkg.location}
                                    </div>
                                    <h3 className="package-title">{pkg.title}</h3>
                                    <div className="package-meta">
                                        <span className="package-duration"><Clock size={14} /> {pkg.duration}</span>
                                        <span className="package-rating"><Star size={14} /> {pkg.rating}</span>
                                    </div>
                                    <div className="package-footer">
                                        <div className="package-price">
                                            <span className="price-current">₹{pkg.price.toLocaleString()}</span>
                                            {pkg.originalPrice > pkg.price && (
                                                <span className="price-original">₹{pkg.originalPrice.toLocaleString()}</span>
                                            )}
                                            <span className="price-per">/ person</span>
                                        </div>
                                        <span className="package-cta">View <ChevronRight size={16} /></span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="section-cta">
                        <Link to="/packages" className="btn btn-primary btn-lg">
                            View All Packages <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section why-section">
                <div className="container">
                    <h2 className="section-title">Why Choose TravelVista?</h2>
                    <p className="section-subtitle">We make your travel dreams come true with our premium services</p>

                    <div className="why-grid">
                        <div className="why-card glass-card">
                            <div className="why-icon" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
                                <Shield size={28} color="var(--primary)" />
                            </div>
                            <h3>100% Safe Travels</h3>
                            <p>Your safety is our top priority. All tours include insurance and 24/7 emergency support.</p>
                        </div>
                        <div className="why-card glass-card">
                            <div className="why-icon" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
                                <CreditCard size={28} color="var(--accent-purple)" />
                            </div>
                            <h3>Best Price Guarantee</h3>
                            <p>We offer the most competitive prices with no hidden charges. Value for every rupee spent.</p>
                        </div>
                        <div className="why-card glass-card">
                            <div className="why-icon" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
                                <Headphones size={28} color="var(--accent-amber)" />
                            </div>
                            <h3>24/7 Support</h3>
                            <p>Our dedicated team is available round the clock to assist you before, during, and after your trip.</p>
                        </div>
                        <div className="why-card glass-card">
                            <div className="why-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                                <Heart size={28} color="var(--accent-emerald)" />
                            </div>
                            <h3>Curated Experiences</h3>
                            <p>Every tour is carefully crafted by travel experts to give you authentic, memorable experiences.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            {testimonials.length > 0 && (
                <section className="section">
                    <div className="container">
                        <h2 className="section-title">What Our Travelers Say</h2>
                        <p className="section-subtitle">Real stories from real adventurers</p>

                        <div className="testimonials-grid">
                            {testimonials.map(review => (
                                <div key={review.id} className="testimonial-card glass-card">
                                    <div className="testimonial-stars">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < review.rating ? 'var(--accent-amber)' : 'none'} color={i < review.rating ? 'var(--accent-amber)' : 'var(--text-muted)'} />
                                        ))}
                                    </div>
                                    <p className="testimonial-text">"{review.comment}"</p>
                                    <div className="testimonial-author">
                                        <img src={review.userAvatar} alt={review.userName} className="testimonial-avatar" />
                                        <div>
                                            <div className="testimonial-name">{review.userName}</div>
                                            <div className="testimonial-pkg">{review.packageTitle}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2>Ready for Your Next Adventure?</h2>
                        <p>Join thousands of happy travelers who have explored India with us. Book your dream tour today!</p>
                        <div className="cta-actions">
                            <Link to="/packages" className="btn btn-primary btn-lg">Browse Packages</Link>
                            <Link to="/contact" className="btn btn-secondary btn-lg">Get in Touch</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
