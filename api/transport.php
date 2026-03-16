<?php
/**
 * TravelVista — Transport API (Admin)
 * GET                — List transport
 * POST               — Add transport
 * PUT    ?id=X       — Update transport
 * DELETE ?id=X       — Delete transport
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
    if (preg_match('#/api/transport/(\d+)#', $uri, $m)) { $id = $m[1]; }
}

// ── GET: List transport ──
if ($method === 'GET') {
    require_admin();
    $db = getDB();
    $rows = $db->query("SELECT * FROM transport")->fetchAll();
    json_response(array_map('transport_to_dict', $rows));
}

// ── POST: Add transport ──
if ($method === 'POST') {
    require_admin();
    $data = get_json_body();
    $db = getDB();

    $stmt = $db->prepare(
        "INSERT INTO transport (name, type, capacity, price_per_day, image) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $data['name'] ?? '', $data['type'] ?? 'Car',
        $data['capacity'] ?? 0, $data['pricePerDay'] ?? 0, $data['image'] ?? '',
    ]);

    $trnId = $db->lastInsertId();
    $stmt = $db->prepare("SELECT * FROM transport WHERE id = ?");
    $stmt->execute([$trnId]);
    json_response(transport_to_dict($stmt->fetch()), 201);
}

// ── PUT: Update transport ──
if ($method === 'PUT' && $id) {
    require_admin();
    $data = get_json_body();
    $db = getDB();

    $db->prepare(
        "UPDATE transport SET name=?, type=?, capacity=?, price_per_day=?, image=? WHERE id=?"
    )->execute([
        $data['name'] ?? '', $data['type'] ?? 'Car',
        $data['capacity'] ?? 0, $data['pricePerDay'] ?? 0,
        $data['image'] ?? '', $id,
    ]);

    $stmt = $db->prepare("SELECT * FROM transport WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) json_response(['message' => 'Vehicle not found'], 404);
    json_response(transport_to_dict($row));
}

// ── DELETE: Delete transport ──
if ($method === 'DELETE' && $id) {
    require_admin();
    $db = getDB();
    $db->prepare("DELETE FROM transport WHERE id = ?")->execute([$id]);
    json_response(['success' => true]);
}

json_response(['message' => 'Invalid request'], 400);
?>
