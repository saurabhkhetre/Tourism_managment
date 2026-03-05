import { usePackages } from '../../contexts/PackageContext';
import { useBookings } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Award, Headphones, Globe, MapPin, Heart, Users, TrendingUp } from 'lucide-react';
import './About.css';

export default function About() {
    const { packages } = usePackages();
    const { bookings } = useBookings();
    const { users } = useAuth();

    const team = [
        { name: 'Arjun Mehta', role: 'Founder & CEO', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
        { name: 'Kavita Nair', role: 'Head of Operations', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
        { name: 'Rohan Gupta', role: 'Lead Guide', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
        { name: 'Sneha Rao', role: 'Customer Relations', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
    ];

    return (
        <div className="about-page">
            <div className="page-header">
                <div className="container">
                    <h1>About TravelVista</h1>
                    <p>Your trusted partner for unforgettable travel experiences across India</p>
                </div>
            </div>

            <div className="container">
                <div className="about-stats">
                    <div className="about-stat">
                        <div className="stat-number">{packages.length}+</div>
                        <div className="stat-label">Tour Packages</div>
                    </div>
                    <div className="about-stat">
                        <div className="stat-number">{bookings.length * 100}+</div>
                        <div className="stat-label">Happy Travelers</div>
                    </div>
                    <div className="about-stat">
                        <div className="stat-number">50+</div>
                        <div className="stat-label">Destinations</div>
                    </div>
                    <div className="about-stat">
                        <div className="stat-number">4.8</div>
                        <div className="stat-label">Average Rating</div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="about-story">
                    <div className="about-story-grid">
                        <div className="about-story-image">
                            <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80" alt="Travel Story" />
                        </div>
                        <div className="about-story-content">
                            <h2>Our Story</h2>
                            <p>
                                TravelVista was born from a passion for exploration and a drive to make travel accessible to everyone.
                                Founded in 2020, we've grown from a small team of travel enthusiasts to India's fastest-growing tour management platform.
                            </p>
                            <p>
                                We believe every journey should be more than just a trip — it should be a life-changing experience.
                                Our curated packages are designed by local experts who know the hidden gems, the best routes, and the authentic experiences that make travel truly memorable.
                            </p>
                            <p>
                                From the snow-capped peaks of Kashmir to the sun-kissed beaches of Goa, from the spiritual ghats of Varanasi to the backwaters of Kerala — we bring you the best of India, one journey at a time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="why-choose">
                <div className="container">
                    <h2 className="section-title">Why Choose TravelVista?</h2>
                    <p className="section-subtitle">We go above and beyond to make your travel dreams come true</p>
                    <div className="why-choose-grid">
                        <div className="why-card">
                            <div className="why-icon"><Shield size={28} /></div>
                            <h3>Secure Booking</h3>
                            <p>100% secure payment processing with instant booking confirmation and money-back guarantee.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon"><Award size={28} /></div>
                            <h3>Best Price Guarantee</h3>
                            <p>We offer the most competitive prices. Find a lower price elsewhere and we'll match it.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon"><Headphones size={28} /></div>
                            <h3>24/7 Support</h3>
                            <p>Round-the-clock customer support to assist you before, during, and after your trip.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon"><Globe size={28} /></div>
                            <h3>Expert Guides</h3>
                            <p>Local certified guides who provide authentic cultural insights and hidden gem discoveries.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon"><Heart size={28} /></div>
                            <h3>Curated Experiences</h3>
                            <p>Handpicked itineraries crafted by travel experts for the most memorable journeys.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon"><Users size={28} /></div>
                            <h3>Small Groups</h3>
                            <p>Intimate group sizes ensuring personalized attention and a better travel experience.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-team">
                <div className="container">
                    <h2 className="section-title">Meet Our Team</h2>
                    <p className="section-subtitle">The passionate people behind your incredible travel experiences</p>
                    <div className="team-grid">
                        {team.map((member, i) => (
                            <div key={i} className="team-card">
                                <img src={member.avatar} alt={member.name} />
                                <h4>{member.name}</h4>
                                <p>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
