import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePackages } from '../../contexts/PackageContext';
import { Search, MapPin, Clock, Star, Users, ArrowRight } from 'lucide-react';
import './Packages.css';

const CATEGORIES = ['All', 'Beach', 'Mountain', 'Adventure', 'Heritage', 'Nature', 'Cultural'];

export default function Packages() {
    const { getActivePackages } = usePackages();
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || 'All';

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState(initialCategory);
    const [sortBy, setSortBy] = useState('');
    const [priceRange, setPriceRange] = useState('');

    const packages = getActivePackages();

    const filtered = useMemo(() => {
        let result = [...packages];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.location.toLowerCase().includes(q)
            );
        }

        if (category !== 'All') {
            result = result.filter(p => p.category === category);
        }

        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            result = result.filter(p => p.price >= min && (max ? p.price <= max : true));
        }

        if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
        else if (sortBy === 'popular') result.sort((a, b) => b.reviewCount - a.reviewCount);

        return result;
    }, [packages, search, category, sortBy, priceRange]);

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <h1>Explore Tour Packages</h1>
                    <p>Discover handpicked destinations across India with our curated travel experiences</p>
                </div>
            </div>

            <section className="packages-page">
                <div className="container">
                    <div className="packages-toolbar">
                        <div className="packages-search">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search destinations, packages..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="packages-filters">
                            <select value={priceRange} onChange={e => setPriceRange(e.target.value)}>
                                <option value="">All Prices</option>
                                <option value="0-15000">Under ₹15,000</option>
                                <option value="15000-25000">₹15,000 - ₹25,000</option>
                                <option value="25000-50000">₹25,000 - ₹50,000</option>
                                <option value="50000-">Above ₹50,000</option>
                            </select>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="">Sort By</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>
                    </div>

                    <div className="category-tabs">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`category-tab ${category === cat ? 'active' : ''}`}
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <p className="packages-count">{filtered.length} package{filtered.length !== 1 ? 's' : ''} found</p>

                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            <Search size={48} />
                            <h3>No packages found</h3>
                            <p>Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    ) : (
                        <div className="packages-grid">
                            {filtered.map(pkg => {
                                const discount = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
                                return (
                                    <Link to={`/packages/${pkg.id}`} key={pkg.id} className="package-card">
                                        <div className="package-card-image">
                                            <img src={pkg.image} alt={pkg.title} loading="lazy" />
                                            <span className="package-card-badge">{pkg.category}</span>
                                            {discount > 0 && (
                                                <span className="package-card-discount">{discount}% OFF</span>
                                            )}
                                        </div>
                                        <div className="package-card-content">
                                            <div className="package-card-location">
                                                <MapPin size={14} />
                                                {pkg.location}
                                            </div>
                                            <h3 className="package-card-title">{pkg.title}</h3>
                                            <div className="package-card-meta">
                                                <span><Clock size={14} /> {pkg.duration}</span>
                                                <span><Users size={14} /> Max {pkg.maxPersons}</span>
                                                <span className="package-card-rating">
                                                    <Star size={14} fill="currentColor" /> {pkg.rating}
                                                    <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>({pkg.reviewCount})</span>
                                                </span>
                                            </div>
                                            <div className="package-card-footer">
                                                <div className="package-card-price">
                                                    <span className="current">₹{pkg.price.toLocaleString()}</span>
                                                    <span className="original">₹{pkg.originalPrice.toLocaleString()}</span>
                                                </div>
                                                <span className="btn btn-primary btn-sm">
                                                    View Details <ArrowRight size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
