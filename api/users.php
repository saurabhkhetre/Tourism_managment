<?php
/**
 * TravelVista — Users API (Admin)
 * GET                         — List all users
 * PUT    ?id=X&action=toggle  — Toggle user active/blocked
 * DELETE ?id=X                — Delete user
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/../config/jwt_helper.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id = $_GET['id'] ?? '';
if (!$action && !$id) {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (preg_match('#/api/users/(\d+)/toggle#', $uri, $m)) { $id = $m[1]; $action = 'toggle'; }
    elseif (preg_match('#/api/users/(\d+)#', $uri, $m)) { $id = $m[1]; }
}

// ── GET: List users ──
if ($method === 'GET') {
    require_admin();
    $db = getDB();
    $rows = $db->query("SELECT * FROM users ORDER BY joined_at DESC")->fetchAll();
    json_response(array_map('user_to_dict', $rows));
}

// ── PUT: Toggle user active/blocked ──
if ($method === 'PUT' && $id && $action === 'toggle') {
    require_admin();
    $db = getDB();

    $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) json_response(['message' => 'User not found'], 404);

    $newActive = $row['active'] ? 0 : 1;
    $db->prepare("UPDATE users SET active = ? WHERE id = ?")->execute([$newActive, $id]);

    $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$id]);
    json_response(user_to_dict($stmt->fetch()));
}

// ── DELETE: Delete user ──
if ($method === 'DELETE' && $id) {
    require_admin();
    $db = getDB();
    $db->prepare("DELETE FROM users WHERE id = ?")->execute([$id]);
    json_response(['success' => true]);
}

json_response(['message' => 'Invalid request'], 400);
?>
