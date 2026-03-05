/**
 * TravelVista — Packages Page
 */
const PackagesPage = {
    async render(container) {
        const allPkgs = Store.getActivePackages();
        const categories = [...new Set(allPkgs.map(p => p.category).filter(Boolean))];

        container.innerHTML = `
        <div class="page-header"><div class="container"><h1>Tour Packages</h1><p>Discover our carefully curated travel experiences</p></div></div>
        <div class="packages-page"><div class="container">
            <div class="packages-toolbar">
                <div class="packages-search">${Icons.search(18)}<input type="text" id="pkg-search" placeholder="Search destinations, packages..."></div>
                <div class="packages-filters">
                    <select id="pkg-category"><option value="">All Categories</option>${categories.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
                    <select id="pkg-sort"><option value="">Sort By</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Rating</option><option value="popular">Popularity</option></select>
                </div>
            </div>
            <p class="packages-count" id="pkg-count">${allPkgs.length} packages found</p>
            <div class="packages-grid" id="pkg-grid"></div>
        </div></div>`;

        this.renderGrid(allPkgs);
        this.bindEvents();
    },

    renderGrid(pkgs) {
        const grid = document.getElementById('pkg-grid');
        const count = document.getElementById('pkg-count');
        if (count) count.textContent = `${pkgs.length} packages found`;
        if (!grid) return;
        grid.innerHTML = pkgs.length === 0 ? '<div class="empty-state"><h3>No packages found</h3><p>Try adjusting your filters.</p></div>' :
            pkgs.map(pkg => `
                <a href="#/packages/${pkg.id}" class="package-card">
                    <div class="package-card-image">
                        <img src="${pkg.image}" alt="${pkg.title}">
                        <div class="package-card-badge">${pkg.category}</div>
                        ${pkg.originalPrice > pkg.price ? `<div class="package-card-discount">${Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% OFF</div>` : ''}
                    </div>
                    <div class="package-card-content">
                        <div class="package-card-location">${Icons.mapPin(14)} ${pkg.location}</div>
                        <h3 class="package-card-title">${pkg.title}</h3>
                        <div class="package-card-meta">
                            <span>${Icons.clock(14)} ${pkg.duration}</span>
                            <span class="package-card-rating">${Icons.star(14, 'var(--accent)')} ${pkg.rating}</span>
                            <span>${Icons.users(14)} Max ${pkg.maxPersons}</span>
                        </div>
                        <div class="package-card-footer">
                            <div class="package-card-price">
                                <span class="current">₹${pkg.price.toLocaleString()}</span>
                                ${pkg.originalPrice > pkg.price ? `<span class="original">₹${pkg.originalPrice.toLocaleString()}</span>` : ''}
                            </div>
                            <span class="btn btn-primary btn-sm">View Details</span>
                        </div>
                    </div>
                </a>`).join('');
    },

    bindEvents() {
        const search = document.getElementById('pkg-search');
        const category = document.getElementById('pkg-category');
        const sort = document.getElementById('pkg-sort');
        const doFilter = () => {
            const pkgs = Store.searchPackages(search?.value || '', { category: category?.value, sortBy: sort?.value });
            this.renderGrid(pkgs);
        };
        search?.addEventListener('input', doFilter);
        category?.addEventListener('change', doFilter);
        sort?.addEventListener('change', doFilter);
    }
};
