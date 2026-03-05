"""
TravelVista — SQLite Database Models & Helpers
"""
import sqlite3
import os
import json

DB_PATH = os.path.join(os.path.dirname(__file__), 'travelvista.db')


def get_db():
    """Get a database connection with row_factory set."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def dict_row(row):
    """Convert a sqlite3.Row to a plain dict."""
    return dict(row) if row else None


def dict_rows(rows):
    """Convert a list of sqlite3.Row to list of dicts."""
    return [dict(r) for r in rows]


def init_db():
    """Create all tables if they don't exist."""
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT DEFAULT '',
            role TEXT DEFAULT 'user',
            avatar TEXT DEFAULT '',
            joined_at TEXT NOT NULL,
            active INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS packages (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            location TEXT NOT NULL,
            duration TEXT NOT NULL,
            price REAL NOT NULL,
            original_price REAL DEFAULT 0,
            max_persons INTEGER DEFAULT 20,
            rating REAL DEFAULT 0,
            review_count INTEGER DEFAULT 0,
            image TEXT DEFAULT '',
            gallery TEXT DEFAULT '[]',
            category TEXT DEFAULT '',
            description TEXT DEFAULT '',
            highlights TEXT DEFAULT '[]',
            itinerary TEXT DEFAULT '[]',
            inclusions TEXT DEFAULT '[]',
            exclusions TEXT DEFAULT '[]',
            active INTEGER DEFAULT 1,
            featured INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS bookings (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            package_id TEXT NOT NULL,
            package_title TEXT DEFAULT '',
            travel_date TEXT NOT NULL,
            persons INTEGER DEFAULT 1,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            payment_status TEXT DEFAULT 'pending',
            payment_method TEXT DEFAULT '',
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (package_id) REFERENCES packages(id)
        );

        CREATE TABLE IF NOT EXISTS reviews (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            user_name TEXT DEFAULT '',
            user_avatar TEXT DEFAULT '',
            package_id TEXT NOT NULL,
            package_title TEXT DEFAULT '',
            rating INTEGER DEFAULT 5,
            comment TEXT DEFAULT '',
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (package_id) REFERENCES packages(id)
        );

        CREATE TABLE IF NOT EXISTS enquiries (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT DEFAULT '',
            message TEXT DEFAULT '',
            status TEXT DEFAULT 'open',
            reply TEXT DEFAULT '',
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS hotels (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            location TEXT DEFAULT '',
            rating REAL DEFAULT 0,
            price_per_night REAL DEFAULT 0,
            capacity INTEGER DEFAULT 0,
            type TEXT DEFAULT 'Hotel',
            image TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS transport (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT DEFAULT 'Car',
            capacity INTEGER DEFAULT 0,
            price_per_day REAL DEFAULT 0,
            image TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT DEFAULT ''
        );
    """)
    conn.commit()
    conn.close()


# ── Serialization helpers (DB row ↔ frontend JSON) ──────────────────

def package_to_dict(row):
    """Convert a packages row to the frontend-expected shape."""
    d = dict(row)
    for field in ('gallery', 'highlights', 'itinerary', 'inclusions', 'exclusions'):
        if isinstance(d.get(field), str):
            try:
                d[field] = json.loads(d[field])
            except (json.JSONDecodeError, TypeError):
                d[field] = []
    # Convert snake_case → camelCase for frontend
    return {
        'id': d['id'],
        'title': d['title'],
        'location': d['location'],
        'duration': d['duration'],
        'price': d['price'],
        'originalPrice': d.get('original_price', 0),
        'maxPersons': d.get('max_persons', 20),
        'rating': d.get('rating', 0),
        'reviewCount': d.get('review_count', 0),
        'image': d.get('image', ''),
        'gallery': d.get('gallery', []),
        'category': d.get('category', ''),
        'description': d.get('description', ''),
        'highlights': d.get('highlights', []),
        'itinerary': d.get('itinerary', []),
        'inclusions': d.get('inclusions', []),
        'exclusions': d.get('exclusions', []),
        'active': bool(d.get('active', 1)),
        'featured': bool(d.get('featured', 0)),
        'createdAt': d.get('created_at', ''),
    }


def user_to_dict(row):
    """Convert a users row to the frontend-expected shape (no password)."""
    d = dict(row)
    return {
        'id': d['id'],
        'name': d['name'],
        'email': d['email'],
        'phone': d.get('phone', ''),
        'role': d.get('role', 'user'),
        'avatar': d.get('avatar', ''),
        'joinedAt': d.get('joined_at', ''),
        'active': bool(d.get('active', 1)),
    }


def booking_to_dict(row):
    d = dict(row)
    return {
        'id': d['id'],
        'userId': d['user_id'],
        'packageId': d['package_id'],
        'packageTitle': d.get('package_title', ''),
        'travelDate': d.get('travel_date', ''),
        'persons': d.get('persons', 1),
        'totalAmount': d.get('total_amount', 0),
        'status': d.get('status', 'pending'),
        'paymentStatus': d.get('payment_status', 'pending'),
        'paymentMethod': d.get('payment_method', ''),
        'createdAt': d.get('created_at', ''),
    }


def review_to_dict(row):
    d = dict(row)
    return {
        'id': d['id'],
        'userId': d['user_id'],
        'userName': d.get('user_name', ''),
        'userAvatar': d.get('user_avatar', ''),
        'packageId': d['package_id'],
        'packageTitle': d.get('package_title', ''),
        'rating': d.get('rating', 5),
        'comment': d.get('comment', ''),
        'createdAt': d.get('created_at', ''),
    }


def enquiry_to_dict(row):
    d = dict(row)
    return {
        'id': d['id'],
        'name': d['name'],
        'email': d['email'],
        'subject': d.get('subject', ''),
        'message': d.get('message', ''),
        'status': d.get('status', 'open'),
        'reply': d.get('reply', ''),
        'createdAt': d.get('created_at', ''),
    }


def hotel_to_dict(row):
    d = dict(row)
    return {
        'id': d['id'],
        'name': d['name'],
        'location': d.get('location', ''),
        'rating': d.get('rating', 0),
        'pricePerNight': d.get('price_per_night', 0),
        'capacity': d.get('capacity', 0),
        'type': d.get('type', 'Hotel'),
        'image': d.get('image', ''),
    }


def transport_to_dict(row):
    d = dict(row)
    return {
        'id': d['id'],
        'name': d['name'],
        'type': d.get('type', 'Car'),
        'capacity': d.get('capacity', 0),
        'pricePerDay': d.get('price_per_day', 0),
        'image': d.get('image', ''),
    }
