import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Globe } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

export default function AdminLayout() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated || user?.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-wrapper">
                <header className="admin-header">
                    <div className="admin-header-left">
                        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-header-link">
                            <Globe size={16} /> Visit Website
                        </a>
                    </div>
                    <div className="admin-header-right">
                        <div className="admin-header-user">
                            <img src={user?.avatar} alt={user?.name} className="admin-header-avatar" />
                            <div className="admin-header-user-info">
                                <span className="admin-header-name">{user?.name}</span>
                                <span className="admin-header-role">Administrator</span>
                            </div>
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={handleLogout} title="Logout">
                            <LogOut size={16} />
                        </button>
                    </div>
                </header>
                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
