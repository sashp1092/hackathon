<?php
$host = 'mysql';
$db = getenv('MYSQL_DATABASE') ?: 'hackaton';
$user = getenv('MYSQL_USER') ?: 'hackaton_user';
$pass = getenv('MYSQL_PASSWORD') ?: 'StrongPass123';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}
?>