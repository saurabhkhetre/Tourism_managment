-- ============================================================
-- TravelVista — MySQL Database Schema
-- Run this in phpMyAdmin or MySQL CLI to create the database.
-- ============================================================

CREATE DATABASE IF NOT EXISTS travelvista
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE travelvista;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT '',
    role ENUM('user','admin') DEFAULT 'user',
    avatar VARCHAR(500) DEFAULT '',
    joined_at DATE NOT NULL,
    active TINYINT(1) DEFAULT 1,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- ── Packages ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2) DEFAULT 0,
    max_persons INT DEFAULT 20,
    rating DECIMAL(3,1) DEFAULT 0,
    review_count INT DEFAULT 0,
    image VARCHAR(500) DEFAULT '',
    gallery TEXT,
    category VARCHAR(50) DEFAULT '',
    description TEXT,
    highlights TEXT,
    itinerary TEXT,
    inclusions TEXT,
    exclusions TEXT,
    active TINYINT(1) DEFAULT 1,
    featured TINYINT(1) DEFAULT 0,
    created_at DATE NOT NULL,
    INDEX idx_packages_active (active),
    INDEX idx_packages_category (category),
    INDEX idx_packages_featured (featured)
) ENGINE=InnoDB;

-- ── Bookings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    package_id INT NOT NULL,
    package_title VARCHAR(200) DEFAULT '',
    travel_date DATE NOT NULL,
    persons INT DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
    payment_status ENUM('pending','paid','refunded','cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50) DEFAULT '',
    created_at DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    INDEX idx_bookings_user (user_id),
    INDEX idx_bookings_status (status)
) ENGINE=InnoDB;

-- ── Reviews ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_name VARCHAR(100) DEFAULT '',
    user_avatar VARCHAR(500) DEFAULT '',
    package_id INT NOT NULL,
    package_title VARCHAR(200) DEFAULT '',
    rating INT DEFAULT 5,
    comment TEXT,
    created_at DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    INDEX idx_reviews_package (package_id)
) ENGINE=InnoDB;

-- ── Enquiries ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) DEFAULT '',
    message TEXT,
    status ENUM('open','replied','closed') DEFAULT 'open',
    reply TEXT,
    created_at DATE NOT NULL,
    INDEX idx_enquiries_status (status)
) ENGINE=InnoDB;

-- ── Hotels ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(200) DEFAULT '',
    rating DECIMAL(3,1) DEFAULT 0,
    price_per_night DECIMAL(10,2) DEFAULT 0,
    capacity INT DEFAULT 0,
    type VARCHAR(50) DEFAULT 'Hotel',
    image VARCHAR(500) DEFAULT '',
    available TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

-- ── Transport ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transport (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) DEFAULT 'Car',
    capacity INT DEFAULT 0,
    price_per_day DECIMAL(10,2) DEFAULT 0,
    image VARCHAR(500) DEFAULT '',
    available TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

-- ── Settings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
    `key` VARCHAR(100) PRIMARY KEY,
    `value` TEXT DEFAULT ''
) ENGINE=InnoDB;
