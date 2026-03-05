"""
TravelVista — Transport Routes
"""
import time
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_db, transport_to_dict

transport_bp = Blueprint('transport', __name__, url_prefix='/api/transport')


def _is_admin(uid):
    conn = get_db()
    row = conn.execute("SELECT role FROM users WHERE id = ?", (uid,)).fetchone()
    conn.close()
    return row and row['role'] == 'admin'


@transport_bp.route('', methods=['GET'])
@jwt_required()
def list_transport():
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    rows = conn.execute("SELECT * FROM transport").fetchall()
    conn.close()
    return jsonify([transport_to_dict(r) for r in rows])


@transport_bp.route('', methods=['POST'])
@jwt_required()
def add_transport():
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    data = request.get_json() or {}
    trn_id = 'trn-' + str(int(time.time() * 1000))

    conn = get_db()
    conn.execute(
        "INSERT INTO transport (id,name,type,capacity,price_per_day,image) VALUES (?,?,?,?,?,?)",
        (trn_id, data.get('name', ''), data.get('type', 'Car'),
         data.get('capacity', 0), data.get('pricePerDay', 0), data.get('image', ''))
    )
    conn.commit()
    row = conn.execute("SELECT * FROM transport WHERE id = ?", (trn_id,)).fetchone()
    conn.close()
    return jsonify(transport_to_dict(row)), 201


@transport_bp.route('/<trn_id>', methods=['PUT'])
@jwt_required()
def update_transport(trn_id):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    data = request.get_json() or {}
    conn = get_db()
    conn.execute(
        "UPDATE transport SET name=?, type=?, capacity=?, price_per_day=?, image=? WHERE id=?",
        (data.get('name', ''), data.get('type', 'Car'),
         data.get('capacity', 0), data.get('pricePerDay', 0),
         data.get('image', ''), trn_id)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM transport WHERE id = ?", (trn_id,)).fetchone()
    conn.close()
    if not row:
        return jsonify({'message': 'Vehicle not found'}), 404
    return jsonify(transport_to_dict(row))


@transport_bp.route('/<trn_id>', methods=['DELETE'])
@jwt_required()
def delete_transport(trn_id):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    conn.execute("DELETE FROM transport WHERE id = ?", (trn_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})
