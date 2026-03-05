/**
 * TravelVista — My Bookings Page
 */
const MyBookingsPage = {
    async render(container) {
        const bookings = await Store.loadMyBookings();
        container.innerHTML = `
        <div class="page-header"><div class="container"><h1>My Bookings</h1><p>Track and manage your tour bookings</p></div></div>
        <div class="my-bookings"><div class="container">
            ${bookings.length === 0 ? '<div class="empty-state"><h3>No bookings yet</h3><p>Start exploring! <a href="#/packages">Browse packages</a></p></div>' : `
            <div class="bookings-list">
                ${bookings.map(b => `
                <div class="booking-item">
                    <div class="booking-item-content">
                        <div class="booking-item-left">
                            <div class="booking-icon">${Icons.package(22)}</div>
                            <div>
                                <h4>${b.packageTitle}</h4>
                                <div class="booking-meta">
                                    <span>${Icons.calendarCheck(14)} ${b.travelDate}</span>
                                    <span>${Icons.users(14)} ${b.persons} person(s)</span>
                                </div>
                            </div>
                        </div>
                        <div class="booking-item-right">
                            <div class="booking-amount">
                                <div class="amount">₹${b.totalAmount?.toLocaleString()}</div>
                                <span class="badge badge-${b.paymentStatus === 'paid' ? 'success' : 'warning'} payment-status">${b.paymentStatus}</span>
                            </div>
                            <span class="badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}">${b.status}</span>
                            <div class="booking-actions">
                                ${b.paymentStatus !== 'paid' && b.status !== 'cancelled' ? `<button class="btn btn-primary btn-sm pay-btn" data-id="${b.id}">Pay Now</button>` : ''}
                                ${b.status === 'pending' ? `<button class="btn btn-danger btn-sm cancel-btn" data-id="${b.id}">Cancel</button>` : ''}
                            </div>
                        </div>
                    </div>
                </div>`).join('')}
            </div>`}
        </div></div>

        <!-- Payment Modal -->
        <div class="modal-backdrop" id="pay-modal" style="display:none">
            <div class="modal">
                <div class="modal-header"><h3>Select Payment Method</h3><button class="btn btn-ghost btn-sm" id="close-pay-modal">${Icons.x(18)}</button></div>
                <div class="modal-body">
                    <div class="payment-methods">
                        <div class="payment-method" data-method="UPI"><div class="method-icon">${Icons.wallet(20)}</div><div><h4>UPI</h4><p>Pay with Google Pay, PhonePe, etc.</p></div></div>
                        <div class="payment-method" data-method="Card"><div class="method-icon">${Icons.creditCard(20)}</div><div><h4>Credit/Debit Card</h4><p>Visa, Mastercard, RuPay</p></div></div>
                        <div class="payment-method" data-method="Net Banking"><div class="method-icon">${Icons.globe(20)}</div><div><h4>Net Banking</h4><p>All major banks supported</p></div></div>
                    </div>
                </div>
                <div class="modal-footer"><button class="btn btn-primary" id="confirm-pay-btn" disabled>Confirm Payment</button></div>
            </div>
        </div>`;

        let selectedBookingId = null;
        let selectedMethod = null;

        // Pay buttons
        document.querySelectorAll('.pay-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedBookingId = btn.dataset.id;
                document.getElementById('pay-modal').style.display = 'flex';
            });
        });

        // Cancel buttons
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm('Cancel this booking?')) {
                    await Store.cancelBooking(btn.dataset.id);
                    Toast.info('Booking cancelled');
                    Router.resolve();
                }
            });
        });

        // Payment modal
        document.getElementById('close-pay-modal')?.addEventListener('click', () => {
            document.getElementById('pay-modal').style.display = 'none';
        });

        document.querySelectorAll('.payment-method').forEach(m => {
            m.addEventListener('click', () => {
                document.querySelectorAll('.payment-method').forEach(p => p.classList.remove('selected'));
                m.classList.add('selected');
                selectedMethod = m.dataset.method;
                document.getElementById('confirm-pay-btn').disabled = false;
            });
        });

        document.getElementById('confirm-pay-btn')?.addEventListener('click', async () => {
            if (selectedBookingId && selectedMethod) {
                await Store.confirmPayment(selectedBookingId, selectedMethod);
                document.getElementById('pay-modal').style.display = 'none';
                Toast.success('Payment confirmed!');
                Router.resolve();
            }
        });
    }
};
