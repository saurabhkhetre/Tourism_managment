import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePackages } from '../../contexts/PackageContext';
import { useReviews } from '../../contexts/ReviewContext';
import { useAuth } from '../../contexts/AuthContext';
import {
    MapPin, Clock, Users, Star, CheckCircle, XCircle,
    Sparkles, Route, Shield, Headphones, CreditCard, ArrowLeft
} from 'lucide-react';
import './PackageDetail.css';

export default function PackageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getPackage } = usePackages();
    const { getPackageReviews, addReview } = useReviews();
    const { user, isAuthenticated } = useAuth();

    const pkg = getPackage(id);
    const [reviews, setReviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');

    useEffect(() => {
        if (id) {
            getPackageReviews(id).then(data => setReviews(data || []));
        }
    }, [id, getPackageReviews]);

    if (!pkg) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <h2>Package not found</h2>
                <p style={{ color: 'var(--text-secondary)', margin: '16px 0' }}>
                    The package you're looking for doesn't exist or has been removed.
                </p>
                <Link to="/packages" className="btn btn-primary">Browse Packages</Link>
            </div>
        );
    }

    const images = pkg.gallery?.length > 0 ? pkg.gallery : [pkg.image];
    const discount = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewRating || !reviewComment.trim()) return;
        await addReview({
            packageId: pkg.id,
            packageTitle: pkg.title,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            rating: reviewRating,
            comment: reviewComment.trim(),
        });
        setReviewRating(0);
        setReviewComment('');
        // Reload reviews
        const updated = await getPackageReviews(id);
        setReviews(updated || []);
    };

    return (
        <div className="package-detail">
            <div className="container">
                <button onClick={() => navigate(-1)} className="btn btn-ghost mb-6" style={{ gap: '6px' }}>
                    <ArrowLeft size={18} /> Back
                </button>

                <div className="package-detail-grid">
                    <div className="package-detail-left">
                        {/* Gallery */}
                        <div className="package-gallery">
                            <img src={images[selectedImage]} alt={pkg.title} className="gallery-main" />
                            {images.length > 1 && (
                                <div className="gallery-thumbs">
                                    {images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`${pkg.title} ${i + 1}`}
                                            className={`gallery-thumb ${i === selectedImage ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(i)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Header Info */}
                        <div className="package-info-header">
                            <span className="category-badge">{pkg.category}</span>
                            <h1>{pkg.title}</h1>
                            <div className="package-meta-row">
                                <div className="package-meta-item"><MapPin size={16} /> {pkg.location}</div>
                                <div className="package-meta-item"><Clock size={16} /> {pkg.duration}</div>
                                <div className="package-meta-item"><Users size={16} /> Max {pkg.maxPersons} persons</div>
                                <div className="package-meta-item">
                                    <Star size={16} fill="var(--accent)" color="var(--accent)" />
                                    {pkg.rating} ({pkg.reviewCount} reviews)
                                </div>
                            </div>
                        </div>

                        <p className="package-description">{pkg.description}</p>

                        {/* Highlights */}
                        <div className="detail-section">
                            <h2><Sparkles size={20} /> Highlights</h2>
                            <div className="highlights-grid">
                                {pkg.highlights?.map((h, i) => (
                                    <div key={i} className="highlight-item">
                                        <CheckCircle size={16} /> {h}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Itinerary */}
                        <div className="detail-section">
                            <h2><Route size={20} /> Itinerary</h2>
                            <div className="itinerary-list">
                                {pkg.itinerary?.map((day, i) => (
                                    <div key={i} className="itinerary-item">
                                        <div className="itinerary-day">Day {day.day}</div>
                                        <div className="itinerary-title">{day.title}</div>
                                        <div className="itinerary-desc">{day.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inclusions & Exclusions */}
                        <div className="detail-section">
                            <h2>What's Included</h2>
                            <div className="inc-exc-grid">
                                <div>
                                    <ul className="inc-list">
                                        {pkg.inclusions?.map((item, i) => (
                                            <li key={i}><CheckCircle size={16} /> {item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <ul className="exc-list">
                                        {pkg.exclusions?.map((item, i) => (
                                            <li key={i}><XCircle size={16} /> {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="detail-section reviews-section">
                            <h2><Star size={20} /> Reviews ({reviews.length})</h2>
                            {reviews.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to review!</p>
                            ) : (
                                reviews.map(rev => (
                                    <div key={rev.id} className="review-card">
                                        <div className="review-header">
                                            <img src={rev.userAvatar} alt={rev.userName} className="review-avatar" />
                                            <div>
                                                <div className="review-author">{rev.userName}</div>
                                                <div className="review-date">{rev.createdAt}</div>
                                            </div>
                                        </div>
                                        <div className="review-stars">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} size={16} fill={s <= rev.rating ? 'var(--accent)' : 'none'} color={s <= rev.rating ? 'var(--accent)' : 'var(--gray-300)'} />
                                            ))}
                                        </div>
                                        <p className="review-comment">{rev.comment}</p>
                                    </div>
                                ))
                            )}

                            {isAuthenticated && (
                                <form className="write-review-form" onSubmit={handleSubmitReview}>
                                    <h3>Write a Review</h3>
                                    <div className="star-select">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <button key={s} type="button" className={s <= reviewRating ? 'filled' : ''} onClick={() => setReviewRating(s)}>
                                                <Star size={24} fill={s <= reviewRating ? 'var(--accent)' : 'none'} color={s <= reviewRating ? 'var(--accent)' : 'var(--gray-300)'} />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Share your experience..."
                                        value={reviewComment}
                                        onChange={e => setReviewComment(e.target.value)}
                                        rows={3}
                                    />
                                    <button type="submit" className="btn btn-primary mt-4" disabled={!reviewRating || !reviewComment.trim()}>Submit Review</button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="booking-sidebar">
                        <div className="booking-card">
                            <div className="price-block">
                                <span className="current-price">₹{pkg.price.toLocaleString()}</span>
                                <span className="original-price">₹{pkg.originalPrice.toLocaleString()}</span>
                                <span className="per-person">per person • {discount}% off</span>
                            </div>

                            {isAuthenticated ? (
                                <Link to={`/book/${pkg.id}`} className="btn btn-primary booking-cta">Book Now</Link>
                            ) : (
                                <Link to="/login" className="btn btn-primary booking-cta">Login to Book</Link>
                            )}

                            <ul className="booking-features">
                                <li><Shield size={16} /> Secure Booking</li>
                                <li><CreditCard size={16} /> Multiple Payment Options</li>
                                <li><Headphones size={16} /> 24/7 Support</li>
                                <li><CheckCircle size={16} /> Free Cancellation</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
