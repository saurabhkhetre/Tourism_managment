<?php
/**
 * TravelVista — JWT Helper (Pure PHP)
 * HMAC-SHA256 JWT implementation with no external libraries.
 */

require_once __DIR__ . '/database.php';

/**
 * Base64 URL-safe encode.
 */
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * Base64 URL-safe decode.
 */
function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

/**
 * Encode a JWT token.
 */
function jwt_encode($payload) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRY;
    $payload = json_encode($payload);

    $base64Header = base64url_encode($header);
    $base64Payload = base64url_encode($payload);

    $signature = hash_hmac('sha256', "$base64Header.$base64Payload", JWT_SECRET, true);
    $base64Signature = base64url_encode($signature);

    return "$base64Header.$base64Payload.$base64Signature";
}

/**
 * Decode and verify a JWT token. Returns payload array or null on failure.
 */
function jwt_decode($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    list($base64Header, $base64Payload, $base64Signature) = $parts;

    $signature = hash_hmac('sha256', "$base64Header.$base64Payload", JWT_SECRET, true);
    $expectedSignature = base64url_encode($signature);

    if (!hash_equals($expectedSignature, $base64Signature)) return null;

    $payload = json_decode(base64url_decode($base64Payload), true);
    if (!$payload) return null;

    // Check expiry
    if (isset($payload['exp']) && $payload['exp'] < time()) return null;

    return $payload;
}

/**
 * Get the Bearer token from the Authorization header.
 */
function get_bearer_token() {
    $headers = '';
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $headers = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('apache_request_headers')) {
        $reqHeaders = apache_request_headers();
        if (isset($reqHeaders['Authorization'])) {
            $headers = $reqHeaders['Authorization'];
        }
    }
    if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
        return $matches[1];
    }
    return null;
}

/**
 * Get the authenticated user ID from JWT. Returns user_id or null.
 */
function get_auth_user_id() {
    $token = get_bearer_token();
    if (!$token) return null;
    $payload = jwt_decode($token);
    if (!$payload || !isset($payload['sub'])) return null;
    return $payload['sub'];
}

/**
 * Require authentication. Sends 401 and exits if not authenticated.
 * Returns the user_id.
 */
function require_auth() {
    $userId = get_auth_user_id();
    if (!$userId) {
        http_response_code(401);
        echo json_encode(['message' => 'Authorization required', 'error' => 'authorization_required']);
        exit;
    }
    return $userId;
}

/**
 * Check if user is admin.
 */
function is_admin($userId) {
    $db = getDB();
    $stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    return $user && $user['role'] === 'admin';
}

/**
 * Require admin role. Sends 403 and exits if not admin.
 * Returns the user_id.
 */
function require_admin() {
    $userId = require_auth();
    if (!is_admin($userId)) {
        http_response_code(403);
        echo json_encode(['message' => 'Forbidden']);
        exit;
    }
    return $userId;
}

/**
 * Get JSON request body as associative array.
 */
function get_json_body() {
    $body = file_get_contents('php://input');
    return json_decode($body, true) ?: [];
}

/**
 * Send JSON response with optional status code.
 */
