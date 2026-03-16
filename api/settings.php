<?php
/**
 * TravelVista — Settings API
 * GET  — Get all settings (public)
 * PUT  — Update settings (admin)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/../config/jwt_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

function get_all_settings() {
    $db = getDB();
    $rows = $db->query("SELECT * FROM settings")->fetchAll();
    $result = [];
    foreach ($rows as $r) {
        $key = $r['key'];
        $val = $r['value'];
        if (in_array($key, ['socialLinks', 'bannerImages'])) {
            $decoded = json_decode($val, true);
            if ($decoded !== null) $val = $decoded;
        }
        $result[$key] = $val;
    }
    return $result;
}

// ── GET: Get settings ──
if ($method === 'GET') {
    json_response(get_all_settings());
}

// ── PUT: Update settings ──
if ($method === 'PUT') {
    require_admin();
    $data = get_json_body();
    $db = getDB();

    foreach ($data as $key => $value) {
        if (is_array($value) || is_object($value)) {
            $value = json_encode($value);
        }
        $stmt = $db->prepare(
            "INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)"
        );
        $stmt->execute([$key, (string)$value]);
    }

    json_response(get_all_settings());
}

json_response(['message' => 'Invalid request'], 400);
?>
