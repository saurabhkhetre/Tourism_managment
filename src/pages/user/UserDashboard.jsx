import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBookings } from '../../contexts/BookingContext';
import { CalendarCheck, CreditCard, Package, MapPin, ArrowRight, Star, TrendingUp } from 'lucide-react';
import './UserDashboard.css';

export default function UserDashboard() {
    const { user } = useAuth();
    const { bookings, loadMyBookings } = useBookings();

    useEffect(() => { loadMyBookings(); }, []);

    const myBookings = bookings;
    const totalSpent = myBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalAmount, 0);
    const activeBookings = myBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
    const completedBookings = myBookings.filter(b => b.status === 'completed');

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <h1>My Dashboard</h1>
                    <p>Manage your bookings and travel plans</p>
                </div>
            </div>

            <section className="user-dashboard">
                <div className="container">
                    <div className="dashboard-welcome">
                        <img src={user?.avatar} alt={user?.name} className="welcome-avatar" />
                        <div>
                            <h2>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
                            <p>Email: {user?.email} • Phone: {user?.phone} • Member since {user?.joinedAt}</p>
                        </div>
                    </div>

                    <div className="dashboard-stats">
                        <div className="dash-stat">
                            <div className="stat-icon" style={{ background: 'var(--primary-100)', color: 'var(--primary)' }}><CalendarCheck size={22} /></div>
                            <div className="stat-value">{myBookings.length}</div>
                            <div className="stat-label">Total Bookings</div>
                        </div>
                        <div className="dash-stat">
                            <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}><Package size={22} /></div>
                            <div className="stat-value">{activeBookings.length}</div>
                            <div className="stat-label">Active Trips</div>
                        </div>
                        <div className="dash-stat">
                            <div className="stat-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}><Star size={22} /></div>
                            <div className="stat-value">{completedBookings.length}</div>
                            <div className="stat-label">Completed</div>
                        </div>
                        <div className="dash-stat">
                            <div className="stat-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}><TrendingUp size={22} /></div>
                            <div className="stat-value">₹{totalSpent.toLocaleString()}</div>
                            <div className="stat-label">Total Spent</div>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h3>Quick Actions</h3>
                        <div className="quick-actions">
                            <Link to="/packages" className="quick-action-btn">
                                <MapPin size={20} /> Browse Packages
                            </Link>
                            <Link to="/my-bookings" className="quick-action-btn">
                                <CalendarCheck size={20} /> My Bookings
                            </Link>
                            <Link to="/contact" className="quick-action-btn">
                                <CreditCard size={20} /> Contact Support
                            </Link>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h3>Recent Bookings</h3>
                        {myBookings.length === 0 ? (
                            <div className="empty-state" style={{ padding: '40px' }}>
                                <CalendarCheck size={48} />
                                <h3>No bookings yet</h3>
                                <p>Start exploring our amazing tour packages!</p>
                                <Link to="/packages" className="btn btn-primary mt-4">Browse Packages</Link>
                            </div>
                        ) : (
                            myBookings.slice(0, 5).map(b => (
                                <div key={b.id} className="recent-booking-card">
                                    <div className="recent-booking-info">
                                        <CalendarCheck size={20} style={{ color: 'var(--primary)' }} />
                                        <div>
                                            <h4>{b.packageTitle}</h4>
                                            <p>Travel Date: {b.travelDate} • {b.persons} person(s) • ₹{b.totalAmount?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <span className={`badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}`}>
                                        {b.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
