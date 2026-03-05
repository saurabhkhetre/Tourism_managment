"""
TravelVista — Bookings Routes
"""
import time
from datetime import date
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_db, booking_to_dict

bookings_bp = Blueprint('bookings', __name__, url_prefix='/api/bookings')


def _is_admin(uid):
    conn = get_db()
    row = conn.execute("SELECT role FROM users WHERE id = ?", (uid,)).fetchone()
    conn.close()
    return row and row['role'] == 'admin'


@bookings_bp.route('', methods=['GET'])
@jwt_required()
def list_bookings():
    """Admin: list all bookings."""
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    rows = conn.execute("SELECT * FROM bookings ORDER BY created_at DESC").fetchall()
    conn.close()
    return jsonify([booking_to_dict(r) for r in rows])


@bookings_bp.route('/my', methods=['GET'])
@jwt_required()
def my_bookings():
    """User: list own bookings."""
    uid = get_jwt_identity()
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC", (uid,)
    ).fetchall()
    conn.close()
    return jsonify([booking_to_dict(r) for r in rows])


@bookings_bp.route('', methods=['POST'])
@jwt_required()
def create_booking():
    uid = get_jwt_identity()
    data = request.get_json() or {}

    booking_id = 'bk-' + str(int(time.time() * 1000))
    conn = get_db()
    conn.execute(
        """INSERT INTO bookings
           (id,user_id,package_id,package_title,travel_date,persons,total_amount,
            status,payment_status,payment_method,created_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
        (
            booking_id,
            uid,
            data.get('packageId', ''),
            data.get('packageTitle', ''),
            data.get('travelDate', ''),
            data.get('persons', 1),
            data.get('totalAmount', 0),
            'pending',
            'pending',
            '',
            date.today().isoformat(),
        )
    )
    conn.commit()
    row = conn.execute("SELECT * FROM bookings WHERE id = ?", (booking_id,)).fetchone()
    conn.close()
    return jsonify(booking_to_dict(row)), 201


@bookings_bp.route('/<bid>/status', methods=['PUT'])
@jwt_required()
def update_status(bid):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    data = request.get_json() or {}
    status = data.get('status', '')
    if not status:
        return jsonify({'message': 'Status required'}), 400

    conn = get_db()
    conn.execute("UPDATE bookings SET status = ? WHERE id = ?", (status, bid))
    conn.commit()
    row = conn.execute("SELECT * FROM bookings WHERE id = ?", (bid,)).fetchone()
    conn.close()
    if not row:
        return jsonify({'message': 'Booking not found'}), 404
    return jsonify(booking_to_dict(row))


@bookings_bp.route('/<bid>/pay', methods=['PUT'])
@jwt_required()
def confirm_payment(bid):
    data = request.get_json() or {}
    method = data.get('paymentMethod', 'card')

    conn = get_db()
    conn.execute(
        "UPDATE bookings SET status='confirmed', payment_status='paid', payment_method=? WHERE id=?",
        (method, bid)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM bookings WHERE id = ?", (bid,)).fetchone()
    conn.close()
    if not row:
        return jsonify({'message': 'Booking not found'}), 404
    return jsonify(booking_to_dict(row))


@bookings_bp.route('/<bid>/cancel', methods=['PUT'])
@jwt_required()
def cancel_booking(bid):
    conn = get_db()
    row = conn.execute("SELECT * FROM bookings WHERE id = ?", (bid,)).fetchone()
    if not row:
        conn.close()
        return jsonify({'message': 'Booking not found'}), 404

    new_payment = 'refunded' if row['payment_status'] == 'paid' else 'cancelled'
    conn.execute(
        "UPDATE bookings SET status='cancelled', payment_status=? WHERE id=?",
        (new_payment, bid)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM bookings WHERE id = ?", (bid,)).fetchone()
    conn.close()
    return jsonify(booking_to_dict(row))


@bookings_bp.route('/revenue', methods=['GET'])
@jwt_required()
def revenue():
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM bookings WHERE payment_status = 'paid'"
    ).fetchall()
    conn.close()

    total = sum(r['total_amount'] for r in rows)
    months = {}
    for r in rows:
        m = r['created_at'][:7]
        months[m] = months.get(m, 0) + r['total_amount']

    monthly = [{'month': k, 'revenue': v} for k, v in sorted(months.items())]
    return jsonify({'totalRevenue': total, 'monthlyRevenue': monthly})
