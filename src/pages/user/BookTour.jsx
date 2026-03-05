import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePackages } from '../../contexts/PackageContext';
import { useBookings } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import {
    MapPin, Calendar, Users, CheckCircle, CreditCard,
    Smartphone, Banknote, IndianRupee, ArrowLeft
} from 'lucide-react';
import './BookTour.css';

export default function BookTour() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getPackage } = usePackages();
    const { createBooking, confirmPayment } = useBookings();
    const { user } = useAuth();

    const pkg = getPackage(id);
    const [step, setStep] = useState(1);    // 1: details, 2: payment, 3: success
    const [travelDate, setTravelDate] = useState('');
    const [persons, setPersons] = useState(1);
    const [payMethod, setPayMethod] = useState('');
    const [bookingId, setBookingId] = useState(null);
    const [error, setError] = useState('');

    if (!pkg) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <h2>Package not found</h2>
                <Link to="/packages" className="btn btn-primary mt-4">Browse Packages</Link>
            </div>
        );
    }

    const totalAmount = pkg.price * persons;
    const savings = (pkg.originalPrice - pkg.price) * persons;

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!travelDate) { setError('Please select a travel date'); return; }
        if (persons < 1 || persons > pkg.maxPersons) { setError(`Persons must be between 1 and ${pkg.maxPersons}`); return; }

        const booking = await createBooking({
            userId: user.id,
            packageId: pkg.id,
            packageTitle: pkg.title,
            travelDate,
            persons,
            totalAmount,
        });
        if (booking) {
            setBookingId(booking.id);
            setStep(2);
            setError('');
        } else {
            setError('Failed to create booking. Please try again.');
        }
    };

    const handlePayment = async () => {
        if (!payMethod) return;
        await confirmPayment(bookingId, payMethod);
        setStep(3);
    };

    if (step === 3) {
        return (
            <div className="book-tour">
                <div className="container">
                    <div className="booking-success-page fade-in">
                        <div className="success-check"><CheckCircle size={40} /></div>
                        <h2>Booking Confirmed! 🎉</h2>
                        <p>Your tour to <strong>{pkg.title}</strong> has been booked successfully. You'll receive confirmation details shortly.</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <Link to="/my-bookings" className="btn btn-primary">View My Bookings</Link>
                            <Link to="/packages" className="btn btn-secondary">Browse More</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <h1>Book Your Tour</h1>
                    <p>Complete your booking in a few simple steps</p>
                </div>
            </div>

            <section className="book-tour">
                <div className="container">
                    <button onClick={() => navigate(-1)} className="btn btn-ghost mb-6">
                        <ArrowLeft size={18} /> Back
                    </button>

                    <div className="booking-steps">
                        <div className={`booking-step ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`}>
                            <span>1</span> Travel Details
                        </div>
                        <div className={`booking-step ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}>
                            <span>2</span> Payment
                        </div>
                        <div className={`booking-step ${step >= 3 ? 'active' : ''}`}>
                            <span>3</span> Confirmation
                        </div>
                    </div>

                    <div className="book-tour-grid">
                        <div className="book-form-card">
                            {step === 1 && (
                                <>
                                    <h2>Travel Details</h2>
                                    {error && <div className="auth-error">{error}</div>}
                                    <form className="book-form" onSubmit={handleBooking}>
                                        <div className="form-group">
                                            <label className="form-label">Traveler Name</label>
                                            <input className="form-input" value={user?.name || ''} disabled />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Travel Date</label>
                                                <input
                                                    className="form-input"
                                                    type="date"
                                                    value={travelDate}
                                                    onChange={e => setTravelDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Number of Persons</label>
                                                <input
                                                    className="form-input"
                                                    type="number"
                                                    min="1"
                                                    max={pkg.maxPersons}
                                                    value={persons}
                                                    onChange={e => setPersons(parseInt(e.target.value) || 1)}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input className="form-input" value={user?.email || ''} disabled />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone</label>
                                            <input className="form-input" value={user?.phone || ''} disabled />
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }}>
                                            Proceed to Payment
                                        </button>
                                    </form>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <h2>Select Payment Method</h2>
                                    <div className="payment-methods">
                                        {[
                                            { id: 'upi', label: 'UPI Payment', desc: 'Google Pay, PhonePe, Paytm', icon: Smartphone },
                                            { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Rupay', icon: CreditCard },
                                            { id: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: IndianRupee },
                                            { id: 'cash', label: 'Pay at Office', desc: 'Cash payment', icon: Banknote },
                                        ].map(m => (
                                            <div
                                                key={m.id}
                                                className={`payment-method ${payMethod === m.id ? 'selected' : ''}`}
                                                onClick={() => setPayMethod(m.id)}
                                            >
                                                <div className="method-icon"><m.icon size={20} /></div>
                                                <div>
                                                    <h4>{m.label}</h4>
                                                    <p>{m.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                        <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                                        <button className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={!payMethod} onClick={handlePayment}>
                                            <CheckCircle size={18} /> Pay ₹{totalAmount.toLocaleString()}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Summary Sidebar */}
                        <div className="book-summary">
                            <div className="summary-card">
                                <img src={pkg.image} alt={pkg.title} className="summary-image" />
                                <div className="summary-body">
                                    <h3>{pkg.title}</h3>
                                    <div className="summary-location"><MapPin size={14} /> {pkg.location}</div>
                                    <div className="price-breakdown">
                                        <div className="price-row">
                                            <span>₹{pkg.price.toLocaleString()} × {persons} person(s)</span>
                                            <span>₹{totalAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="price-row">
                                            <span>Duration</span>
                                            <span>{pkg.duration}</span>
                                        </div>
                                        {travelDate && (
                                            <div className="price-row">
                                                <span>Travel Date</span>
                                                <span>{travelDate}</span>
                                            </div>
                                        )}
                                        <div className="price-row">
                                            <span className="savings">You save</span>
                                            <span className="savings">₹{savings.toLocaleString()}</span>
                                        </div>
                                        <div className="price-row total">
                                            <span>Total</span>
                                            <span>₹{totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
