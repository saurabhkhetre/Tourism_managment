/**
 * TravelVista — Navbar Component
 */
const Navbar = {
    render(container) {
        const user = Store.get('user');
        const isAuth = Store.get('isAuthenticated');
        const hash = Router.getHash();
        const links = [
            { path: '/', label: 'Home' },
            { path: '/packages', label: 'Packages' },
            { path: '/about', label: 'About' },
            { path: '/contact', label: 'Contact' },
        ];
        const isActive = (p) => hash === p ? 'active' : '';

        container.innerHTML = `
        <div class="navbar">
            <div class="navbar-container">
                <a href="#/" class="navbar-logo">
                    ${Icons.compass(32)}
                    <span class="logo-text">Travel<span class="logo-accent">Vista</span></span>
                </a>
                <div class="navbar-links" id="navbar-links">
                    ${links.map(l => `<a href="#${l.path}" class="nav-link ${isActive(l.path)}">${l.label}</a>`).join('')}
                    ${!isAuth ? `<div class="nav-auth-mobile">
                        <a href="#/login" class="btn btn-secondary btn-sm">Login</a>
                        <a href="#/register" class="btn btn-primary btn-sm">Register</a>
                    </div>` : ''}
                </div>
                <div class="navbar-actions">
                    ${!isAuth ? `
                        <div class="nav-auth-desktop">
                            <a href="#/login" class="btn btn-secondary btn-sm">Login</a>
                            <a href="#/register" class="btn btn-primary btn-sm">Register</a>
                        </div>
                    ` : `
                        <div class="nav-user-dropdown" id="nav-dropdown">
                            <button class="nav-user-btn" id="nav-user-btn">
                                <img src="${user?.avatar || ''}" alt="${user?.name || ''}" class="nav-avatar">
                                <span class="nav-user-name">${user?.name?.split(' ')[0] || ''}</span>
                                ${Icons.chevronDown(16)}
                            </button>
                            <div class="dropdown-menu" id="dropdown-menu" style="display:none">
                                <div class="dropdown-user-info">
                                    <span class="dropdown-user-name">${user?.name || ''}</span>
                                    <span class="dropdown-user-email">${user?.email || ''}</span>
                                </div>
                                <div class="dropdown-divider"></div>
                                <a href="#/dashboard" class="dropdown-item">${Icons.layoutDashboard(16)} Dashboard</a>
                                <a href="#/my-bookings" class="dropdown-item">${Icons.calendarCheck(16)} My Bookings</a>
                                ${user?.role === 'admin' ? `
                                    <div class="dropdown-divider"></div>
                                    <a href="#/admin" class="dropdown-item dropdown-admin">${Icons.layoutDashboard(16)} Admin Panel</a>
                                ` : ''}
                                <div class="dropdown-divider"></div>
                                <button class="dropdown-item dropdown-logout" id="nav-logout-btn">${Icons.logOut(16)} Logout</button>
                            </div>
                        </div>
                    `}
                    <button class="navbar-toggle" id="navbar-toggle" aria-label="Toggle menu">
                        ${Icons.menu(24)}
                    </button>
                </div>
            </div>
        </div>`;
    },

    mount() {
        const toggle = document.getElementById('navbar-toggle');
        const links = document.getElementById('navbar-links');
        const userBtn = document.getElementById('nav-user-btn');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const logoutBtn = document.getElementById('nav-logout-btn');

        if (toggle && links) {
            toggle.addEventListener('click', () => {
                links.classList.toggle('active');
                toggle.innerHTML = links.classList.contains('active') ? Icons.x(24) : Icons.menu(24);
            });
        }

        if (userBtn && dropdownMenu) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
            });
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#nav-dropdown')) {
                    dropdownMenu.style.display = 'none';
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Store.logout();
                Router.navigate('/');
            });
        }
    }
};
