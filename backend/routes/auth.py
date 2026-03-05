"""
TravelVista — Auth Routes
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
PUT  /api/auth/profile
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)
import bcrypt
from models import get_db, user_to_dict

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400

    conn = get_db()
    row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()

    if not row:
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

    user = dict(row)
    if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

    if not user['active']:
        return jsonify({'success': False, 'message': 'Your account has been blocked. Contact admin.'}), 403

    token = create_access_token(identity=user['id'])
    return jsonify({
        'success': True,
        'token': token,
        'user': user_to_dict(row),
    })


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    phone = data.get('phone', '')

    if not name or not email or not password:
        return jsonify({'success': False, 'message': 'Name, email & password are required'}), 400

    conn = get_db()
    existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if existing:
        conn.close()
        return jsonify({'success': False, 'message': 'Email already registered'}), 409

    import urllib.parse
    user_id = 'user-' + str(int(__import__('time').time() * 1000))
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    avatar = f"https://ui-avatars.com/api/?name={urllib.parse.quote(name)}&background=0891b2&color=fff&size=100"
    joined = __import__('datetime').date.today().isoformat()

    conn.execute(
        "INSERT INTO users (id,name,email,password,phone,role,avatar,joined_at,active) VALUES (?,?,?,?,?,?,?,?,?)",
        (user_id, name, email, hashed, phone, 'user', avatar, joined, 1)
    )
    conn.commit()

    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()

    token = create_access_token(identity=user_id)
    return jsonify({
        'success': True,
        'token': token,
        'user': user_to_dict(row),
    }), 201


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    uid = get_jwt_identity()
    conn = get_db()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (uid,)).fetchone()
    conn.close()
    if not row:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user_to_dict(row))


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    uid = get_jwt_identity()
    data = request.get_json() or {}
    allowed = {'name', 'phone', 'avatar'}
    updates = {k: v for k, v in data.items() if k in allowed and v is not None}

    if not updates:
        return jsonify({'message': 'Nothing to update'}), 400

    set_clause = ', '.join(f"{k} = ?" for k in updates)
    values = list(updates.values()) + [uid]

    conn = get_db()
    conn.execute(f"UPDATE users SET {set_clause} WHERE id = ?", values)
    conn.commit()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (uid,)).fetchone()
    conn.close()
    return jsonify(user_to_dict(row))
