/**
 * TravelVista — Home Page
 */
const HomePage = {
    currentSlide: 0,
    sliderTimer: null,

    async render(container) {
        const featured = Store.getFeaturedPackages();
        const reviews = Store.get('reviews').slice(0, 3);

        const banners = [
            { image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=80', title: 'Explore the World', subtitle: 'One Journey at a Time' },
            { image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80', title: 'Discover Paradise', subtitle: 'Your Adventure Awaits' },
            { image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1400&q=80', title: 'Create Memories', subtitle: 'That Last Forever' },
        ];

        container.innerHTML = `
        <div class="home-page">
            <!-- Hero -->
            <section class="hero">
                ${banners.map((b, i) => `<div class="hero-slide ${i === 0 ? 'active' : ''}" style="background-image:url(${b.image})" data-slide="${i}"></div>`).join('')}
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <div class="hero-badge animate-slide-up">✨ Premium Travel Experiences</div>
                    <h1 class="hero-title animate-slide-up" id="hero-title">${banners[0].title}</h1>
                    <p class="hero-subtitle animate-slide-up" id="hero-subtitle">${banners[0].subtitle}</p>
                    <div class="hero-actions animate-slide-up">
                        <a href="#/packages" class="btn btn-primary btn-lg">Explore Packages ${Icons.arrowRight(18)}</a>
                        <a href="#/contact" class="btn btn-secondary btn-lg">Contact Us</a>
                    </div>
                    <div class="hero-dots">
                        ${banners.map((_, i) => `<button class="hero-dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></button>`).join('')}
                    </div>
                </div>
            </section>

            <!-- Stats -->
            <section class="stats-section">
                <div class="container">
                    <div class="stats-grid">
                        <div class="stat-item">${Icons.trendingUp(28)}<div class="stat-number" data-count="500">0+</div><div class="stat-text">Tours Completed</div></div>
                        <div class="stat-item">${Icons.users(28)}<div class="stat-number" data-count="10000">0+</div><div class="stat-text">Happy Travelers</div></div>
                        <div class="stat-item">${Icons.mapPin(28)}<div class="stat-number" data-count="50">0+</div><div class="stat-text">Destinations</div></div>
                        <div class="stat-item">${Icons.award(28)}<div class="stat-number" data-count="15">0+</div><div class="stat-text">Years Experience</div></div>
                    </div>
                </div>
            </section>

            <!-- Featured Packages -->
            <section class="section">
                <div class="container">
                    <h2 class="section-title">Featured Tour Packages</h2>
                    <p class="section-subtitle">Handpicked destinations for unforgettable experiences</p>
                    <div class="packages-grid">
                        ${featured.map(pkg => `
                            <a href="#/packages/${pkg.id}" class="package-card glass-card">
                                <div class="package-image-wrap">
                                    <img src="${pkg.image}" alt="${pkg.title}" class="package-image">
                                    <div class="package-badge">${pkg.category}</div>
                                    ${pkg.originalPrice > pkg.price ? `<div class="package-discount">${Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% OFF</div>` : ''}
                                </div>
                                <div class="package-info">
                                    <div class="package-location">${Icons.mapPin(14)} ${pkg.location}</div>
                                    <h3 class="package-title">${pkg.title}</h3>
                                    <div class="package-meta">
                                        <span class="package-duration">${Icons.clock(14)} ${pkg.duration}</span>
                                        <span class="package-rating">${Icons.star(14, 'var(--accent-amber)')} ${pkg.rating}</span>
                                    </div>
                                    <div class="package-footer">
                                        <div class="package-price">
                                            <span class="price-current">₹${pkg.price.toLocaleString()}</span>
                                            ${pkg.originalPrice > pkg.price ? `<span class="price-original">₹${pkg.originalPrice.toLocaleString()}</span>` : ''}
                                            <span class="price-per">/ person</span>
                                        </div>
                                        <span class="package-cta">View ${Icons.chevronRight(16)}</span>
                                    </div>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                    <div class="section-cta"><a href="#/packages" class="btn btn-primary btn-lg">View All Packages ${Icons.arrowRight(18)}</a></div>
                </div>
            </section>

            <!-- Why Choose Us -->
            <section class="section why-section">
                <div class="container">
                    <h2 class="section-title">Why Choose TravelVista?</h2>
                    <p class="section-subtitle">We make your travel dreams come true with our premium services</p>
                    <div class="why-grid">
                        <div class="why-card glass-card"><div class="why-icon" style="background:rgba(6,182,212,0.15)">${Icons.shield(28)}</div><h3>100% Safe Travels</h3><p>Your safety is our top priority. All tours include insurance and 24/7 emergency support.</p></div>
                        <div class="why-card glass-card"><div class="why-icon" style="background:rgba(139,92,246,0.15)">${Icons.creditCard(28)}</div><h3>Best Price Guarantee</h3><p>We offer the most competitive prices with no hidden charges.</p></div>
                        <div class="why-card glass-card"><div class="why-icon" style="background:rgba(245,158,11,0.15)">${Icons.headphones(28)}</div><h3>24/7 Support</h3><p>Our dedicated team is available round the clock to assist you.</p></div>
                        <div class="why-card glass-card"><div class="why-icon" style="background:rgba(16,185,129,0.15)">${Icons.heart(28)}</div><h3>Curated Experiences</h3><p>Every tour is carefully crafted by travel experts.</p></div>
                    </div>
                </div>
            </section>

            <!-- Testimonials -->
            ${reviews.length > 0 ? `
            <section class="section">
                <div class="container">
                    <h2 class="section-title">What Our Travelers Say</h2>
                    <p class="section-subtitle">Real stories from real adventurers</p>
                    <div class="testimonials-grid">
                        ${reviews.map(r => `
                            <div class="testimonial-card glass-card">
                                <div class="testimonial-stars">${[...Array(5)].map((_, i) => Icons.star(16, i < r.rating ? 'var(--accent-amber)' : 'none')).join('')}</div>
                                <p class="testimonial-text">"${r.comment}"</p>
                                <div class="testimonial-author">
                                    <img src="${r.userAvatar}" alt="${r.userName}" class="testimonial-avatar">
                                    <div><div class="testimonial-name">${r.userName}</div><div class="testimonial-pkg">${r.packageTitle}</div></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>` : ''}

            <!-- CTA -->
            <section class="cta-section">
                <div class="container">
                    <div class="cta-card">
                        <h2>Ready for Your Next Adventure?</h2>
                        <p>Join thousands of happy travelers who have explored India with us. Book your dream tour today!</p>
                        <div class="cta-actions">
                            <a href="#/packages" class="btn btn-primary btn-lg">Browse Packages</a>
                            <a href="#/contact" class="btn btn-secondary btn-lg">Get in Touch</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>`;

        // Start slider
        this.startSlider(banners);
        this.animateCounters();
    },

    startSlider(banners) {
        if (this.sliderTimer) clearInterval(this.sliderTimer);
        this.currentSlide = 0;
        const dots = document.querySelectorAll('.hero-dot');
        const slides = document.querySelectorAll('.hero-slide');

        const goTo = (i) => {
            this.currentSlide = i;
            slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
            dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
            const title = document.getElementById('hero-title');
            const sub = document.getElementById('hero-subtitle');
            if (title) title.textContent = banners[i].title;
            if (sub) sub.textContent = banners[i].subtitle;
        };

        dots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.dot))));
        this.sliderTimer = setInterval(() => goTo((this.currentSlide + 1) % banners.length), 5000);
    },

    animateCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const end = parseInt(el.dataset.count);
                    let start = 0;
                    const step = end / 120;
                    const timer = setInterval(() => {
                        start += step;
                        if (start >= end) { el.textContent = end.toLocaleString() + '+'; clearInterval(timer); }
                        else el.textContent = Math.floor(start).toLocaleString() + '+';
                    }, 16);
                    observer.unobserve(el);
                }
            });
        });
        document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
    }
};
