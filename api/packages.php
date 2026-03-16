<?php
/**
 * TravelVista — Packages API
 * GET    (no action)        — List active packages (public)
 * GET    ?action=all        — List ALL packages (admin)
 * GET    ?id=X              — Get single package
 * POST                      — Create package (admin)
 * PUT    ?id=X              — Update package (admin)
 * DELETE ?id=X              — Delete package (admin)
 * PATCH  ?id=X&action=toggle — Toggle active (admin)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/../config/jwt_helper.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id = $_GET['id'] ?? '';
if (!$action && !$id) {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (preg_match('#/api/packages/(\d+)/toggle#', $uri, $m)) { $id = $m[1]; $action = 'toggle'; }
    elseif (preg_match('#/api/packages/all#', $uri)) { $action = 'all'; }
    elseif (preg_match('#/api/packages/(\d+)#', $uri, $m)) { $id = $m[1]; }
}

// ── GET: List active packages (public) ──
if ($method === 'GET' && !$action && !$id) {
    $q = strtolower(trim($_GET['q'] ?? ''));
    $category = $_GET['category'] ?? '';
    $minPrice = isset($_GET['minPrice']) ? (float)$_GET['minPrice'] : null;
    $maxPrice = isset($_GET['maxPrice']) ? (float)$_GET['maxPrice'] : null;
    $sortBy = $_GET['sortBy'] ?? '';

    $db = getDB();
    $rows = $db->query("SELECT * FROM packages WHERE active = 1")->fetchAll();
    $result = array_map('package_to_dict', $rows);

    if ($q) {
        $result = array_filter($result, function($p) use ($q) {
            return strpos(strtolower($p['title']), $q) !== false ||
                   strpos(strtolower($p['location']), $q) !== false ||
                   strpos(strtolower($p['category']), $q) !== false;
        });
    }
    if ($category) {
        $result = array_filter($result, fn($p) => $p['category'] === $category);
    }
    if ($minPrice !== null) {
        $result = array_filter($result, fn($p) => $p['price'] >= $minPrice);
    }
    if ($maxPrice !== null) {
        $result = array_filter($result, fn($p) => $p['price'] <= $maxPrice);
    }

    $result = array_values($result);

    if ($sortBy === 'price-low') usort($result, fn($a, $b) => $a['price'] <=> $b['price']);
    elseif ($sortBy === 'price-high') usort($result, fn($a, $b) => $b['price'] <=> $a['price']);
    elseif ($sortBy === 'rating') usort($result, fn($a, $b) => $b['rating'] <=> $a['rating']);
    elseif ($sortBy === 'popular') usort($result, fn($a, $b) => $b['reviewCount'] <=> $a['reviewCount']);

    json_response($result);
}

// ── GET: All packages (admin) ──
if ($method === 'GET' && $action === 'all') {
    require_admin();
    $db = getDB();
    $rows = $db->query("SELECT * FROM packages ORDER BY created_at DESC")->fetchAll();
    json_response(array_map('package_to_dict', $rows));
}

// ── GET: Single package ──
if ($method === 'GET' && $id) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM packages WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) json_response(['message' => 'Package not found'], 404);
    json_response(package_to_dict($row));
}

// ── POST: Create package ──
if ($method === 'POST') {
    require_admin();
    $data = get_json_body();
    $db = getDB();

    $stmt = $db->prepare(
        "INSERT INTO packages (title, location, duration, price, original_price, max_persons, rating, review_count,
         image, gallery, category, description, highlights, itinerary, inclusions, exclusions, active, featured, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $data['title'] ?? '',
        $data['location'] ?? '',
        $data['duration'] ?? '',
        $data['price'] ?? 0,
        $data['originalPrice'] ?? 0,
        $data['maxPersons'] ?? 20,
        $data['image'] ?? '',
        json_encode($data['gallery'] ?? []),
        $data['category'] ?? '',
        $data['description'] ?? '',
        json_encode($data['highlights'] ?? []),
        json_encode($data['itinerary'] ?? []),
        json_encode($data['inclusions'] ?? []),
        json_encode($data['exclusions'] ?? []),
        ($data['active'] ?? true) ? 1 : 0,
        ($data['featured'] ?? false) ? 1 : 0,
        date('Y-m-d'),
    ]);

    $pkgId = $db->lastInsertId();
    $stmt = $db->prepare("SELECT * FROM packages WHERE id = ?");
    $stmt->execute([$pkgId]);
    json_response(package_to_dict($stmt->fetch()), 201);
}

// ── PUT: Update package ──
if ($method === 'PUT' && $id) {
    require_admin();
    $data = get_json_body();
    $db = getDB();

    $stmt = $db->prepare("SELECT * FROM packages WHERE id = ?");
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if (!$existing) json_response(['message' => 'Package not found'], 404);

    $stmt = $db->prepare(
        "UPDATE packages SET title=?, location=?, duration=?, price=?, original_price=?, max_persons=?,
         image=?, gallery=?, category=?, description=?, highlights=?, itinerary=?, inclusions=?, exclusions=?,
         active=?, featured=? WHERE id=?"
    );
    $stmt->execute([
        $data['title'] ?? $existing['title'],
        $data['location'] ?? $existing['location'],
        $data['duration'] ?? $existing['duration'],
        $data['price'] ?? $existing['price'],
        $data['originalPrice'] ?? $existing['original_price'],
        $data['maxPersons'] ?? $existing['max_persons'],
        $data['image'] ?? $existing['image'],
        json_encode($data['gallery'] ?? json_decode($existing['gallery'] ?: '[]', true)),
        $data['category'] ?? $existing['category'],
        $data['description'] ?? $existing['description'],
        json_encode($data['highlights'] ?? json_decode($existing['highlights'] ?: '[]', true)),
        json_encode($data['itinerary'] ?? json_decode($existing['itinerary'] ?: '[]', true)),
        json_encode($data['inclusions'] ?? json_decode($existing['inclusions'] ?: '[]', true)),
        json_encode($data['exclusions'] ?? json_decode($existing['exclusions'] ?: '[]', true)),
        isset($data['active']) ? ($data['active'] ? 1 : 0) : $existing['active'],
        isset($data['featured']) ? ($data['featured'] ? 1 : 0) : $existing['featured'],
        $id,
    ]);

    $stmt = $db->prepare("SELECT * FROM packages WHERE id = ?");
    $stmt->execute([$id]);
    json_response(package_to_dict($stmt->fetch()));
}

// ── DELETE: Delete package ──
if ($method === 'DELETE' && $id) {
    require_admin();
    $db = getDB();
    $db->prepare("DELETE FROM packages WHERE id = ?")->execute([$id]);
    json_response(['success' => true]);
}

// ── PATCH: Toggle active ──
if ($method === 'PATCH' && $id && $action === 'toggle') {
    require_admin();
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM packages WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) json_response(['message' => 'Package not found'], 404);

    $newActive = $row['active'] ? 0 : 1;
    $db->prepare("UPDATE packages SET active = ? WHERE id = ?")->execute([$newActive, $id]);

    $stmt = $db->prepare("SELECT * FROM packages WHERE id = ?");
    $stmt->execute([$id]);
    json_response(package_to_dict($stmt->fetch()));
}

json_response(['message' => 'Invalid request'], 400);
?>
