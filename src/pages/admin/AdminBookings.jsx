import { useState, useEffect } from 'react';
import { useBookings } from '../../contexts/BookingContext';
import { Search } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminBookings() {
    const { bookings, updateStatus, loadAllBookings } = useBookings();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => { loadAllBookings(); }, []);

    const filtered = bookings.filter(b => {
        const matchSearch = b.packageTitle.toLowerCase().includes(search.toLowerCase()) ||
            b.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !statusFilter || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleStatusChange = async (bookingId, newStatus) => {
        await updateStatus(bookingId, newStatus);
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div><h1>Manage Bookings</h1><p>{bookings.length} total bookings</p></div>
            </div>

            <div className="admin-stats">
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><span style={{ fontSize: '1.2rem' }}>⏳</span></div>
                    <div><div className="stat-value">{bookings.filter(b => b.status === 'pending').length}</div><div className="stat-label">Pending</div></div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}><span style={{ fontSize: '1.2rem' }}>✅</span></div>
                    <div><div className="stat-value">{bookings.filter(b => b.status === 'confirmed').length}</div><div className="stat-label">Confirmed</div></div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}><span style={{ fontSize: '1.2rem' }}>✈️</span></div>
                    <div><div className="stat-value">{bookings.filter(b => b.status === 'completed').length}</div><div className="stat-label">Completed</div></div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}><span style={{ fontSize: '1.2rem' }}>❌</span></div>
                    <div><div className="stat-value">{bookings.filter(b => b.status === 'cancelled').length}</div><div className="stat-label">Cancelled</div></div>
                </div>
            </div>

            <div className="admin-table-container">
                <div className="admin-table-header">
                    <div className="admin-search">
                        <Search size={16} />
                        <input placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select className="form-select" style={{ width: 160, padding: '6px 12px', fontSize: '0.875rem' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Package</th>
                            <th>Travel Date</th>
                            <th>Persons</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(b => (
                            <tr key={b.id}>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{b.id}</td>
                                <td style={{ fontWeight: 500 }}>{b.packageTitle}</td>
                                <td>{b.travelDate}</td>
                                <td>{b.persons}</td>
                                <td style={{ fontWeight: 600 }}>₹{b.totalAmount?.toLocaleString()}</td>
                                <td>
                                    <span className={`badge badge-${b.paymentStatus === 'paid' ? 'success' : b.paymentStatus === 'refunded' ? 'info' : 'warning'}`}>
                                        {b.paymentStatus}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : b.status === 'completed' ? 'info' : 'warning'}`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td>
                                    {b.status !== 'cancelled' && (
                                        <select
                                            className="form-select"
                                            style={{ width: 120, padding: '4px 8px', fontSize: '0.75rem' }}
                                            value={b.status}
                                            onChange={e => handleStatusChange(b.id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
