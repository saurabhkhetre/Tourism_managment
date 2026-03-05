/**
 * TravelVista — Main Application Entry Point
 * Registers all routes and initializes the app.
 */
(async function initApp() {
    // Load initial data
    Store.loadPackages();
    Store.loadRecentReviews();

    // ── Public routes ──
    Router.add('/', (c) => HomePage.render(c));
    Router.add('/packages', (c) => PackagesPage.render(c));
    Router.add('/packages/:id', (c, p) => PackageDetailPage.render(c, p));
    Router.add('/about', (c) => AboutPage.render(c));
    Router.add('/contact', (c) => ContactPage.render(c));

    // ── Auth routes ──
    Router.add('/login', (c) => LoginPage.render(c));
    Router.add('/register', (c) => RegisterPage.render(c));

    // ── User routes (protected) ──
    Router.add('/dashboard', (c) => UserDashboardPage.render(c), { protected: true });
    Router.add('/my-bookings', (c) => MyBookingsPage.render(c), { protected: true });
    Router.add('/book/:id', (c, p) => BookTourPage.render(c, p), { protected: true });

    // ── Admin routes ──
    Router.add('/admin', (c) => AdminDashboardPage.render(c), { admin: true });
    Router.add('/admin/packages', (c) => AdminPackagesPage.render(c), { admin: true });
    Router.add('/admin/bookings', (c) => AdminBookingsPage.render(c), { admin: true });
    Router.add('/admin/users', (c) => AdminUsersPage.render(c), { admin: true });
    Router.add('/admin/reviews', (c) => AdminReviewsPage.render(c), { admin: true });
    Router.add('/admin/enquiries', (c) => AdminEnquiriesPage.render(c), { admin: true });
    Router.add('/admin/hotels', (c) => AdminHotelsPage.render(c), { admin: true });
    Router.add('/admin/transport', (c) => AdminTransportPage.render(c), { admin: true });
    Router.add('/admin/reports', (c) => AdminReportsPage.render(c), { admin: true });
    Router.add('/admin/settings', (c) => AdminSettingsPage.render(c), { admin: true });

    // Start router
    Router.init();
})();
