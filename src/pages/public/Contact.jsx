import { useState } from 'react';
import { useEnquiries } from '../../contexts/EnquiryContext';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import './Contact.css';

export default function Contact() {
    const { addEnquiry } = useEnquiries();
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.subject || !form.message) {
            setError('All fields are required');
            return;
        }
        addEnquiry(form);
        setForm({ name: '', email: '', subject: '', message: '' });
        setError('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
    };

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <h1>Contact Us</h1>
                    <p>Have a question or need help planning your trip? We're here to help!</p>
                </div>
            </div>

            <section className="contact-page">
                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-info">
                            <h2>Get in Touch</h2>
                            <p>
                                Whether you need help with a booking, want a custom itinerary, or just have a question
                                about our packages — our team is ready to assist you.
                            </p>
                            <div className="contact-cards">
                                <div className="contact-card">
                                    <div className="card-icon"><MapPin size={22} /></div>
                                    <div>
                                        <h4>Our Office</h4>
                                        <p>42, MG Road, Pune, Maharashtra, India - 411001</p>
                                    </div>
                                </div>
                                <div className="contact-card">
                                    <div className="card-icon"><Phone size={22} /></div>
                                    <div>
                                        <h4>Phone</h4>
                                        <p>+91 9876543210</p>
                                        <p>Mon - Sat, 9 AM - 8 PM</p>
                                    </div>
                                </div>
                                <div className="contact-card">
                                    <div className="card-icon"><Mail size={22} /></div>
                                    <div>
                                        <h4>Email</h4>
                                        <p>info@travelvista.com</p>
                                        <p>support@travelvista.com</p>
                                    </div>
                                </div>
                                <div className="contact-card">
                                    <div className="card-icon"><Clock size={22} /></div>
                                    <div>
                                        <h4>Working Hours</h4>
                                        <p>Monday – Saturday: 9 AM – 8 PM</p>
                                        <p>Sunday: 10 AM – 5 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-wrapper">
                            <h2>Send us a Message</h2>
                            {success && <div className="form-success">✅ Your enquiry has been submitted! We'll get back to you soon.</div>}
                            {error && <div className="form-error" style={{ marginBottom: '16px' }}>{error}</div>}
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Your Name</label>
                                        <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Subject</label>
                                    <input className="form-input" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea className="form-textarea" name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your travel plans..." rows={5} />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                    <Send size={18} /> Send Message
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="contact-map">
                        <div style={{ textAlign: 'center' }}>
                            <MapPin size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
                            <p>42, MG Road, Pune, Maharashtra, India</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
