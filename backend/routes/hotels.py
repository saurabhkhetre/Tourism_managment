"""
TravelVista — Hotels Routes
"""
import time
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_db, hotel_to_dict

hotels_bp = Blueprint('hotels', __name__, url_prefix='/api/hotels')


def _is_admin(uid):
    conn = get_db()
    row = conn.execute("SELECT role FROM users WHERE id = ?", (uid,)).fetchone()
    conn.close()
    return row and row['role'] == 'admin'


@hotels_bp.route('', methods=['GET'])
@jwt_required()
def list_hotels():
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    rows = conn.execute("SELECT * FROM hotels").fetchall()
    conn.close()
    return jsonify([hotel_to_dict(r) for r in rows])


@hotels_bp.route('', methods=['POST'])
@jwt_required()
def add_hotel():
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    data = request.get_json() or {}
    htl_id = 'htl-' + str(int(time.time() * 1000))

    conn = get_db()
    conn.execute(
        "INSERT INTO hotels (id,name,location,rating,price_per_night,capacity,type,image) VALUES (?,?,?,?,?,?,?,?)",
        (htl_id, data.get('name', ''), data.get('location', ''),
         data.get('rating', 0), data.get('pricePerNight', 0),
         data.get('capacity', 0), data.get('type', 'Hotel'), data.get('image', ''))
    )
    conn.commit()
    row = conn.execute("SELECT * FROM hotels WHERE id = ?", (htl_id,)).fetchone()
    conn.close()
    return jsonify(hotel_to_dict(row)), 201


@hotels_bp.route('/<htl_id>', methods=['PUT'])
@jwt_required()
def update_hotel(htl_id):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    data = request.get_json() or {}
    conn = get_db()
    conn.execute(
        """UPDATE hotels SET name=?, location=?, rating=?, price_per_night=?,
           capacity=?, type=?, image=? WHERE id=?""",
        (data.get('name', ''), data.get('location', ''),
         data.get('rating', 0), data.get('pricePerNight', 0),
         data.get('capacity', 0), data.get('type', 'Hotel'),
         data.get('image', ''), htl_id)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM hotels WHERE id = ?", (htl_id,)).fetchone()
    conn.close()
    if not row:
        return jsonify({'message': 'Hotel not found'}), 404
    return jsonify(hotel_to_dict(row))


@hotels_bp.route('/<htl_id>', methods=['DELETE'])
@jwt_required()
def delete_hotel(htl_id):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    conn.execute("DELETE FROM hotels WHERE id = ?", (htl_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})
