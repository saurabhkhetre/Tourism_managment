import { useEffect } from 'react';
import { usePackages } from '../../contexts/PackageContext';
import { useBookings } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import { useReviews } from '../../contexts/ReviewContext';
import { useEnquiries } from '../../contexts/EnquiryContext';
import { Package, CalendarCheck, Users, IndianRupee, TrendingUp, Star, MessageSquare, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { packages, loadAllPackages } = usePackages();
    const { bookings, getTotalRevenue, getMonthlyRevenue, loadAllBookings } = useBookings();
    const { users } = useAuth();
    const { reviews, loadAllReviews } = useReviews();
    const { enquiries, loadEnquiries } = useEnquiries();
    const { getAllUsers } = useAuth();

    useEffect(() => {
        loadAllPackages();
        loadAllBookings();
        loadAllReviews();
        loadEnquiries();
        getAllUsers();
    }, []);

    const revenue = getTotalRevenue();
    const monthlyData = getMonthlyRevenue();
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const openEnquiries = enquiries.filter(e => e.status === 'open').length;
    const activePackages = packages.filter(p => p.active).length;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's an overview of your travel business.</p>
                </div>
            </div>

            <div className="admin-stats">
                <Link to="/admin/packages" className="admin-stat-card stat-card-link">
                    <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}><Package size={24} /></div>
                    <div>
                        <div className="stat-value">{packages.length}</div>
                        <div className="stat-label">Total Packages ({activePackages} active)</div>
                    </div>
                    <ArrowUpRight size={16} className="stat-arrow" />
                </Link>
                <Link to="/admin/bookings" className="admin-stat-card stat-card-link">
                    <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}><CalendarCheck size={24} /></div>
                    <div>
                        <div className="stat-value">{bookings.length}</div>
                        <div className="stat-label">Total Bookings ({pendingBookings} pending)</div>
                    </div>
                    <ArrowUpRight size={16} className="stat-arrow" />
                </Link>
                <Link to="/admin/users" className="admin-stat-card stat-card-link">
                    <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><Users size={24} /></div>
                    <div>
                        <div className="stat-value">{users.length}</div>
                        <div className="stat-label">Registered Users</div>
                    </div>
                    <ArrowUpRight size={16} className="stat-arrow" />
                </Link>
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}><IndianRupee size={24} /></div>
                    <div>
                        <div className="stat-value">₹{revenue.toLocaleString()}</div>
                        <div className="stat-label">Total Revenue</div>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="admin-chart-container">
                <h3><TrendingUp size={20} style={{ color: 'var(--primary)' }} /> Monthly Revenue</h3>
                {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']} />
                            <Area type="monotone" dataKey="revenue" stroke="#0891b2" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="empty-state" style={{ padding: '40px 0' }}>
                        <TrendingUp size={40} />
                        <p>Revenue chart will appear when there are paid bookings.</p>
                    </div>
                )}
            </div>

            <div className="admin-grid-2">
                {/* Recent Bookings */}
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h3>Recent Bookings</h3>
                        <Link to="/admin/bookings" className="btn btn-ghost btn-sm">View All</Link>
                    </div>
                    {bookings.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Package</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.slice(0, 5).map(b => (
                                    <tr key={b.id}>
                                        <td style={{ fontWeight: 500 }}>{b.packageTitle}</td>
                                        <td>{b.travelDate}</td>
                                        <td>₹{b.totalAmount?.toLocaleString()}</td>
                                        <td>
                                            <span className={`badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="empty-state" style={{ padding: '32px' }}>
                            <p>No bookings yet.</p>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Link to="/admin/reviews" className="admin-stat-card stat-card-link">
                        <div className="stat-icon" style={{ background: '#fce7f3', color: '#db2777' }}><Star size={24} /></div>
                        <div>
                            <div className="stat-value">{reviews.length}</div>
                            <div className="stat-label">Total Reviews</div>
                        </div>
                        <ArrowUpRight size={16} className="stat-arrow" />
                    </Link>
                    <Link to="/admin/enquiries" className="admin-stat-card stat-card-link">
                        <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><MessageSquare size={24} /></div>
                        <div>
                            <div className="stat-value">{openEnquiries}</div>
                            <div className="stat-label">Open Enquiries</div>
                        </div>
                        <ArrowUpRight size={16} className="stat-arrow" />
                    </Link>
                    <div className="admin-table-container">
                        <div className="admin-table-header">
                            <h3>Popular Packages</h3>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr><th>Package</th><th>Rating</th></tr>
                            </thead>
                            <tbody>
                                {[...packages].sort((a, b) => b.rating - a.rating).slice(0, 4).map(p => (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: 500 }}>{p.title}</td>
                                        <td><span style={{ color: 'var(--accent)', fontWeight: 600 }}>⭐ {p.rating}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
