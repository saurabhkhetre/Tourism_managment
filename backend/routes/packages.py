"""
TravelVista — Packages Routes
"""
import json
import time
from datetime import date
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_db, package_to_dict

packages_bp = Blueprint('packages', __name__, url_prefix='/api/packages')


def _is_admin(uid):
    conn = get_db()
    row = conn.execute("SELECT role FROM users WHERE id = ?", (uid,)).fetchone()
    conn.close()
    return row and row['role'] == 'admin'


@packages_bp.route('', methods=['GET'])
def list_packages():
    """Public: list active packages with optional search/filter/sort."""
    q = request.args.get('q', '').strip().lower()
    category = request.args.get('category', '')
    min_price = request.args.get('minPrice', type=float)
    max_price = request.args.get('maxPrice', type=float)
    sort_by = request.args.get('sortBy', '')

    conn = get_db()
    rows = conn.execute("SELECT * FROM packages WHERE active = 1").fetchall()
    conn.close()

    result = [package_to_dict(r) for r in rows]

    if q:
        result = [p for p in result if
                  q in p['title'].lower() or
                  q in p['location'].lower() or
                  q in p['category'].lower()]

    if category:
        result = [p for p in result if p['category'] == category]
    if min_price is not None:
        result = [p for p in result if p['price'] >= min_price]
    if max_price is not None:
        result = [p for p in result if p['price'] <= max_price]

    if sort_by == 'price-low':
        result.sort(key=lambda p: p['price'])
    elif sort_by == 'price-high':
        result.sort(key=lambda p: p['price'], reverse=True)
    elif sort_by == 'rating':
        result.sort(key=lambda p: p['rating'], reverse=True)
    elif sort_by == 'popular':
        result.sort(key=lambda p: p['reviewCount'], reverse=True)

    return jsonify(result)


@packages_bp.route('/all', methods=['GET'])
@jwt_required()
def list_all():
    """Admin: list ALL packages including inactive."""
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    rows = conn.execute("SELECT * FROM packages ORDER BY created_at DESC").fetchall()
    conn.close()
    return jsonify([package_to_dict(r) for r in rows])


@packages_bp.route('/<pkg_id>', methods=['GET'])
def get_package(pkg_id):
    conn = get_db()
    row = conn.execute("SELECT * FROM packages WHERE id = ?", (pkg_id,)).fetchone()
    conn.close()
    if not row:
        return jsonify({'message': 'Package not found'}), 404
    return jsonify(package_to_dict(row))


@packages_bp.route('', methods=['POST'])
@jwt_required()
def create_package():
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    data = request.get_json() or {}
    pkg_id = 'pkg-' + str(int(time.time() * 1000))

    conn = get_db()
    conn.execute(
        """INSERT INTO packages
           (id,title,location,duration,price,original_price,max_persons,rating,review_count,
            image,gallery,category,description,highlights,itinerary,inclusions,exclusions,
            active,featured,created_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        (
            pkg_id,
            data.get('title', ''),
            data.get('location', ''),
            data.get('duration', ''),
            data.get('price', 0),
            data.get('originalPrice', 0),
            data.get('maxPersons', 20),
            0, 0,
            data.get('image', ''),
            json.dumps(data.get('gallery', [])),
            data.get('category', ''),
            data.get('description', ''),
            json.dumps(data.get('highlights', [])),
            json.dumps(data.get('itinerary', [])),
            json.dumps(data.get('inclusions', [])),
            json.dumps(data.get('exclusions', [])),
            1 if data.get('active', True) else 0,
            1 if data.get('featured', False) else 0,
            date.today().isoformat(),
        )
    )
    conn.commit()
    row = conn.execute("SELECT * FROM packages WHERE id = ?", (pkg_id,)).fetchone()
    conn.close()
    return jsonify(package_to_dict(row)), 201


@packages_bp.route('/<pkg_id>', methods=['PUT'])
@jwt_required()
def update_package(pkg_id):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    data = request.get_json() or {}
    conn = get_db()

    existing = conn.execute("SELECT * FROM packages WHERE id = ?", (pkg_id,)).fetchone()
    if not existing:
        conn.close()
        return jsonify({'message': 'Package not found'}), 404

    conn.execute(
        """UPDATE packages SET
           title=?, location=?, duration=?, price=?, original_price=?, max_persons=?,
           image=?, gallery=?, category=?, description=?, highlights=?,
           itinerary=?, inclusions=?, exclusions=?, active=?, featured=?
           WHERE id=?""",
        (
            data.get('title', existing['title']),
            data.get('location', existing['location']),
            data.get('duration', existing['duration']),
            data.get('price', existing['price']),
            data.get('originalPrice', existing['original_price']),
            data.get('maxPersons', existing['max_persons']),
            data.get('image', existing['image']),
            json.dumps(data.get('gallery', json.loads(existing['gallery'] or '[]'))),
            data.get('category', existing['category']),
            data.get('description', existing['description']),
            json.dumps(data.get('highlights', json.loads(existing['highlights'] or '[]'))),
            json.dumps(data.get('itinerary', json.loads(existing['itinerary'] or '[]'))),
            json.dumps(data.get('inclusions', json.loads(existing['inclusions'] or '[]'))),
            json.dumps(data.get('exclusions', json.loads(existing['exclusions'] or '[]'))),
            1 if data.get('active', bool(existing['active'])) else 0,
            1 if data.get('featured', bool(existing['featured'])) else 0,
            pkg_id,
        )
    )
    conn.commit()
    row = conn.execute("SELECT * FROM packages WHERE id = ?", (pkg_id,)).fetchone()
    conn.close()
    return jsonify(package_to_dict(row))


@packages_bp.route('/<pkg_id>', methods=['DELETE'])
@jwt_required()
def delete_package(pkg_id):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    conn.execute("DELETE FROM packages WHERE id = ?", (pkg_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})


@packages_bp.route('/<pkg_id>/toggle', methods=['PATCH'])
@jwt_required()
def toggle_active(pkg_id):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    row = conn.execute("SELECT * FROM packages WHERE id = ?", (pkg_id,)).fetchone()
    if not row:
        conn.close()
        return jsonify({'message': 'Package not found'}), 404

    new_active = 0 if row['active'] else 1
    conn.execute("UPDATE packages SET active = ? WHERE id = ?", (new_active, pkg_id))
    conn.commit()
    row = conn.execute("SELECT * FROM packages WHERE id = ?", (pkg_id,)).fetchone()
    conn.close()
    return jsonify(package_to_dict(row))
