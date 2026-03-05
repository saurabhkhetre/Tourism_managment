/**
 * TravelVista — Book Tour Page
 */
const BookTourPage = {
    async render(container, params) {
        const pkg = Store.getPackage(params.id);
        if (!pkg) { container.innerHTML = '<div class="empty-state"><h3>Package not found</h3></div>'; return; }
        const user = Store.get('user');
        const today = new Date().toISOString().split('T')[0];

        container.innerHTML = `
        <div class="page-header"><div class="container"><h1>Book Tour</h1><p>Complete your booking for ${pkg.title}</p></div></div>
        <div class="book-tour"><div class="container">
            <div class="book-tour-grid">
                <div class="book-form-card">
                    <h2>Booking Details</h2>
                    <form class="book-form" id="book-form">
                        <div class="form-row">
                            <div class="form-group"><label class="form-label">Full Name</label><input type="text" class="form-input" id="book-name" value="${user?.name || ''}" required></div>
                            <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="book-email" value="${user?.email || ''}" required></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label class="form-label">Phone</label><input type="tel" class="form-input" id="book-phone" value="${user?.phone || ''}" required></div>
                            <div class="form-group"><label class="form-label">Travel Date</label><input type="date" class="form-input" id="book-date" min="${today}" required></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label class="form-label">Number of Persons</label><input type="number" class="form-input" id="book-persons" min="1" max="${pkg.maxPersons}" value="1"></div>
                            <div class="form-group"><label class="form-label">Special Requirements</label><input type="text" class="form-input" id="book-notes" placeholder="Any special requests?"></div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg" id="book-btn" style="width:100%;margin-top:var(--space-4)">Confirm Booking ${Icons.arrowRight(18)}</button>
                    </form>
                </div>
                <div class="book-summary">
                    <div class="summary-card">
                        <img src="${pkg.image}" alt="${pkg.title}" class="summary-image">
                        <div class="summary-body">
                            <h3>${pkg.title}</h3>
                            <div class="summary-location">${Icons.mapPin(14)} ${pkg.location}</div>
                            <div class="price-breakdown">
                                <div class="price-row"><span>Price per person</span><span>₹${pkg.price.toLocaleString()}</span></div>
                                <div class="price-row"><span>Persons</span><span id="summary-persons">1</span></div>
                                ${pkg.originalPrice > pkg.price ? `<div class="price-row"><span>Savings</span><span class="savings" id="summary-savings">-₹${(pkg.originalPrice - pkg.price).toLocaleString()}</span></div>` : ''}
                                <div class="price-row total"><span>Total</span><span id="summary-total">₹${pkg.price.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div></div>`;

        // Update summary on persons change
        const personsInput = document.getElementById('book-persons');
        const updateSummary = () => {
            const persons = parseInt(personsInput.value) || 1;
            document.getElementById('summary-persons').textContent = persons;
            document.getElementById('summary-total').textContent = '₹' + (pkg.price * persons).toLocaleString();
            const savingsEl = document.getElementById('summary-savings');
            if (savingsEl) savingsEl.textContent = '-₹' + ((pkg.originalPrice - pkg.price) * persons).toLocaleString();
        };
        personsInput?.addEventListener('input', updateSummary);

        // Submit booking
        document.getElementById('book-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('book-btn');
            btn.textContent = 'Processing...';
            btn.disabled = true;
            const persons = parseInt(personsInput.value) || 1;
            const result = await Store.createBooking({
                packageId: pkg.id, packageTitle: pkg.title,
                travelDate: document.getElementById('book-date').value,
                persons, totalAmount: pkg.price * persons,
            });
            if (result) {
                Toast.success('Booking confirmed! 🎉');
                Router.navigate('/my-bookings');
            } else {
                Toast.error('Booking failed. Please try again.');
                btn.textContent = 'Confirm Booking';
                btn.disabled = false;
            }
        });
    }
};
