/**
 * Admin Bookings Page
 */
const AdminBookingsPage = {
    async render(container) {
        const bookings = await Store.loadAllBookings();
        container.innerHTML = `
        <div class="admin-page">
            <div class="admin-page-header"><div><h1>Manage Bookings</h1><p>${bookings.length} total bookings</p></div></div>
            <div class="admin-table-container">
                <div class="admin-table-header"><h3>All Bookings</h3><div class="admin-search">${Icons.search(16)}<input type="text" id="b-search" placeholder="Search..."></div></div>
                <table class="data-table"><thead><tr><th>User</th><th>Package</th><th>Date</th><th>Persons</th><th>Amount</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="b-tbody">${this.rows(bookings)}</tbody></table>
            </div>
        </div>`;

        document.getElementById('b-tbody').addEventListener('click', async (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const id = btn.dataset.id;
            if (btn.classList.contains('confirm-b')) { await Store.updateBookingStatus(id, 'confirmed'); Toast.success('Confirmed!'); Router.resolve(); }
            else if (btn.classList.contains('cancel-b')) { await Store.updateBookingStatus(id, 'cancelled'); Toast.info('Cancelled'); Router.resolve(); }
        });

        document.getElementById('b-search')?.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            document.getElementById('b-tbody').innerHTML = this.rows(bookings.filter(b => b.packageTitle?.toLowerCase().includes(q) || b.userName?.toLowerCase().includes(q)));
        });
    },
    rows(bookings) {
        return bookings.map(b => `<tr><td>${b.userName || 'N/A'}</td><td style="font-weight:500">${b.packageTitle}</td><td>${b.travelDate}</td><td>${b.persons}</td><td>₹${b.totalAmount?.toLocaleString()}</td><td><span class="badge badge-${b.paymentStatus === 'paid' ? 'success' : 'warning'}">${b.paymentStatus}</span></td><td><span class="badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}">${b.status}</span></td><td><div class="admin-table-actions">${b.status === 'pending' ? `<button class="btn btn-sm btn-primary confirm-b" data-id="${b.id}">Confirm</button><button class="btn btn-sm btn-danger cancel-b" data-id="${b.id}">Cancel</button>` : ''}</div></td></tr>`).join('');
    }
};
