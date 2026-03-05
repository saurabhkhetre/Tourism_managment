import { useEffect } from 'react';
import { useReviews } from '../../contexts/ReviewContext';
import { Trash2, Star } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminReviews() {
    const { reviews, deleteReview, loadAllReviews } = useReviews();

    useEffect(() => { loadAllReviews(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this review?')) await deleteReview(id);
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div><h1>Manage Reviews</h1><p>{reviews.length} total reviews</p></div>
            </div>

            {reviews.length === 0 ? (
                <div className="empty-state">
                    <Star size={48} />
                    <h3>No reviews yet</h3>
                    <p>Reviews submitted by users will appear here.</p>
                </div>
            ) : (
                reviews.map(rev => (
                    <div key={rev.id} className="admin-review-card">
                        <div className="review-top">
                            <div className="review-user">
                                <img src={rev.userAvatar} alt={rev.userName} />
                                <div>
                                    <div style={{ fontWeight: 600 }}>{rev.userName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{rev.createdAt}</div>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(rev.id)}>
                                <Trash2 size={15} /> Delete
                            </button>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                Package: <strong style={{ color: 'var(--text-primary)' }}>{rev.packageTitle}</strong>
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={16} fill={s <= rev.rating ? 'var(--accent)' : 'none'} color={s <= rev.rating ? 'var(--accent)' : 'var(--gray-300)'} />
                            ))}
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{rev.comment}</p>
                    </div>
                ))
            )}
        </div>
    );
}
