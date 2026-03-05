"""
TravelVista — Users Routes (Admin)
"""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_db, user_to_dict

users_bp = Blueprint('users', __name__, url_prefix='/api/users')


def _is_admin(uid):
    conn = get_db()
    row = conn.execute("SELECT role FROM users WHERE id = ?", (uid,)).fetchone()
    conn.close()
    return row and row['role'] == 'admin'


@users_bp.route('', methods=['GET'])
@jwt_required()
def list_users():
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    rows = conn.execute("SELECT * FROM users ORDER BY joined_at DESC").fetchall()
    conn.close()
    return jsonify([user_to_dict(r) for r in rows])


@users_bp.route('/<user_id>/toggle', methods=['PUT'])
@jwt_required()
def toggle_block(user_id):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    if not row:
        conn.close()
        return jsonify({'message': 'User not found'}), 404

    new_active = 0 if row['active'] else 1
    conn.execute("UPDATE users SET active = ? WHERE id = ?", (new_active, user_id))
    conn.commit()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return jsonify(user_to_dict(row))


@users_bp.route('/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})
