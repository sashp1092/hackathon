-- ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ ДЛЯ ХАКАТОНА

-- Создаём базу данных (если не существует)
CREATE DATABASE IF NOT EXISTS hackaton;
USE hackaton;

-- 1. ТАБЛИЦА УЧАСТНИКОВ
CREATE TABLE IF NOT EXISTS participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL COMMENT 'ФИО участника',
    university VARCHAR(255) NOT NULL COMMENT 'Вуз',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email (уникальный)',
    team_name VARCHAR(255) NOT NULL COMMENT 'Название команды',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата регистрации'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. ТАБЛИЦА АДМИНИСТРАТОРОВ
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Логин администратора',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Хеш пароля',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. ТЕСТОВЫЙ АДМИНИСТРАТОР
-- Пароль: admin123
-- Хеш получен через password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO admins (username, password_hash) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE username = username;

INSERT INTO participants (full_name, university, email, team_name) VALUES 
    ('Иванов Иван Иванович', 'МГУ им. Ломоносова', 'ivanov@example.com', 'Кодеры'),
    ('Петрова Екатерина Сергеевна', 'СПбГУ', 'petrova@example.com', 'Кодеры'),
    ('Сидоров Алексей Владимирович', 'МФТИ', 'sidorov@example.com', 'Хакеры'),
    ('Козлова Анна Дмитриевна', 'ВШЭ', 'kozlova@example.com', 'Хакеры'),
    ('Смирнов Денис Андреевич', 'ИТМО', 'smirnov@example.com', 'Дебаггеры')
ON DUPLICATE KEY UPDATE email = email;
