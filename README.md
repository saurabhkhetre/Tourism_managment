# TravelVista — Tours & Travel Management System

A full-featured tour and travel management platform built with **PHP/MySQL** backend and **HTML/CSS/Bootstrap 5/JavaScript** frontend, designed to run on **WAMP Server**.

## 🚀 Tech Stack

| Layer     | Technology                     |
| --------- | ------------------------------ |
| Server    | WAMP (Apache + MySQL + PHP)    |
| Backend   | PHP 8+ with PDO MySQL          |
| Frontend  | HTML5, CSS3, Bootstrap 5.3, JS |
| Database  | MySQL 8+                       |
| Auth      | JWT (pure PHP, HMAC-SHA256)    |

## 📁 Project Structure

```
travelvista/
├── api/                    # PHP API endpoints
│   ├── auth.php            # Login, Register, Profile
│   ├── packages.php        # Tour packages CRUD
│   ├── bookings.php        # Bookings management
│   ├── reviews.php         # Reviews & ratings
│   ├── enquiries.php       # Contact enquiries
│   ├── hotels.php          # Hotels admin CRUD
│   ├── transport.php       # Transport admin CRUD
│   ├── users.php           # User management (admin)
│   └── settings.php        # Site settings
├── config/
│   ├── database.php        # MySQL PDO connection
│   └── jwt_helper.php      # JWT auth + model helpers
├── frontend/
│   ├── css/main.css         # Custom styles
│   └── js/                  # SPA JavaScript modules
├── index.html              # Main entry point
├── database.sql            # MySQL schema
├── seed.php                # Database seeder
├── .htaccess               # Apache URL rewriting
└── README.md
```

## ⚡ Quick Setup (WAMP)

### 1. Install WAMP Server
Download and install [WAMP Server](https://www.wampserver.com/) if not already installed.

### 2. Copy Project
Copy this project folder to your WAMP `www` directory:
```
C:\wamp64\www\travelvista\
```

### 3. Create Database
1. Open **phpMyAdmin** → `http://localhost/phpmyadmin`
2. Create a new database named `travelvista`
3. Import the `database.sql` file (or copy/paste and run it)

### 4. Configure Database (Optional)
If your MySQL credentials differ from the defaults (root / no password), edit:
```
config/database.php
```

### 5. Enable Apache Rewrite Module
1. Click the WAMP icon in the system tray
2. Go to **Apache** → **Modules** → Enable **rewrite_module**
3. Restart WAMP

### 6. Seed the Database
Open in your browser:
```
http://localhost/travelvista/seed.php
```

### 7. Visit the App
```
http://localhost/travelvista/
```

## 🔐 Demo Credentials

| Role  | Email                          | Password      |
| ----- | ------------------------------ | ------------- |
| Admin | khetresaurabh.work@gmail.com   | Saurabh@2971  |
| User  | rahul@example.com              | user123       |

## ✨ Features

### Public
- 🏠 Hero slider with animated counters
- 📦 Browse 12+ tour packages with search, filter, sort
- 📋 Detailed package pages with itinerary, gallery, reviews
- ✉️ Contact form with enquiry submission
- 📱 Fully responsive design

### User
- 🔐 JWT-based authentication (register/login)
- 👤 User dashboard with profile management
- 📅 Book tours and manage bookings
- ⭐ Write reviews and ratings

### Admin
- 📊 Dashboard with stats and revenue charts
- 📦 Full package management (CRUD, toggle active, featured)
- 📅 Booking management with status updates
- 👥 User management (block/unblock, delete)
- ⭐ Review moderation
- ✉️ Enquiry management with replies
- 🏨 Hotels & Transport management
- 📈 Revenue reports
- ⚙️ Site settings (name, contact, banners)

## 🔌 API Endpoints

All endpoints are accessed via `/api/` prefix with clean URLs (via `.htaccess`):

| Method | Endpoint                        | Auth    | Description                |
| ------ | ------------------------------- | ------- | -------------------------- |
| POST   | /api/auth/login                 | —       | Login                      |
| POST   | /api/auth/register              | —       | Register                   |
| GET    | /api/auth/me                    | JWT     | Get current user           |
| PUT    | /api/auth/profile               | JWT     | Update profile             |
| GET    | /api/packages                   | —       | List active packages       |
| GET    | /api/packages/all               | Admin   | List all packages          |
| GET    | /api/packages/{id}              | —       | Get package details        |
| POST   | /api/packages                   | Admin   | Create package             |
| PUT    | /api/packages/{id}              | Admin   | Update package             |
| DELETE | /api/packages/{id}              | Admin   | Delete package             |
| PATCH  | /api/packages/{id}/toggle       | Admin   | Toggle active status       |
| GET    | /api/bookings                   | Admin   | List all bookings          |
| GET    | /api/bookings/my                | JWT     | List user's bookings       |
| POST   | /api/bookings                   | JWT     | Create booking             |
| GET    | /api/bookings/revenue           | Admin   | Revenue data               |
| GET    | /api/reviews/recent             | —       | Recent reviews             |
| GET    | /api/reviews/package/{id}       | —       | Package reviews            |
| POST   | /api/reviews                    | JWT     | Add review                 |
| POST   | /api/enquiries                  | —       | Submit enquiry             |
| GET    | /api/settings                   | —       | Get site settings          |
| PUT    | /api/settings                   | Admin   | Update settings            |

## 📄 License

This project is for educational purposes.
