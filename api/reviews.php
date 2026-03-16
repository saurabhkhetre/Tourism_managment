<?php
/**
 * TravelVista — Reviews API
 * GET    ?action=recent        — Latest reviews (public)
 * GET                          — All reviews (admin)
 * GET    ?action=package&id=X  — Reviews for a package (public)
 * POST                         — Add review
 * DELETE ?id=X                 — Delete review (admin)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/../config/jwt_helper.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id = $_GET['id'] ?? '';
if (!$action && !$id) {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (preg_match('#/api/reviews/recent#', $uri)) { $action = 'recent'; }
    elseif (preg_match('#/api/reviews/package/(\d+)#', $uri, $m)) { $action = 'package'; $id = $m[1]; }
    elseif (preg_match('#/api/reviews/(\d+)#', $uri, $m)) { $id = $m[1]; }
}

// ── GET: Recent reviews (public) ──
if ($method === 'GET' && $action === 'recent') {
    $db = getDB();
    $rows = $db->query("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 10")->fetchAll();
    json_response(array_map('review_to_dict', $rows));
}

// ── GET: Package reviews (public) ──
if ($method === 'GET' && $action === 'package' && $id) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM reviews WHERE package_id = ? ORDER BY created_at DESC");
    $stmt->execute([$id]);
    $rows = $stmt->fetchAll();
    $reviews = array_map('review_to_dict', $rows);

    $avg = 0;
    if (count($reviews) > 0) {
        $sum = array_sum(array_column($reviews, 'rating'));
        $avg = round($sum / count($reviews), 1);
    }

    json_response(['reviews' => $reviews, 'averageRating' => $avg]);
}

// ── GET: All reviews (admin) ──
if ($method === 'GET' && !$action && !$id) {
    require_admin();
    $db = getDB();
    $rows = $db->query("SELECT * FROM reviews ORDER BY created_at DESC")->fetchAll();
    json_response(array_map('review_to_dict', $rows));
}

// ── POST: Add review ──
if ($method === 'POST') {
    $userId = require_auth();
    $data = get_json_body();
    $db = getDB();

    $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    if (!$user) json_response(['message' => 'User not found'], 404);

    $stmt = $db->prepare(
        "INSERT INTO reviews (user_id, user_name, user_avatar, package_id, package_title, rating, comment, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $userId,
        $user['name'],
        $user['avatar'],
        $data['packageId'] ?? 0,
        $data['packageTitle'] ?? '',
        $data['rating'] ?? 5,
        $data['comment'] ?? '',
        date('Y-m-d'),
    ]);

    $revId = $db->lastInsertId();

    // Update package review count and average rating
    $pkgId = $data['packageId'] ?? 0;
    if ($pkgId) {
        $stmt = $db->prepare("SELECT rating FROM reviews WHERE package_id = ?");
        $stmt->execute([$pkgId]);
        $allReviews = $stmt->fetchAll();
        $count = count($allReviews);
        $avg = $count > 0 ? round(array_sum(array_column($allReviews, 'rating')) / $count, 1) : 0;
        $db->prepare("UPDATE packages SET review_count = ?, rating = ? WHERE id = ?")->execute([$count, $avg, $pkgId]);
    }

    $stmt = $db->prepare("SELECT * FROM reviews WHERE id = ?");
    $stmt->execute([$revId]);
    json_response(review_to_dict($stmt->fetch()), 201);
}

// ── DELETE: Delete review (admin) ──
if ($method === 'DELETE' && $id) {
    require_admin();
    $db = getDB();

    $stmt = $db->prepare("SELECT * FROM reviews WHERE id = ?");
    $stmt->execute([$id]);
    $review = $stmt->fetch();

    if ($review) {
        $db->prepare("DELETE FROM reviews WHERE id = ?")->execute([$id]);
        $pkgId = $review['package_id'];
        $stmt = $db->prepare("SELECT rating FROM reviews WHERE package_id = ?");
        $stmt->execute([$pkgId]);
        $allReviews = $stmt->fetchAll();
        $count = count($allReviews);
        $avg = $count > 0 ? round(array_sum(array_column($allReviews, 'rating')) / $count, 1) : 0;
        $db->prepare("UPDATE packages SET review_count = ?, rating = ? WHERE id = ?")->execute([$count, $avg, $pkgId]);
    }

    json_response(['success' => true]);
}

json_response(['message' => 'Invalid request'], 400);
?>
