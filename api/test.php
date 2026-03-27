<?php
header('Content-Type: application/json');
echo json_encode(['status' => 'API is working', 'method' => $_SERVER['REQUEST_METHOD']]);
?>
