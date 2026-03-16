<?php
/**
 * TravelVista — Enquiries API
 * GET                         — List enquiries (admin)
 * POST                        — Submit enquiry (public)
 * PUT  ?id=X&action=reply     — Reply to enquiry (admin)
 * PUT  ?id=X&action=close     — Close enquiry (admin)
 * DELETE ?id=X                — Delete enquiry (admin)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/../config/jwt_helper.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id = $_GET['id'] ?? '';
if (!$action && !$id) {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (preg_match('#/api/enquiries/(\d+)/reply#', $uri, $m)) { $id = $m[1]; $action = 'reply'; }
    elseif (preg_match('#/api/enquiries/(\d+)/close#', $uri, $m)) { $id = $m[1]; $action = 'close'; }
    elseif (preg_match('#/api/enquiries/(\d+)#', $uri, $m)) { $id = $m[1]; }
}

// ── POST: Submit enquiry (public) ──
if ($method === 'POST') {
    $data = get_json_body();
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');

    if (!$name || !$email) {
        json_response(['message' => 'Name and email are required'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare(
        "INSERT INTO enquiries (name, email, subject, message, status, reply, created_at) VALUES (?, ?, ?, ?, 'open', '', ?)"
    );
    $stmt->execute([$name, $email, $data['subject'] ?? '', $data['message'] ?? '', date('Y-m-d')]);

    $enqId = $db->lastInsertId();
    $stmt = $db->prepare("SELECT * FROM enquiries WHERE id = ?");
    $stmt->execute([$enqId]);
    json_response(enquiry_to_dict($stmt->fetch()), 201);
}

// ── GET: List enquiries (admin) ──
if ($method === 'GET') {
    require_admin();
    $db = getDB();
    $rows = $db->query("SELECT * FROM enquiries ORDER BY created_at DESC")->fetchAll();
    json_response(array_map('enquiry_to_dict', $rows));
}

// ── PUT: Reply to enquiry (admin) ──
if ($method === 'PUT' && $id && $action === 'reply') {
    require_admin();
    $data = get_json_body();
    $reply = $data['reply'] ?? '';

    $db = getDB();
    $db->prepare("UPDATE enquiries SET reply = ?, status = 'replied' WHERE id = ?")->execute([$reply, $id]);

    $stmt = $db->prepare("SELECT * FROM enquiries WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) json_response(['message' => 'Enquiry not found'], 404);
    json_response(enquiry_to_dict($row));
}

// ── PUT: Close enquiry (admin) ──
if ($method === 'PUT' && $id && $action === 'close') {
    require_admin();
    $db = getDB();
    $db->prepare("UPDATE enquiries SET status = 'closed' WHERE id = ?")->execute([$id]);

    $stmt = $db->prepare("SELECT * FROM enquiries WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) json_response(['message' => 'Enquiry not found'], 404);
    json_response(enquiry_to_dict($row));
}

// ── DELETE: Delete enquiry (admin) ──
if ($method === 'DELETE' && $id) {
    require_admin();
    $db = getDB();
    $db->prepare("DELETE FROM enquiries WHERE id = ?")->execute([$id]);
    json_response(['success' => true]);
}

json_response(['message' => 'Invalid request'], 400);
?>
