"""
TravelVista — Enquiries Routes
"""
import time
from datetime import date
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_db, enquiry_to_dict

enquiries_bp = Blueprint('enquiries', __name__, url_prefix='/api/enquiries')


def _is_admin(uid):
    conn = get_db()
    row = conn.execute("SELECT role FROM users WHERE id = ?", (uid,)).fetchone()
    conn.close()
    return row and row['role'] == 'admin'


@enquiries_bp.route('', methods=['GET'])
@jwt_required()
def list_enquiries():
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    rows = conn.execute("SELECT * FROM enquiries ORDER BY created_at DESC").fetchall()
    conn.close()
    return jsonify([enquiry_to_dict(r) for r in rows])


@enquiries_bp.route('', methods=['POST'])
def add_enquiry():
    """Public: anyone can submit an enquiry (no auth required)."""
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()

    if not name or not email:
        return jsonify({'message': 'Name and email are required'}), 400

    enq_id = 'enq-' + str(int(time.time() * 1000))
    conn = get_db()
    conn.execute(
        "INSERT INTO enquiries (id,name,email,subject,message,status,reply,created_at) VALUES (?,?,?,?,?,?,?,?)",
        (enq_id, name, email, data.get('subject', ''), data.get('message', ''),
         'open', '', date.today().isoformat())
    )
    conn.commit()
    row = conn.execute("SELECT * FROM enquiries WHERE id = ?", (enq_id,)).fetchone()
    conn.close()
    return jsonify(enquiry_to_dict(row)), 201


@enquiries_bp.route('/<eid>/reply', methods=['PUT'])
@jwt_required()
def reply_enquiry(eid):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    data = request.get_json() or {}
    reply = data.get('reply', '')

    conn = get_db()
    conn.execute(
        "UPDATE enquiries SET reply = ?, status = 'replied' WHERE id = ?",
        (reply, eid)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM enquiries WHERE id = ?", (eid,)).fetchone()
    conn.close()
    if not row:
        return jsonify({'message': 'Enquiry not found'}), 404
    return jsonify(enquiry_to_dict(row))


@enquiries_bp.route('/<eid>/close', methods=['PUT'])
@jwt_required()
def close_enquiry(eid):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    conn.execute("UPDATE enquiries SET status = 'closed' WHERE id = ?", (eid,))
    conn.commit()
    row = conn.execute("SELECT * FROM enquiries WHERE id = ?", (eid,)).fetchone()
    conn.close()
    if not row:
        return jsonify({'message': 'Enquiry not found'}), 404
    return jsonify(enquiry_to_dict(row))


@enquiries_bp.route('/<eid>', methods=['DELETE'])
@jwt_required()
def delete_enquiry(eid):
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    conn = get_db()
    conn.execute("DELETE FROM enquiries WHERE id = ?", (eid,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})
