<?php
// router.php for PHP built-in server
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// Remove /travelvista/ prefix if it exists to mimic RewriteBase
$path = preg_replace('#^/travelvista#', '', $path);
$_SERVER['REQUEST_URI'] = $path . (isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] ? '?' . $_SERVER['QUERY_STRING'] : '');

// Serve static files
if ($path !== '/' && file_exists(__DIR__ . $path) && is_file(__DIR__ . $path)) {
    return false; 
}

// Mimic API routing
if (preg_match('#^/api/([a-z_]+)#', $path, $matches)) {
    $file = __DIR__ . '/api/' . $matches[1] . '.php';
    if (file_exists($file)) {
        require $file;
        return true;
    }
}

// SPA fallback
require __DIR__ . '/index.html';
