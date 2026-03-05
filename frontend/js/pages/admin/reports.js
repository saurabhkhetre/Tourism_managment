/**
 * Admin Reports Page
 */
const AdminReportsPage = {
    async render(container) {
        const bookings = Store.get('bookings');
        const revenue = Store.getTotalRevenue();
        const monthlyData = Store.getMonthlyRevenue();
        const paid = bookings.filter(b => b.paymentStatus === 'paid').length;
        const pending = bookings.filter(b => b.status === 'pending').length;
        const confirmed = bookings.filter(b => b.status === 'confirmed').length;
        const cancelled = bookings.filter(b => b.status === 'cancelled').length;

        container.innerHTML = `
        <div class="admin-page">
            <div class="admin-page-header"><div><h1>Reports & Analytics</h1><p>Overview of your business performance</p></div></div>
            <div class="admin-stats">
                <div class="admin-stat-card"><div class="stat-icon" style="background:#ede9fe;color:#7c3aed">${Icons.indianRupee(24)}</div><div><div class="stat-value">₹${revenue.toLocaleString()}</div><div class="stat-label">Total Revenue</div></div></div>
                <div class="admin-stat-card"><div class="stat-icon" style="background:#d1fae5;color:#059669">${Icons.checkCircle(24)}</div><div><div class="stat-value">${confirmed}</div><div class="stat-label">Confirmed Bookings</div></div></div>
                <div class="admin-stat-card"><div class="stat-icon" style="background:#fef3c7;color:#d97706">${Icons.clock(24)}</div><div><div class="stat-value">${pending}</div><div class="stat-label">Pending Bookings</div></div></div>
                <div class="admin-stat-card"><div class="stat-icon" style="background:#fee2e2;color:#dc2626">${Icons.xCircle(24)}</div><div><div class="stat-value">${cancelled}</div><div class="stat-label">Cancelled Bookings</div></div></div>
            </div>
            <div class="admin-grid-2">
                <div class="admin-chart-container"><h3>${Icons.trendingUp(20)} Monthly Revenue</h3>
                    ${monthlyData.length > 0 ? `<div class="chart-bars">${monthlyData.map(m => `<div class="chart-bar-item"><div class="chart-bar" style="height:${Math.max((m.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 200, 20)}px"></div><div class="chart-label">${m.month}</div><div class="chart-value">₹${m.revenue.toLocaleString()}</div></div>`).join('')}</div>` : '<div class="empty-state"><p>No revenue data yet.</p></div>'}
                </div>
                <div class="admin-chart-container"><h3>${Icons.barChart3(20)} Booking Breakdown</h3>
                    <div style="display:flex;flex-direction:column;gap:var(--space-4);padding:var(--space-4) 0">
                        <div class="stat-bar"><span>Paid</span><div class="bar-bg"><div class="bar-fill" style="width:${bookings.length ? paid / bookings.length * 100 : 0}%;background:var(--success)"></div></div><span>${paid}</span></div>
                        <div class="stat-bar"><span>Confirmed</span><div class="bar-bg"><div class="bar-fill" style="width:${bookings.length ? confirmed / bookings.length * 100 : 0}%;background:var(--primary)"></div></div><span>${confirmed}</span></div>
                        <div class="stat-bar"><span>Pending</span><div class="bar-bg"><div class="bar-fill" style="width:${bookings.length ? pending / bookings.length * 100 : 0}%;background:var(--accent)"></div></div><span>${pending}</span></div>
                        <div class="stat-bar"><span>Cancelled</span><div class="bar-bg"><div class="bar-fill" style="width:${bookings.length ? cancelled / bookings.length * 100 : 0}%;background:var(--danger)"></div></div><span>${cancelled}</span></div>
                    </div>
                </div>
            </div>
        </div>`;
    }
};
