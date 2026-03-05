"""
TravelVista — Flask Application
Main entry point for the Python backend.
"""
import os
from datetime import timedelta
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from models import init_db
from seed import seed

from routes.auth import auth_bp
from routes.packages import packages_bp
from routes.bookings import bookings_bp
from routes.reviews import reviews_bp
from routes.enquiries import enquiries_bp
from routes.hotels import hotels_bp
from routes.transport import transport_bp
from routes.users import users_bp
from routes.settings import settings_bp


def create_app():
    # Resolve frontend directory path
    frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend')
    app = Flask(__name__, static_folder=os.path.join(frontend_dir), static_url_path='/static')

    # ── Configuration ────────────────────────────────────────────────
    app.config['SECRET_KEY'] = os.environ.get(
        'SECRET_KEY', 'travelvista-secret-key-change-in-production'
    )
    app.config['JWT_SECRET_KEY'] = os.environ.get(
        'JWT_SECRET_KEY', 'travelvista-jwt-secret-change-in-production'
    )
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

    # ── CORS ─────────────────────────────────────────────────────────
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # ── JWT ──────────────────────────────────────────────────────────
    jwt = JWTManager(app)

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'message': 'Token has expired', 'error': 'token_expired'}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'message': 'Invalid token', 'error': 'invalid_token'}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'message': 'Authorization required', 'error': 'authorization_required'}), 401

    # ── Register Blueprints ──────────────────────────────────────────
    app.register_blueprint(auth_bp)
    app.register_blueprint(packages_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(enquiries_bp)
    app.register_blueprint(hotels_bp)
    app.register_blueprint(transport_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(settings_bp)

    # ── Serve Frontend ────────────────────────────────────────────────
    @app.route('/')
    def serve_index():
        return send_from_directory(frontend_dir, 'index.html')

    @app.route('/static/<path:filename>')
    def serve_static(filename):
        return send_from_directory(frontend_dir, filename)

    # ── Health Check ─────────────────────────────────────────────────
    @app.route('/api/health')
    def health():
        return jsonify({'status': 'ok', 'service': 'TravelVista API'})

    # ── Error Handlers ───────────────────────────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        # Return index.html for non-API routes (SPA fallback)
        if not str(e).startswith('/api'):
            return send_from_directory(frontend_dir, 'index.html')
        return jsonify({'message': 'Resource not found'}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'message': 'Internal server error'}), 500

    # ── Initialize DB & Seed ─────────────────────────────────────────
    with app.app_context():
        init_db()
        seed()

    return app


if __name__ == '__main__':
    app = create_app()
    print(">> TravelVista API running on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
