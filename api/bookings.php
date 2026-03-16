<?php
/**
 * TravelVista — Bookings API
 * GET                          — List all bookings (admin)
 * GET    ?action=my            — List current user's bookings
 * POST                         — Create booking
 * PUT    ?id=X&action=status   — Update booking status (admin)
 * PUT    ?id=X&action=pay      — Confirm payment
 * PUT    ?id=X&action=cancel   — Cancel booking
 * GET    ?action=revenue       — Revenue data (admin)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/../config/jwt_helper.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id = $_GET['id'] ?? '';
if (!$action && !$id) {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (preg_match('#/api/bookings/(\d+)/status#', $uri, $m)) { $id = $m[1]; $action = 'status'; }
    elseif (preg_match('#/api/bookings/(\d+)/pay#', $uri, $m)) { $id = $m[1]; $action = 'pay'; }
    elseif (preg_match('#/api/bookings/(\d+)/cancel#', $uri, $m)) { $id = $m[1]; $action = 'cancel'; }
    elseif (preg_match('#/api/bookings/my#', $uri)) { $action = 'my'; }
    elseif (preg_match('#/api/bookings/revenue#', $uri)) { $action = 'revenue'; }
    elseif (preg_match('#/api/bookings/(\d+)#', $uri, $m)) { $id = $m[1]; }
}

// ── GET: All bookings (admin) ──
if ($method === 'GET' && !$action && !$id) {
    require_admin();
    $db = getDB();
    $rows = $db->query("SELECT b.*, u.name as user_name FROM bookings b LEFT JOIN users u ON b.user_id = u.id ORDER BY b.created_at DESC")->fetchAll();
    json_response(array_map('booking_to_dict', $rows));
}

// ── GET: My bookings ──
if ($method === 'GET' && $action === 'my') {
    $userId = require_auth();
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$userId]);
    json_response(array_map('booking_to_dict', $stmt->fetchAll()));
}

// ── GET: Revenue (admin) ──
if ($method === 'GET' && $action === 'revenue') {
    require_admin();
    $db = getDB();
    $rows = $db->query("SELECT * FROM bookings WHERE payment_status = 'paid'")->fetchAll();

    $total = 0;
    $months = [];
    foreach ($rows as $r) {
        $total += (float)$r['total_amount'];
        $m = substr($r['created_at'], 0, 7);
        $months[$m] = ($months[$m] ?? 0) + (float)$r['total_amount'];
    }
    ksort($months);
    $monthly = [];
    foreach ($months as $k => $v) {
        $monthly[] = ['month' => $k, 'revenue' => $v];
    }
    json_response(['totalRevenue' => $total, 'monthlyRevenue' => $monthly]);
}

// ── POST: Create booking ──
if ($method === 'POST') {
    $userId = require_auth();
    $data = get_json_body();
    $db = getDB();

    $stmt = $db->prepare(
        "INSERT INTO bookings (user_id, package_id, package_title, travel_date, persons, total_amount, status, payment_status, payment_method, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'pending', 'pending', '', ?)"
    );
    $stmt->execute([
        $userId,
        $data['packageId'] ?? 0,
        $data['packageTitle'] ?? '',
        $data['travelDate'] ?? date('Y-m-d'),
        $data['persons'] ?? 1,
        $data['totalAmount'] ?? 0,
        date('Y-m-d'),
    ]);

    $bookingId = $db->lastInsertId();
    $stmt = $db->prepare("SELECT * FROM bookings WHERE id = ?");
    $stmt->execute([$bookingId]);
    json_response(booking_to_dict($stmt->fetch()), 201);
}

// ── PUT: Update status (admin) ──
if ($method === 'PUT' && $id && $action === 'status') {
    require_admin();
    $data = get_json_body();
    $status = $data['status'] ?? '';
    if (!$status) json_response(['message' => 'Status required'], 400);

    $db = getDB();
    $db->prepare("UPDATE bookings SET status = ? WHERE id = ?")->execute([$status, $id]);

    $stmt = $db->prepare("SELECT * FROM bookings WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) json_response(['message' => 'Booking not found'], 404);
    json_response(booking_to_dict($row));
}

// ── PUT: Confirm payment ──
if ($method === 'PUT' && $id && $action === 'pay') {
    require_auth();
    $data = get_json_body();
    $payMethod = $data['paymentMethod'] ?? 'card';

    $db = getDB();
    $db->prepare("UPDATE bookings SET status='confirmed', payment_status='paid', payment_method=? WHERE id=?")
       ->execute([$payMethod, $id]);

    $stmt = $db->prepare("SELECT * FROM bookings WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) json_response(['message' => 'Booking not found'], 404);
    json_response(booking_to_dict($row));
}

// ── PUT: Cancel booking ──
if ($method === 'PUT' && $id && $action === 'cancel') {
    require_auth();
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM bookings WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) json_response(['message' => 'Booking not found'], 404);

    $newPayment = ($row['payment_status'] === 'paid') ? 'refunded' : 'cancelled';
    $db->prepare("UPDATE bookings SET status='cancelled', payment_status=? WHERE id=?")
       ->execute([$newPayment, $id]);

    $stmt = $db->prepare("SELECT * FROM bookings WHERE id = ?");
    $stmt->execute([$id]);
    json_response(booking_to_dict($stmt->fetch()));
}

json_response(['message' => 'Invalid request'], 400);
?>
