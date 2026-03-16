<?php
/**
 * TravelVista — Auth API
 * POST ?action=login     — Login
 * POST ?action=register  — Register
 * GET  ?action=me        — Get current user
 * PUT  ?action=profile   — Update profile
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/../config/jwt_helper.php';

// Parse action from query string OR from URL path (fallback for .htaccess)
$action = $_GET['action'] ?? '';
if (!$action) {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (preg_match('#/api/auth/([a-zA-Z]+)#', $uri, $m)) {
        $action = $m[1];
    }
}
$method = $_SERVER['REQUEST_METHOD'];

// ── LOGIN ────────────────────────────────────────────────────
if ($action === 'login' && $method === 'POST') {
    $data = get_json_body();
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (!$email || !$password) {
        json_response(['success' => false, 'message' => 'Email and password are required'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        json_response(['success' => false, 'message' => 'Invalid email or password'], 401);
    }

    if (!$user['active']) {
        json_response(['success' => false, 'message' => 'Your account has been blocked. Contact admin.'], 403);
    }

    $token = jwt_encode(['sub' => $user['id']]);
    json_response([
        'success' => true,
        'token'   => $token,
        'user'    => user_to_dict($user),
    ]);
}

// ── REGISTER ─────────────────────────────────────────────────
if ($action === 'register' && $method === 'POST') {
    $data = get_json_body();
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $phone = $data['phone'] ?? '';

    if (!$name || !$email || !$password) {
        json_response(['success' => false, 'message' => 'Name, email & password are required'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        json_response(['success' => false, 'message' => 'Email already registered'], 409);
    }

    $hashed = password_hash($password, PASSWORD_BCRYPT, ['cost' => 4]);
    $avatar = "https://ui-avatars.com/api/?name=" . urlencode($name) . "&background=0891b2&color=fff&size=100";
    $joined = date('Y-m-d');

    $stmt = $db->prepare(
        "INSERT INTO users (name, email, password, phone, role, avatar, joined_at, active) VALUES (?, ?, ?, ?, 'user', ?, ?, 1)"
    );
    $stmt->execute([$name, $email, $hashed, $phone, $avatar, $joined]);
    $userId = $db->lastInsertId();

    $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    $token = jwt_encode(['sub' => $userId]);
    json_response([
        'success' => true,
        'token'   => $token,
        'user'    => user_to_dict($user),
    ], 201);
}

// ── ME ───────────────────────────────────────────────────────
if ($action === 'me' && $method === 'GET') {
    $userId = require_auth();
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    if (!$user) json_response(['message' => 'User not found'], 404);
    json_response(user_to_dict($user));
}

// ── UPDATE PROFILE ───────────────────────────────────────────
if ($action === 'profile' && $method === 'PUT') {
    $userId = require_auth();
    $data = get_json_body();
    $allowed = ['name', 'phone', 'avatar'];
    $updates = [];
    $values = [];
    foreach ($allowed as $key) {
        if (isset($data[$key]) && $data[$key] !== null) {
            $updates[] = "$key = ?";
            $values[] = $data[$key];
        }
    }

    if (empty($updates)) {
        json_response(['message' => 'Nothing to update'], 400);
    }

    $values[] = $userId;
    $db = getDB();
    $db->prepare("UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?")->execute($values);

    $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    json_response(user_to_dict($stmt->fetch()));
}

json_response(['message' => 'Invalid action'], 400);
?>
