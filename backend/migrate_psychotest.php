<?php
require_once __DIR__ . '/app/config/database.php';

use App\Config\Database;

try {
    $db = (new Database())->getConnection();
    
    // 1. psychotest_questions
    $sqlQuestions = "CREATE TABLE IF NOT EXISTS psychotest_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('multiple_choice', 'essay') NOT NULL,
        question TEXT NOT NULL,
        options JSON DEFAULT NULL, -- For MC only: JSON array of strings
        answer_key VARCHAR(255) DEFAULT NULL, -- For MC only: correct option string
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $db->exec($sqlQuestions);
    echo "Table 'psychotest_questions' created or verified.\n";

    // 2. psychotest_settings
    $sqlSettings = "CREATE TABLE IF NOT EXISTS psychotest_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(50) NOT NULL UNIQUE,
        setting_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $db->exec($sqlSettings);
    echo "Table 'psychotest_settings' created or verified.\n";

    // Seed default settings if not exist
    $defaultSettings = [
        'use_multiple_choice' => '1', // '1' or '0'
        'multiple_choice_count' => '10',
        'use_essay' => '1',
        'essay_count' => '2',
        'test_duration_minutes' => '60' // default 60 mins
    ];

    foreach ($defaultSettings as $key => $val) {
        $stmt = $db->prepare("INSERT IGNORE INTO psychotest_settings (setting_key, setting_value) VALUES (:key, :val)");
        $stmt->execute([':key' => $key, ':val' => $val]);
    }
    echo "Default settings seeded.\n";

    // 3. psychotest_answers
    $sqlAnswers = "CREATE TABLE IF NOT EXISTS psychotest_answers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        psychotest_id INT NOT NULL, -- Links to psychotests table (which links to application)
        question_id INT NOT NULL,
        answer TEXT NOT NULL,
        is_correct BOOLEAN DEFAULT NULL, -- For auto grading
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (question_id) REFERENCES psychotest_questions(id) ON DELETE CASCADE,
        FOREIGN KEY (psychotest_id) REFERENCES psychotests(id) ON DELETE CASCADE
    )";
    $db->exec($sqlAnswers);
    echo "Table 'psychotest_answers' created or verified.\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
