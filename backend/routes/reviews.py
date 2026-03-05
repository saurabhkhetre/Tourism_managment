"""
TravelVista — Reviews Routes
"""
import time
from datetime import date
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_db, review_to_dict

reviews_bp = Blueprint('reviews', __name__, url_prefix='/api/reviews')


def _is_admin(uid):
    conn = get_db()
    row = conn.execute("SELECT role FROM users WHERE id = ?", (uid,)).fetchone()
    conn.close()
    return row and row['role'] == 'admin'


@reviews_bp.route('/recent', methods=['GET'])
def recent_reviews():
    """Public: latest reviews for testimonials."""
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM reviews ORDER BY created_at DESC LIMIT 10"
    ).fetchall()
    conn.close()
    return jsonify([review_to_dict(r) for r in rows])


@reviews_bp.route('', methods=['GET'])
@jwt_required()
def list_reviews():
    """Admin: all reviews."""
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    rows = conn.execute("SELECT * FROM reviews ORDER BY created_at DESC").fetchall()
    conn.close()
    return jsonify([review_to_dict(r) for r in rows])


@reviews_bp.route('/package/<pkg_id>', methods=['GET'])
def package_reviews(pkg_id):
    """Public: reviews for a specific package."""
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM reviews WHERE package_id = ? ORDER BY created_at DESC",
        (pkg_id,)
    ).fetchall()
    conn.close()

    reviews = [review_to_dict(r) for r in rows]
    avg = 0
    if reviews:
        avg = round(sum(r['rating'] for r in reviews) / len(reviews), 1)

    return jsonify({'reviews': reviews, 'averageRating': avg})


@reviews_bp.route('', methods=['POST'])
@jwt_required()
def add_review():
    uid = get_jwt_identity()
    data = request.get_json() or {}

    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (uid,)).fetchone()
    if not user:
        conn.close()
        return jsonify({'message': 'User not found'}), 404

    rev_id = 'rev-' + str(int(time.time() * 1000))
    conn.execute(
        """INSERT INTO reviews
           (id,user_id,user_name,user_avatar,package_id,package_title,rating,comment,created_at)
           VALUES (?,?,?,?,?,?,?,?,?)""",
        (
            rev_id, uid, user['name'], user['avatar'],
            data.get('packageId', ''),
            data.get('packageTitle', ''),
            data.get('rating', 5),
            data.get('comment', ''),
            date.today().isoformat(),
        )
    )

    # Update package review count and average rating
    pkg_id = data.get('packageId', '')
    if pkg_id:
        all_reviews = conn.execute(
            "SELECT rating FROM reviews WHERE package_id = ?", (pkg_id,)
        ).fetchall()
        count = len(all_reviews)
        avg = round(sum(r['rating'] for r in all_reviews) / count, 1) if count else 0
        conn.execute(
            "UPDATE packages SET review_count = ?, rating = ? WHERE id = ?",
            (count, avg, pkg_id)
        )

    conn.commit()
    row = conn.execute("SELECT * FROM reviews WHERE id = ?", (rev_id,)).fetchone()
    conn.close()
    return jsonify(review_to_dict(row)), 201


@reviews_bp.route('/<rev_id>', methods=['DELETE'])
@jwt_required()
def delete_review(rev_id):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    # Get the review's package_id before deleting to update counts
    review = conn.execute("SELECT * FROM reviews WHERE id = ?", (rev_id,)).fetchone()
    if review:
        conn.execute("DELETE FROM reviews WHERE id = ?", (rev_id,))
        pkg_id = review['package_id']
        all_reviews = conn.execute(
            "SELECT rating FROM reviews WHERE package_id = ?", (pkg_id,)
        ).fetchall()
        count = len(all_reviews)
        avg = round(sum(r['rating'] for r in all_reviews) / count, 1) if count else 0
        conn.execute(
            "UPDATE packages SET review_count = ?, rating = ? WHERE id = ?",
            (count, avg, pkg_id)
        )
        conn.commit()

    conn.close()
    return jsonify({'success': True})
