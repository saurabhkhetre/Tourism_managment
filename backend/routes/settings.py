"""
TravelVista — Settings Routes
"""
import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_db

settings_bp = Blueprint('settings', __name__, url_prefix='/api/settings')


def _is_admin(uid):
    conn = get_db()
    row = conn.execute("SELECT role FROM users WHERE id = ?", (uid,)).fetchone()
    conn.close()
    return row and row['role'] == 'admin'


def _get_all_settings():
    conn = get_db()
    rows = conn.execute("SELECT * FROM settings").fetchall()
    conn.close()
    result = {}
    for r in rows:
        key = r['key']
        val = r['value']
        # Try to parse JSON values
        if key in ('socialLinks', 'bannerImages'):
            try:
                val = json.loads(val)
            except (json.JSONDecodeError, TypeError):
                pass
        result[key] = val
    return result


@settings_bp.route('', methods=['GET'])
def get_settings():
    return jsonify(_get_all_settings())


@settings_bp.route('', methods=['PUT'])
@jwt_required()
def update_settings():
    uid = get_jwt_identity()
    if not _is_admin(uid):
        return jsonify({'message': 'Forbidden'}), 403

    data = request.get_json() or {}
    conn = get_db()
    for key, value in data.items():
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        conn.execute(
            "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?",
            (key, str(value), str(value))
        )
    conn.commit()
    conn.close()
    return jsonify(_get_all_settings())
