import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBookings } from '../../contexts/BookingContext';
import {
    CalendarCheck, Clock, Users, CreditCard, X, CheckCircle,
    Banknote, Smartphone, IndianRupee
} from 'lucide-react';
import './MyBookings.css';

export default function MyBookings() {
    const { user } = useAuth();
    const { bookings, cancelBooking, confirmPayment, loadMyBookings } = useBookings();
    const [payModal, setPayModal] = useState(null);
    const [payMethod, setPayMethod] = useState('');
    const [paySuccess, setPaySuccess] = useState(false);

    useEffect(() => { loadMyBookings(); }, []);

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            await cancelBooking(id);
        }
    };

    const handlePay = async () => {
        if (!payMethod) return;
        await confirmPayment(payModal, payMethod);
        setPaySuccess(true);
        setTimeout(() => {
            setPayModal(null);
            setPaySuccess(false);
            setPayMethod('');
        }, 2000);
    };

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <h1>My Bookings</h1>
                    <p>View and manage all your tour bookings</p>
                </div>
            </div>

            <section className="my-bookings">
                <div className="container">
                    {bookings.length === 0 ? (
                        <div className="empty-state">
                            <CalendarCheck size={48} />
                            <h3>No bookings yet</h3>
                            <p>You haven't made any bookings. Start exploring our tour packages!</p>
                            <Link to="/packages" className="btn btn-primary mt-4">Browse Packages</Link>
                        </div>
                    ) : (
                        <div className="bookings-list">
                            {bookings.map(b => (
                                <div key={b.id} className="booking-item">
                                    <div className="booking-item-content">
                                        <div className="booking-item-left">
                                            <div className="booking-icon"><CalendarCheck size={22} /></div>
                                            <div>
                                                <h4>{b.packageTitle}</h4>
                                                <div className="booking-meta">
                                                    <span><Clock size={13} /> {b.travelDate}</span>
                                                    <span><Users size={13} /> {b.persons} person(s)</span>
                                                    <span>Booked: {b.createdAt}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="booking-item-right">
                                            <div className="booking-amount">
                                                <div className="amount">₹{b.totalAmount?.toLocaleString()}</div>
                                                <span className={`badge badge-${b.paymentStatus === 'paid' ? 'success' : b.paymentStatus === 'refunded' ? 'info' : 'warning'} payment-status`}>
                                                    {b.paymentStatus}
                                                </span>
                                            </div>
                                            <span className={`badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}`}>
                                                {b.status}
                                            </span>
                                            <div className="booking-actions">
                                                {b.paymentStatus === 'pending' && b.status !== 'cancelled' && (
                                                    <button className="btn btn-primary btn-sm" onClick={() => setPayModal(b.id)}>
                                                        <CreditCard size={14} /> Pay Now
                                                    </button>
                                                )}
                                                {b.status !== 'cancelled' && b.status !== 'completed' && (
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>
                                                        <X size={14} /> Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Payment Modal */}
            {payModal && (
                <div className="modal-backdrop" onClick={() => { setPayModal(null); setPayMethod(''); setPaySuccess(false); }}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        {paySuccess ? (
                            <div className="payment-success">
                                <div className="success-icon"><CheckCircle size={32} /></div>
                                <h3>Payment Successful! 🎉</h3>
                                <p>Your booking has been confirmed.</p>
                            </div>
                        ) : (
                            <>
                                <div className="modal-header">
                                    <h3>Complete Payment</h3>
                                    <button className="btn btn-ghost btn-icon" onClick={() => setPayModal(null)}><X size={20} /></button>
                                </div>
                                <div className="modal-body">
                                    <p style={{ marginBottom: '8px', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Select payment method:</p>
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
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-ghost" onClick={() => setPayModal(null)}>Cancel</button>
                                    <button className="btn btn-primary" disabled={!payMethod} onClick={handlePay}>
                                        <CheckCircle size={16} /> Confirm Payment
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
