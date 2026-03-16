/**
 * TravelVista — Package Detail Page
 */
const PackageDetailPage = {
    async render(container, params) {
        const pkg = Store.getPackage(params.id);
        if (!pkg) { container.innerHTML = '<div class="empty-state"><h3>Package not found</h3><a href="#/packages" class="btn btn-primary">Browse Packages</a></div>'; return; }

        const reviews = await Store.getPackageReviews(params.id);
        const isAuth = Store.get('isAuthenticated');
        const gallery = pkg.gallery && pkg.gallery.length > 0 ? pkg.gallery : [pkg.image];

        container.innerHTML = `
        <div class="package-detail"><div class="container">
            <div class="package-detail-grid">
                <div>
                    <div class="package-gallery">
                        <img src="${gallery[0]}" alt="${pkg.title}" class="gallery-main" id="gallery-main">
                        ${gallery.length > 1 ? `<div class="gallery-thumbs">${gallery.map((img, i) => `<img src="${img}" class="gallery-thumb ${i === 0 ? 'active' : ''}" data-img="${img}">`).join('')}</div>` : ''}
                    </div>
                    <div class="package-info-header">
                        <span class="category-badge">${pkg.category}</span>
                        <h1>${pkg.title}</h1>
                        <div class="package-meta-row">
                            <span class="package-meta-item">${Icons.mapPin(16)} ${pkg.location}</span>
                            <span class="package-meta-item">${Icons.clock(16)} ${pkg.duration}</span>
                            <span class="package-meta-item">${Icons.star(16, 'var(--accent)')} ${pkg.rating} (${pkg.reviewCount} reviews)</span>
                            <span class="package-meta-item">${Icons.users(16)} Max ${pkg.maxPersons} persons</span>
                        </div>
                    </div>
                    <p class="package-description">${pkg.description}</p>

                    ${pkg.highlights?.length ? `<div class="detail-section"><h2>${Icons.star(20)} Highlights</h2><div class="highlights-grid">${pkg.highlights.map(h => `<div class="highlight-item">${Icons.check(16)} ${h}</div>`).join('')}</div></div>` : ''}

                    ${pkg.itinerary?.length ? `<div class="detail-section"><h2>${Icons.clock(20)} Itinerary</h2><div class="itinerary-list">${pkg.itinerary.map((item, i) => `<div class="itinerary-item"><div class="itinerary-day">Day ${i + 1}</div><div class="itinerary-title">${item.title || item}</div>${item.description ? `<div class="itinerary-desc">${item.description}</div>` : ''}</div>`).join('')}</div></div>` : ''}

                    ${(pkg.inclusions?.length || pkg.exclusions?.length) ? `<div class="detail-section"><h2>Inclusions & Exclusions</h2><div class="inc-exc-grid">
                        ${pkg.inclusions?.length ? `<div><h4 style="margin-bottom:8px;color:var(--success)">Included</h4><ul class="inc-list">${pkg.inclusions.map(i => `<li>${Icons.checkCircle(16)} ${i}</li>`).join('')}</ul></div>` : ''}
                        ${pkg.exclusions?.length ? `<div><h4 style="margin-bottom:8px;color:var(--danger)">Excluded</h4><ul class="exc-list">${pkg.exclusions.map(e => `<li>${Icons.xCircle(16)} ${e}</li>`).join('')}</ul></div>` : ''}
                    </div></div>` : ''}

                    <!-- Reviews -->
                    <div class="reviews-section detail-section">
                        <h2>${Icons.messageSquare(20)} Reviews (${reviews.length})</h2>
                        ${reviews.map(r => `
                            <div class="review-card">
                                <div class="review-header">
                                    <img src="${r.userAvatar}" alt="${r.userName}" class="review-avatar">
                                    <div><div class="review-author">${r.userName}</div><div class="review-date">${r.createdAt}</div></div>
                                </div>
                                <div class="review-stars">${[...Array(5)].map((_, i) => Icons.star(16, i < r.rating ? 'var(--accent)' : 'none')).join('')}</div>
                                <p class="review-comment">${r.comment}</p>
                            </div>`).join('')}

                        ${isAuth ? `
                        <div class="write-review-form">
                            <h3>Write a Review</h3>
                            <div class="star-select" id="star-select">${[1, 2, 3, 4, 5].map(i => `<button data-rating="${i}" class="${i <= 5 ? 'filled' : ''}">${Icons.star(24, i <= 5 ? 'var(--accent)' : 'none')}</button>`).join('')}</div>
                            <textarea class="form-textarea" id="review-comment" placeholder="Share your experience..."></textarea>
                            <button class="btn btn-primary mt-4" id="submit-review">Submit Review</button>
                        </div>` : `<p class="text-secondary mt-4"><a href="#/login">Login</a> to write a review.</p>`}
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="booking-sidebar">
                    <div class="booking-card">
                        <div class="price-block">
                            <span class="current-price">₹${pkg.price.toLocaleString()}</span>
                            ${pkg.originalPrice > pkg.price ? `<span class="original-price">₹${pkg.originalPrice.toLocaleString()}</span>` : ''}
                            <span class="per-person">per person</span>
                        </div>
                        <a href="#/book/${pkg.id}" class="btn btn-primary booking-cta">Book Now ${Icons.arrowRight(18)}</a>
                        <ul class="booking-features">
                            <li>${Icons.checkCircle(16)} Instant Confirmation</li>
                            <li>${Icons.checkCircle(16)} Free Cancellation</li>
                            <li>${Icons.checkCircle(16)} Best Price Guarantee</li>
                            <li>${Icons.checkCircle(16)} 24/7 Customer Support</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div></div>`;

        // Gallery thumbs
        document.querySelectorAll('.gallery-thumb').forEach(t => {
            t.addEventListener('click', () => {
                document.getElementById('gallery-main').src = t.dataset.img;
                document.querySelectorAll('.gallery-thumb').forEach(th => th.classList.remove('active'));
                t.classList.add('active');
            });
        });

        // Review form
        let selectedRating = 5;
        document.querySelectorAll('#star-select button').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedRating = parseInt(btn.dataset.rating);
                document.querySelectorAll('#star-select button').forEach((b, i) => {
                    b.className = i < selectedRating ? 'filled' : '';
                    b.innerHTML = Icons.star(24, i < selectedRating ? 'var(--accent)' : 'none');
                });
            });
        });

        document.getElementById('submit-review')?.addEventListener('click', async () => {
            const comment = document.getElementById('review-comment')?.value;
            if (!comment) { Toast.warning('Please write a comment'); return; }
            await Store.addReview({ packageId: pkg.id, packageTitle: pkg.title, rating: selectedRating, comment });
            Toast.success('Review submitted!');
            Router.resolve();
        });
    }
};
