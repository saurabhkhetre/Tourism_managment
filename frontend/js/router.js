/**
 * TravelVista — Simple Hash-based Router
 * Replaces React Router with hash-based routing (#/path).
 */
const Router = {
    routes: [],
    currentPage: null,

    add(path, handler, options = {}) {
        this.routes.push({ path, handler, ...options });
    },

    navigate(path) {
        window.location.hash = '#' + path;
    },

    getHash() {
        return window.location.hash.slice(1) || '/';
    },

    getParams(routePath, actualPath) {
        const routeParts = routePath.split('/');
        const actualParts = actualPath.split('/');
        const params = {};
        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                params[routeParts[i].slice(1)] = actualParts[i];
            }
        }
        return params;
    },

    match(routePath, actualPath) {
        const routeParts = routePath.split('/');
        const actualParts = actualPath.split('/');
        if (routeParts.length !== actualParts.length) return false;
        return routeParts.every((part, i) => part.startsWith(':') || part === actualParts[i]);
    },

    async resolve() {
        const hash = this.getHash();
        // Scroll to top
        window.scrollTo(0, 0);

        for (const route of this.routes) {
            if (this.match(route.path, hash)) {
                // Auth guard
                if (route.protected && !Store.get('isAuthenticated')) {
                    this.navigate('/login');
                    return;
                }
                if (route.admin) {
                    const user = Store.get('user');
                    if (!Store.get('isAuthenticated')) { this.navigate('/login'); return; }
                    if (user?.role !== 'admin') { this.navigate('/'); return; }
                }

                const params = this.getParams(route.path, hash);
                const app = document.getElementById('app');

                // Determine layout
                if (route.admin) {
                    await this.renderAdminLayout(app, route, params);
                } else if (route.noLayout) {
                    app.innerHTML = '';
                    await route.handler(app, params);
                } else {
                    await this.renderPublicLayout(app, route, params);
                }
                return;
            }
        }

        // 404 fallback
        const app = document.getElementById('app');
        await this.renderPublicLayout(app, {
            handler: (container) => {
                container.innerHTML = `
                    <div class="not-found-page">
                        <div class="not-found-content">
                            <h1 class="not-found-code">404</h1>
                            <h2 class="not-found-title">Page Not Found</h2>
                            <p class="not-found-text">The page you're looking for doesn't exist or has been moved.</p>
                            <div class="not-found-actions">
                                <a href="#/" class="btn btn-primary btn-lg">${Icons.home(18)} Back to Home</a>
                                <a href="#/packages" class="btn btn-secondary btn-lg">${Icons.arrowLeft(18)} Browse Packages</a>
                            </div>
                        </div>
                    </div>`;
            }
        }, {});
    },

    async renderPublicLayout(app, route, params) {
        app.innerHTML = '';
        // Navbar
        const nav = document.createElement('nav');
        Navbar.render(nav);
        app.appendChild(nav);
        // Main
        const main = document.createElement('main');
        main.className = 'main-content';
        app.appendChild(main);
        await route.handler(main, params);
        // Footer
        const footer = document.createElement('div');
        Footer.render(footer);
        app.appendChild(footer);
        // Re-bind navbar events
        Navbar.mount();
    },

    async renderAdminLayout(app, route, params) {
        app.innerHTML = '';
        const layout = document.createElement('div');
        layout.className = 'admin-layout';

        // Sidebar
        const sidebar = document.createElement('div');
        AdminSidebar.render(sidebar);
        layout.appendChild(sidebar.firstElementChild || sidebar);

        // Main wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'admin-main-wrapper';

        const user = Store.get('user');
        wrapper.innerHTML = `
            <header class="admin-header">
                <div class="admin-header-left">
                    <a href="#/" class="admin-header-link">${Icons.globe(16)} Visit Website</a>
                </div>
                <div class="admin-header-right">
                    <div class="admin-header-user">
                        <img src="${user?.avatar || ''}" alt="${user?.name || ''}" class="admin-header-avatar">
                        <div class="admin-header-user-info">
                            <span class="admin-header-name">${user?.name || ''}</span>
                            <span class="admin-header-role">Administrator</span>
                        </div>
                    </div>
                    <button class="btn btn-ghost btn-sm" id="admin-logout-btn" title="Logout">${Icons.logOut(16)}</button>
                </div>
            </header>
            <main class="admin-main" id="admin-content"></main>`;
        layout.appendChild(wrapper);
        app.appendChild(layout);

        // Render admin page into content
        const content = document.getElementById('admin-content');
        await route.handler(content, params);

        // Bind events
        AdminSidebar.mount();
        document.getElementById('admin-logout-btn')?.addEventListener('click', () => {
            Store.logout();
            Router.navigate('/');
        });
    },

    init() {
        window.addEventListener('hashchange', () => this.resolve());
        // If no hash, set default
        if (!window.location.hash) window.location.hash = '#/';
        else this.resolve();
    }
};
