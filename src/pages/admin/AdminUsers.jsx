import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminUsers() {
    const { getAllUsers, toggleUserBlock, deleteUser } = useAuth();
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers().then(data => setUsers(data || []));
    }, []);

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggle = async (id) => {
        await toggleUserBlock(id);
        const updated = await getAllUsers();
        setUsers(updated || []);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this user permanently?')) {
            await deleteUser(id);
            const updated = await getAllUsers();
            setUsers(updated || []);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div><h1>Manage Users</h1><p>{users.length} registered users</p></div>
            </div>

            <div className="admin-stats">
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}><span style={{ fontSize: '1.2rem' }}>👥</span></div>
                    <div><div className="stat-value">{users.filter(u => u.role === 'user').length}</div><div className="stat-label">Regular Users</div></div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}><span style={{ fontSize: '1.2rem' }}>👑</span></div>
                    <div><div className="stat-value">{users.filter(u => u.role === 'admin').length}</div><div className="stat-label">Admins</div></div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}><span style={{ fontSize: '1.2rem' }}>✅</span></div>
                    <div><div className="stat-value">{users.filter(u => u.active).length}</div><div className="stat-label">Active</div></div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}><span style={{ fontSize: '1.2rem' }}>🚫</span></div>
                    <div><div className="stat-value">{users.filter(u => !u.active).length}</div><div className="stat-label">Blocked</div></div>
                </div>
            </div>

            <div className="admin-table-container">
                <div className="admin-table-header">
                    <div className="admin-search">
                        <Search size={16} />
                        <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(u => (
                            <tr key={u.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <img src={u.avatar} alt={u.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td>{u.phone}</td>
                                <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-info'}`}>{u.role}</span></td>
                                <td>{u.joinedAt}</td>
                                <td><span className={`badge ${u.active ? 'badge-success' : 'badge-danger'}`}>{u.active ? 'Active' : 'Blocked'}</span></td>
                                <td>
                                    <div className="admin-table-actions">
                                        {u.role !== 'admin' && (
                                            <>
                                                <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(u.id)} title={u.active ? 'Block' : 'Unblock'}>
                                                    {u.active ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
                                                </button>
                                                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(u.id)}>
                                                    <Trash2 size={15} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
