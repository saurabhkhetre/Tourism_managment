import { useEffect } from 'react';
import { usePackages } from '../../contexts/PackageContext';
import { useBookings } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import { useReviews } from '../../contexts/ReviewContext';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './AdminDashboard.css';

const COLORS = ['#0891b2', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminReports() {
    const { packages, loadAllPackages } = usePackages();
    const { bookings, getTotalRevenue, getMonthlyRevenue, loadAllBookings } = useBookings();
    const { users, getAllUsers } = useAuth();
    const { reviews, loadAllReviews } = useReviews();

    useEffect(() => {
        loadAllPackages();
        loadAllBookings();
        loadAllReviews();
        getAllUsers();
    }, []);

    const totalRevenue = getTotalRevenue();
    const monthlyData = getMonthlyRevenue();

    // Booking status distribution
    const statusData = [
        { name: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
        { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
        { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length },
        { name: 'Completed', value: bookings.filter(b => b.status === 'completed').length },
    ].filter(d => d.value > 0);

    // Category distribution
    const categoryData = {};
    packages.forEach(p => { categoryData[p.category] = (categoryData[p.category] || 0) + 1; });
    const catData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

    // Top packages by booking count
    const pkgBookings = {};
    bookings.forEach(b => { pkgBookings[b.packageTitle] = (pkgBookings[b.packageTitle] || 0) + 1; });
    const topPackages = Object.entries(pkgBookings).map(([name, count]) => ({ name: name.length > 20 ? name.slice(0, 20) + '...' : name, bookings: count })).sort((a, b) => b.bookings - a.bookings).slice(0, 6);

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div><h1>Reports & Analytics</h1><p>Comprehensive business insights</p></div>
            </div>

            <div className="admin-stats">
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}><span style={{ fontSize: '1.5rem' }}>💰</span></div>
                    <div><div className="stat-value">₹{totalRevenue.toLocaleString()}</div><div className="stat-label">Total Revenue</div></div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}><span style={{ fontSize: '1.5rem' }}>📊</span></div>
                    <div><div className="stat-value">{bookings.length}</div><div className="stat-label">Total Bookings</div></div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}><span style={{ fontSize: '1.5rem' }}>👥</span></div>
                    <div><div className="stat-value">{users?.length || 0}</div><div className="stat-label">Total Users</div></div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#fce7f3', color: '#db2777' }}><span style={{ fontSize: '1.5rem' }}>⭐</span></div>
                    <div><div className="stat-value">{reviews.length}</div><div className="stat-label">Total Reviews</div></div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="admin-chart-container">
                <h3>📈 Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={val => [`₹${val.toLocaleString()}`, 'Revenue']} />
                        <Area type="monotone" dataKey="revenue" stroke="#0891b2" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="admin-grid-2">
                {/* Booking Status Pie */}
                <div className="admin-chart-container">
                    <h3>📊 Booking Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label>
                                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Packages Bar */}
                <div className="admin-chart-container">
                    <h3>🏆 Top Booked Packages</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={topPackages} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
                            <Tooltip />
                            <Bar dataKey="bookings" fill="#0891b2" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Distribution */}
            <div className="admin-chart-container">
                <h3>🗂️ Package Categories</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie data={catData} cx="50%" cy="50%" outerRadius={100} paddingAngle={3} dataKey="value" label>
                            {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
