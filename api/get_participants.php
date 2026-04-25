<?
$stmt = $pdo->query("SELECT id, full_name, university, email, team_name, created_at FROM participants ORDER BY id DESC");
$participants = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'data' => $participants,
    'count' => count($participants)
]);
?>