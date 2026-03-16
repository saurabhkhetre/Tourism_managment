<?php
/**
 * TravelVista — Hotels API (Admin)
 * GET                — List hotels
 * POST               — Add hotel
 * PUT    ?id=X       — Update hotel
 * DELETE ?id=X       — Delete hotel
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/../config/jwt_helper.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? '';
if (!$id) {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (preg_match('#/api/hotels/(\d+)#', $uri, $m)) { $id = $m[1]; }
}

// ── GET: List hotels ──
if ($method === 'GET') {
    require_admin();
    $db = getDB();
    $rows = $db->query("SELECT * FROM hotels")->fetchAll();
    json_response(array_map('hotel_to_dict', $rows));
}

// ── POST: Add hotel ──
if ($method === 'POST') {
    require_admin();
    $data = get_json_body();
    $db = getDB();

    $stmt = $db->prepare(
        "INSERT INTO hotels (name, location, rating, price_per_night, capacity, type, image) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $data['name'] ?? '', $data['location'] ?? '',
        $data['rating'] ?? 0, $data['pricePerNight'] ?? 0,
        $data['capacity'] ?? 0, $data['type'] ?? 'Hotel', $data['image'] ?? '',
    ]);

    $htlId = $db->lastInsertId();
    $stmt = $db->prepare("SELECT * FROM hotels WHERE id = ?");
    $stmt->execute([$htlId]);
    json_response(hotel_to_dict($stmt->fetch()), 201);
}

// ── PUT: Update hotel ──
if ($method === 'PUT' && $id) {
    require_admin();
    $data = get_json_body();
    $db = getDB();

    $db->prepare(
        "UPDATE hotels SET name=?, location=?, rating=?, price_per_night=?, capacity=?, type=?, image=? WHERE id=?"
    )->execute([
        $data['name'] ?? '', $data['location'] ?? '',
        $data['rating'] ?? 0, $data['pricePerNight'] ?? 0,
        $data['capacity'] ?? 0, $data['type'] ?? 'Hotel',
        $data['image'] ?? '', $id,
    ]);

    $stmt = $db->prepare("SELECT * FROM hotels WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) json_response(['message' => 'Hotel not found'], 404);
    json_response(hotel_to_dict($row));
}

// ── DELETE: Delete hotel ──
if ($method === 'DELETE' && $id) {
    require_admin();
    $db = getDB();
    $db->prepare("DELETE FROM hotels WHERE id = ?")->execute([$id]);
    json_response(['success' => true]);
}

json_response(['message' => 'Invalid request'], 400);
?>
