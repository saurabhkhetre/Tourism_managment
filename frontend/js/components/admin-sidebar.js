/**
 * TravelVista — Admin Sidebar Component
 */
const AdminSidebar = {
    collapsed: false,

    render(container) {
        const hash = Router.getHash();
        const items = [
            { path: '/admin', icon: 'layoutDashboard', label: 'Dashboard', exact: true },
            { path: '/admin/packages', icon: 'package', label: 'Packages' },
            { path: '/admin/bookings', icon: 'calendarCheck', label: 'Bookings' },
            { path: '/admin/users', icon: 'users', label: 'Users' },
            { path: '/admin/reviews', icon: 'star', label: 'Reviews' },
            { path: '/admin/enquiries', icon: 'messageSquare', label: 'Enquiries' },
            { path: '/admin/hotels', icon: 'hotel', label: 'Hotels' },
            { path: '/admin/transport', icon: 'truck', label: 'Transport' },
            { path: '/admin/reports', icon: 'barChart3', label: 'Reports' },
            { path: '/admin/settings', icon: 'settings', label: 'Settings' },
        ];

        const isActive = (item) => {
            if (item.exact) return hash === item.path;
            return hash.startsWith(item.path);
        };

        container.innerHTML = `
        <aside class="admin-sidebar ${this.collapsed ? 'collapsed' : ''}" id="admin-sidebar">
            <div class="sidebar-header">
                ${!this.collapsed ? `<div class="sidebar-brand">${Icons.compass(24)} <span class="sidebar-title">TravelVista</span></div>` : ''}
                <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle sidebar">
                    ${this.collapsed ? Icons.chevronRight(18) : Icons.chevronLeft(18)}
                </button>
            </div>
            ${!this.collapsed ? '<div class="sidebar-label">MANAGEMENT</div>' : ''}
            <nav class="sidebar-nav">
                ${items.map(item => `
                    <a href="#${item.path}" class="sidebar-link ${isActive(item) ? 'active' : ''}" title="${item.label}">
                        ${Icons[item.icon](20)}
                        ${!this.collapsed ? `<span>${item.label}</span>` : ''}
                    </a>
                `).join('')}
            </nav>
        </aside>`;
    },

    mount() {
        const toggle = document.getElementById('sidebar-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                this.collapsed = !this.collapsed;
                Router.resolve();
            });
        }
    }
};
