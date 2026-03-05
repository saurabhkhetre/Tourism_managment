import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Package, CalendarCheck, Users, Star,
    MessageSquare, BarChart3, Settings, Hotel, Truck, ChevronLeft, ChevronRight, Compass
} from 'lucide-react';
import { useState } from 'react';
import './AdminSidebar.css';

const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/admin/packages', icon: Package, label: 'Packages' },
    { path: '/admin/bookings', icon: CalendarCheck, label: 'Bookings' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/reviews', icon: Star, label: 'Reviews' },
    { path: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries' },
    { path: '/admin/hotels', icon: Hotel, label: 'Hotels' },
    { path: '/admin/transport', icon: Truck, label: 'Transport' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!collapsed && (
                    <div className="sidebar-brand">
                        <Compass size={24} className="sidebar-brand-icon" />
                        <span className="sidebar-title">TravelVista</span>
                    </div>
                )}
                <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {!collapsed && <div className="sidebar-label">MANAGEMENT</div>}

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        title={item.label}
                    >
                        <item.icon size={20} />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
