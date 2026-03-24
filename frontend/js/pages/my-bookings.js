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
                        <div id="upi-input-container" style="display:none; margin-top: 15px; text-align: center; border-top: 1px solid var(--border); padding-top: 15px;">
                            <h4 style="margin-bottom: 10px;">Scan to Pay</h4>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=clashofclansth703-1@oksbi%26pn=Saurabh%20Khetre%26cu=INR" alt="Google Pay QR Code" style="width: 200px; height: 200px; border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--border);">
                            <p style="margin-bottom: 15px; font-size: 14px; font-weight: bold;">UPI ID: clashofclansth703-1@oksbi</p>
                            
                            <label style="display:block; margin-bottom: 5px; font-weight: 500; text-align: left;">After paying, enter your UPI ID for verification</label>
                            <input type="text" id="upi-id-input" class="form-control" placeholder="e.g. username@upi" />
                            <small id="upi-error" style="color:var(--danger); display:none; margin-top: 5px; text-align: left;">Please enter a valid UPI ID (e.g. name@bank)</small>
                        </div>
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
                if (selectedMethod === 'UPI') {
                    document.getElementById('upi-input-container').style.display = 'block';
                }
                document.getElementById('confirm-pay-btn').disabled = false;
            });
        });

        document.getElementById('confirm-pay-btn')?.addEventListener('click', async () => {
            if (selectedBookingId && selectedMethod) {
                if (selectedMethod === 'UPI') {
                    const upiId = document.getElementById('upi-id-input').value.trim();
                    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
                    if (!upiRegex.test(upiId)) {
                        document.getElementById('upi-error').style.display = 'block';
                        return;
                    }
                    document.getElementById('upi-error').style.display = 'none';
                }
                
                const btn = document.getElementById('confirm-pay-btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Processing Payment...';
                btn.disabled = true;

                // Simulate processing delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                await Store.confirmPayment(selectedBookingId, selectedMethod);
                
                // Show success logic in the modal
                document.querySelector('.modal-body').innerHTML = `
                    <div style="text-align: center; padding: 30px;">
                        <div style="color: var(--success); margin-bottom: 15px;">
                            ${Icons.checkCircle(48)}
                        </div>
                        <h2 style="color: var(--success);">Payment is done successfully!</h2>
                        <p style="margin-top: 10px; color: var(--text-muted);">Your booking is now confirmed.</p>
                    </div>
                `;
                btn.innerHTML = 'Close Verification';
                btn.disabled = false;
                
                // Change button behavior to close the modal and reload
                btn.onclick = () => {
                    document.getElementById('pay-modal').style.display = 'none';
                    Router.resolve();
                };
            }
        });
    }
};
