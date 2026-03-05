import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, Compass, User, LogOut, LayoutDashboard, ChevronDown, CalendarCheck } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/packages', label: 'Packages' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/');
        setDropdownOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <Compass className="logo-icon" />
                    <span className="logo-text">Travel<span className="logo-accent">Vista</span></span>
                </Link>

                <div className={`navbar-links ${mobileOpen ? 'active' : ''}`}>
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {!isAuthenticated ? (
                        <div className="nav-auth-mobile">
                            <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMobileOpen(false)}>Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>Register</Link>
                        </div>
                    ) : null}
                </div>

                <div className="navbar-actions">
                    {!isAuthenticated ? (
                        <div className="nav-auth-desktop">
                            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                        </div>
                    ) : (
                        <div className="nav-user-dropdown" ref={dropdownRef}>
                            <button className="nav-user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <img src={user?.avatar} alt={user?.name} className="nav-avatar" />
                                <span className="nav-user-name">{user?.name?.split(' ')[0]}</span>
                                <ChevronDown size={16} className={`dropdown-chevron ${dropdownOpen ? 'open' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-user-info">
                                        <span className="dropdown-user-name">{user?.name}</span>
                                        <span className="dropdown-user-email">{user?.email}</span>
                                    </div>
                                    <div className="dropdown-divider" />
                                    <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        <LayoutDashboard size={16} /> Dashboard
                                    </Link>
                                    <Link to="/my-bookings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        <CalendarCheck size={16} /> My Bookings
                                    </Link>
                                    {user?.role === 'admin' && (
                                        <>
                                            <div className="dropdown-divider" />
                                            <Link to="/admin" className="dropdown-item dropdown-admin" onClick={() => setDropdownOpen(false)}>
                                                <LayoutDashboard size={16} /> Admin Panel
                                            </Link>
                                        </>
                                    )}
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <button className="navbar-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
