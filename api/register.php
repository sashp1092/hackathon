<?
require_once('/api/db.php');

// Получаем данные из тела запроса (JSON)
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Проверяем, что данные пришли
if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Данные не получены']);
    exit;
}

// Извлекаем поля
$full_name = trim($data['full_name'] ?? '');
$university = trim($data['university'] ?? '');
$email = trim($data['email'] ?? '');
$team_name = trim($data['team_name'] ?? '');

// Валидация
if (empty($full_name) || empty($university) || empty($email) || empty($team_name)) {
    echo json_encode(['success' => false, 'error' => 'Заполните все поля']);
    exit;
}

// Проверка email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Неверный формат email']);
    exit;
}

// Проверка уникальности email
$stmt = $pdo->prepare("SELECT id FROM participants WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'error' => 'Участник с таким email уже зарегистрирован']);
    exit;
}

// Сохраняем в БД
try {
    $stmt = $pdo->prepare("
INSERT INTO participants (full_name, university, email, team_name)
VALUES (?, ?, ?, ?)
");
    $stmt->execute([$full_name, $university, $email, $team_name]);

    echo json_encode([
        'success' => true,
        'message' => 'Участник успешно зарегистрирован',
        'id' => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Ошибка при сохранении: ' . $e->getMessage()]);
}

?>