function json_response($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

/**
 * Convert a package DB row to frontend-expected shape (camelCase).
 */
function package_to_dict($row) {
    $jsonFields = ['gallery', 'highlights', 'itinerary', 'inclusions', 'exclusions'];
    foreach ($jsonFields as $field) {
        if (isset($row[$field]) && is_string($row[$field])) {
            $decoded = json_decode($row[$field], true);
            $row[$field] = is_array($decoded) ? $decoded : [];
        }
    }
    return [
        'id'            => (int)$row['id'],
        'title'         => $row['title'],
        'location'      => $row['location'],
        'duration'      => $row['duration'],
        'price'         => (float)$row['price'],
        'originalPrice' => (float)($row['original_price'] ?? 0),
        'maxPersons'    => (int)($row['max_persons'] ?? 20),
        'rating'        => (float)($row['rating'] ?? 0),
        'reviewCount'   => (int)($row['review_count'] ?? 0),
        'image'         => $row['image'] ?? '',
        'gallery'       => $row['gallery'] ?? [],
        'category'      => $row['category'] ?? '',
        'description'   => $row['description'] ?? '',
        'highlights'    => $row['highlights'] ?? [],
        'itinerary'     => $row['itinerary'] ?? [],
        'inclusions'    => $row['inclusions'] ?? [],
        'exclusions'    => $row['exclusions'] ?? [],
        'active'        => (bool)($row['active'] ?? 1),
        'featured'      => (bool)($row['featured'] ?? 0),
        'createdAt'     => $row['created_at'] ?? '',
    ];
}

/**
 * Convert a user DB row to frontend-expected shape (no password).
 */
function user_to_dict($row) {
    return [
        'id'       => (int)$row['id'],
        'name'     => $row['name'],
        'email'    => $row['email'],
        'phone'    => $row['phone'] ?? '',
        'role'     => $row['role'] ?? 'user',
        'avatar'   => $row['avatar'] ?? '',
        'joinedAt' => $row['joined_at'] ?? '',
        'active'   => (bool)($row['active'] ?? 1),
    ];
}

/**
 * Convert a booking DB row to frontend-expected shape.
 */
function booking_to_dict($row) {
    return [
        'id'            => (int)$row['id'],
        'userId'        => (int)$row['user_id'],
        'userName'      => $row['user_name'] ?? '',
        'packageId'     => (int)$row['package_id'],
        'packageTitle'  => $row['package_title'] ?? '',
        'travelDate'    => $row['travel_date'] ?? '',
        'persons'       => (int)($row['persons'] ?? 1),
        'totalAmount'   => (float)($row['total_amount'] ?? 0),
        'status'        => $row['status'] ?? 'pending',
        'paymentStatus' => $row['payment_status'] ?? 'pending',
        'paymentMethod' => $row['payment_method'] ?? '',
        'createdAt'     => $row['created_at'] ?? '',
    ];
}

/**
 * Convert a review DB row to frontend-expected shape.
 */
function review_to_dict($row) {
    return [
        'id'           => (int)$row['id'],
        'userId'       => (int)$row['user_id'],
        'userName'     => $row['user_name'] ?? '',
        'userAvatar'   => $row['user_avatar'] ?? '',
        'packageId'    => (int)$row['package_id'],
        'packageTitle' => $row['package_title'] ?? '',
        'rating'       => (int)($row['rating'] ?? 5),
        'comment'      => $row['comment'] ?? '',
        'createdAt'    => $row['created_at'] ?? '',
    ];
}

/**
 * Convert an enquiry DB row to frontend-expected shape.
 */
function enquiry_to_dict($row) {
    return [
        'id'        => (int)$row['id'],
        'name'      => $row['name'],
        'email'     => $row['email'],
        'subject'   => $row['subject'] ?? '',
        'message'   => $row['message'] ?? '',
        'status'    => $row['status'] ?? 'open',
        'reply'     => $row['reply'] ?? '',
        'createdAt' => $row['created_at'] ?? '',
    ];
}

/**
 * Convert a hotel DB row to frontend-expected shape.
 */
function hotel_to_dict($row) {
    return [
        'id'            => (int)$row['id'],
        'name'          => $row['name'],
        'location'      => $row['location'] ?? '',
        'rating'        => (float)($row['rating'] ?? 0),
        'pricePerNight' => (float)($row['price_per_night'] ?? 0),
        'capacity'      => (int)($row['capacity'] ?? 0),
        'type'          => $row['type'] ?? 'Hotel',
        'image'         => $row['image'] ?? '',
    ];
}

/**
 * Convert a transport DB row to frontend-expected shape.
 */
function transport_to_dict($row) {
    return [
        'id'          => (int)$row['id'],
        'name'        => $row['name'],
        'type'        => $row['type'] ?? 'Car',
        'capacity'    => (int)($row['capacity'] ?? 0),
        'pricePerDay' => (float)($row['price_per_day'] ?? 0),
        'image'       => $row['image'] ?? '',
    ];
}
?>
