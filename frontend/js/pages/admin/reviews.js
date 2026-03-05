/**
 * Admin Reviews Page
 */
const AdminReviewsPage = {
    async render(container) {
        const reviews = await Store.loadAllReviews();
        container.innerHTML = `
        <div class="admin-page">
            <div class="admin-page-header"><div><h1>Manage Reviews</h1><p>${reviews.length} reviews</p></div></div>
            <div id="reviews-list">
                ${reviews.length === 0 ? '<div class="empty-state"><p>No reviews yet.</p></div>' :
                reviews.map(r => `
                    <div class="admin-review-card">
                        <div class="review-top">
                            <div class="review-user">
                                <img src="${r.userAvatar}" alt="${r.userName}">
                                <div><strong>${r.userName}</strong><div style="font-size:var(--font-size-xs);color:var(--text-secondary)">${r.packageTitle} · ${r.createdAt}</div></div>
                            </div>
                            <button class="btn btn-ghost btn-sm del-review" data-id="${r.id}" style="color:var(--danger)">${Icons.trash(14)}</button>
                        </div>
                        <div style="margin-bottom:8px">${[...Array(5)].map((_, i) => Icons.star(16, i < r.rating ? 'var(--accent)' : 'none')).join('')}</div>
                        <p style="color:var(--text-secondary);font-size:var(--font-size-sm)">${r.comment}</p>
                    </div>`).join('')}
            </div>
        </div>`;

        document.querySelectorAll('.del-review').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm('Delete review?')) { await Store.deleteReview(btn.dataset.id); Toast.success('Deleted'); Router.resolve(); }
            });
        });
    }
};
