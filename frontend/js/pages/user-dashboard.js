/**
 * TravelVista — User Dashboard Page
 */
const UserDashboardPage = {
    async render(container) {
        const user = Store.get('user');
        const bookings = await Store.loadMyBookings();
        const totalBookings = bookings.length;
        const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
        const totalSpent = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0);

        container.innerHTML = `
        <div class="user-dashboard"><div class="container">
            <div class="dashboard-welcome">
                <img src="${user?.avatar || ''}" alt="${user?.name}" class="welcome-avatar">
                <div><h2>Welcome, ${user?.name}!</h2><p>Member since ${user?.joinedAt?.slice(0, 10) || 'N/A'}</p></div>
            </div>
            <div class="dashboard-stats">
                <div class="dash-stat"><div class="stat-icon" style="background:#dbeafe;color:#2563eb">${Icons.calendarCheck(22)}</div><div class="stat-value">${totalBookings}</div><div class="stat-label">Total Bookings</div></div>
                <div class="dash-stat"><div class="stat-icon" style="background:#d1fae5;color:#059669">${Icons.checkCircle(22)}</div><div class="stat-value">${activeBookings}</div><div class="stat-label">Active Trips</div></div>
                <div class="dash-stat"><div class="stat-icon" style="background:#fef3c7;color:#d97706">${Icons.indianRupee(22)}</div><div class="stat-value">₹${totalSpent.toLocaleString()}</div><div class="stat-label">Total Spent</div></div>
                <div class="dash-stat"><div class="stat-icon" style="background:#fce7f3;color:#db2777">${Icons.star(22, 'currentColor')}</div><div class="stat-value">${Store.get('reviews').length}</div><div class="stat-label">Reviews</div></div>
            </div>
            <div class="dashboard-section">
                <h3>Quick Actions</h3>
                <div class="quick-actions">
                    <a href="#/packages" class="quick-action-btn">${Icons.search(20)} Browse Packages</a>
                    <a href="#/my-bookings" class="quick-action-btn">${Icons.calendarCheck(20)} My Bookings</a>
                    <a href="#/contact" class="quick-action-btn">${Icons.messageSquare(20)} Contact Support</a>
                </div>
            </div>
            <div class="dashboard-section">
                <h3>Recent Bookings</h3>
                ${bookings.length === 0 ? '<div class="empty-state"><p>No bookings yet. <a href="#/packages">Browse packages</a> to get started!</p></div>' :
                bookings.slice(0, 5).map(b => `
                    <div class="recent-booking-card">
                        <div class="recent-booking-info">
                            <div class="booking-icon">${Icons.package(20)}</div>
                            <div><h4>${b.packageTitle}</h4><p>${b.travelDate} · ${b.persons} person(s)</p></div>
                        </div>
                        <span class="badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}">${b.status}</span>
                    </div>`).join('')}
            </div>
        </div></div>`;
    }
};
