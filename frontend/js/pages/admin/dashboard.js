/**
 * TravelVista — Admin Dashboard
 */
const AdminDashboardPage = {
    async render(container) {
        await Promise.all([Store.loadAllPackages(), Store.loadAllBookings(), Store.loadAllReviews(), Store.loadEnquiries(), Store.getAllUsers()]);
        const pkgs = Store.get('packages');
        const bookings = Store.get('bookings');
        const users = Store.get('users');
        const reviews = Store.get('reviews');
        const enquiries = Store.get('enquiries');
        const revenue = Store.getTotalRevenue();
        const pending = bookings.filter(b => b.status === 'pending').length;
        const openEnq = enquiries.filter(e => e.status === 'open').length;

        container.innerHTML = `
        <div class="admin-page">
            <div class="admin-page-header"><div><h1>Dashboard</h1><p>Welcome back! Here's an overview of your travel business.</p></div></div>
            <div class="admin-stats">
                <a href="#/admin/packages" class="admin-stat-card stat-card-link"><div class="stat-icon" style="background:#dbeafe;color:#2563eb">${Icons.package(24)}</div><div><div class="stat-value">${pkgs.length}</div><div class="stat-label">Packages (${pkgs.filter(p => p.active).length} active)</div></div>${Icons.arrowUpRight(16)}</a>
                <a href="#/admin/bookings" class="admin-stat-card stat-card-link"><div class="stat-icon" style="background:#d1fae5;color:#059669">${Icons.calendarCheck(24)}</div><div><div class="stat-value">${bookings.length}</div><div class="stat-label">Bookings (${pending} pending)</div></div>${Icons.arrowUpRight(16)}</a>
                <a href="#/admin/users" class="admin-stat-card stat-card-link"><div class="stat-icon" style="background:#fef3c7;color:#d97706">${Icons.users(24)}</div><div><div class="stat-value">${users.length}</div><div class="stat-label">Users</div></div>${Icons.arrowUpRight(16)}</a>
                <div class="admin-stat-card"><div class="stat-icon" style="background:#ede9fe;color:#7c3aed">${Icons.indianRupee(24)}</div><div><div class="stat-value">₹${revenue.toLocaleString()}</div><div class="stat-label">Revenue</div></div></div>
            </div>
            <div class="admin-grid-2">
                <div class="admin-table-container">
                    <div class="admin-table-header"><h3>Recent Bookings</h3><a href="#/admin/bookings" class="btn btn-ghost btn-sm">View All</a></div>
                    ${bookings.length > 0 ? `<table class="data-table"><thead><tr><th>Package</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>
                        ${bookings.slice(0, 5).map(b => `<tr><td style="font-weight:500">${b.packageTitle}</td><td>${b.travelDate}</td><td>₹${b.totalAmount?.toLocaleString()}</td><td><span class="badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}">${b.status}</span></td></tr>`).join('')}
                    </tbody></table>` : '<div class="empty-state" style="padding:32px"><p>No bookings yet.</p></div>'}
                </div>
                <div style="display:flex;flex-direction:column;gap:var(--space-4)">
                    <a href="#/admin/reviews" class="admin-stat-card stat-card-link"><div class="stat-icon" style="background:#fce7f3;color:#db2777">${Icons.star(24, 'currentColor')}</div><div><div class="stat-value">${reviews.length}</div><div class="stat-label">Reviews</div></div>${Icons.arrowUpRight(16)}</a>
                    <a href="#/admin/enquiries" class="admin-stat-card stat-card-link"><div class="stat-icon" style="background:#fef3c7;color:#d97706">${Icons.messageSquare(24)}</div><div><div class="stat-value">${openEnq}</div><div class="stat-label">Open Enquiries</div></div>${Icons.arrowUpRight(16)}</a>
                    <div class="admin-table-container"><div class="admin-table-header"><h3>Top Packages</h3></div><table class="data-table"><thead><tr><th>Package</th><th>Rating</th></tr></thead><tbody>
                        ${[...pkgs].sort((a, b) => b.rating - a.rating).slice(0, 4).map(p => `<tr><td style="font-weight:500">${p.title}</td><td><span style="color:var(--accent);font-weight:600">⭐ ${p.rating}</span></td></tr>`).join('')}
                    </tbody></table></div>
                </div>
            </div>
        </div>`;
    }
};
