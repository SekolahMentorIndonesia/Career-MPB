<?php

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\ResponseHelper;
use App\Middleware\AuthMiddleware;
use PDO;

class PsychotestController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // --- Admin: Question Bank Management ---

    public function getQuestions() {
        AuthMiddleware::isAdmin();
        
        $query = "SELECT * FROM psychotest_questions ORDER BY created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Decode JSON options for MC
        foreach ($questions as &$q) {
            if ($q['type'] === 'multiple_choice' && $q['options']) {
                $q['options'] = json_decode($q['options']);
            }
        }

        ResponseHelper::success("Questions fetched", $questions);
    }

    public function createQuestion() {
        AuthMiddleware::isAdmin();
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['type']) || empty($data['question'])) {
            ResponseHelper::error("Type and Question are required", 400);
        }

        if ($data['type'] === 'multiple_choice') {
            if (empty($data['options']) || !is_array($data['options']) || empty($data['answer_key'])) {
                ResponseHelper::error("Options (array) and Answer Key are required for Multiple Choice", 400);
            }
            $options = json_encode($data['options']);
            $answerKey = $data['answer_key'];
        } else {
            $options = null;
            $answerKey = null;
        }

        $query = "INSERT INTO psychotest_questions (type, question, options, answer_key) VALUES (:type, :question, :options, :answer_key)";
        $stmt = $this->db->prepare($query);
        
        if ($stmt->execute([
            ':type' => $data['type'],
            ':question' => $data['question'],
            ':options' => $options,
            ':answer_key' => $answerKey
        ])) {
            ResponseHelper::success("Question created successfully", null, 201);
        } else {
            ResponseHelper::error("Failed to create question", 500);
        }
    }

    public function deleteQuestion() {
        AuthMiddleware::isAdmin();
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['id'])) {
            ResponseHelper::error("Question ID is required", 400);
        }

        $query = "DELETE FROM psychotest_questions WHERE id = :id";
        $stmt = $this->db->prepare($query);

        if ($stmt->execute([':id' => $data['id']])) {
            ResponseHelper::success("Question deleted successfully");
        } else {
            ResponseHelper::error("Failed to delete question", 500);
        }
    }

    // --- Admin: Settings ---

    public function getSettings() {
        AuthMiddleware::isAdmin();

        $query = "SELECT setting_key, setting_value FROM psychotest_settings";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // Returns ['key' => 'value']

        ResponseHelper::success("Settings fetched", $settings);
    }

    public function updateSettings() {
        AuthMiddleware::isAdmin();
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['settings']) || !is_array($data['settings'])) {
            ResponseHelper::error("Settings object is required", 400);
        }

        try {
            $this->db->beginTransaction();
            
            $query = "INSERT INTO psychotest_settings (setting_key, setting_value) VALUES (:key, :val) ON DUPLICATE KEY UPDATE setting_value = :val";
            $stmt = $this->db->prepare($query);

            foreach ($data['settings'] as $key => $val) {
                $stmt->execute([':key' => $key, ':val' => $val]);
            }

            $this->db->commit();
            ResponseHelper::success("Settings updated successfully");
        } catch (Exception $e) {
            $this->db->rollBack();
            ResponseHelper::error("Failed to update settings: " . $e->getMessage(), 500);
        }
    }

    // --- User: Test Taking ---

    // Public endpoint (no AuthMiddleware::authenticate() because it uses link/token)
    // Actually, user is likely logged in, but the link contains a code. 
    // The requirement says "beda perlink untuk user". 
    // Code in AdminPsychotest generates link: /test-psikotes/{code}?app={id}
    // We should validate the app ID and code. 
    // NOTE: The current `psychotests` table has a `link` column which stores the full URL.
    // We need to match that.

    public function getTest() {
         // Logic: check query param `app_id`. 
         // Verify application exists and status is 'Tes Psikotes' or 'Psikotes'.
         // Fetch customized questions based on settings.
         
         $appId = $_GET['app_id'] ?? null;
         
         if (!$appId) {
             ResponseHelper::error("Application ID mismatch", 400);
         }

         // Verify Application & Psychotest Status
         // We check if this application exists and has valid status
         $query = "SELECT a.id, a.user_id, a.status, p.id as psychotest_id, p.score 
                   FROM applications a
                   LEFT JOIN psychotests p ON a.id = p.application_id
                   WHERE a.id = :id";
         $stmt = $this->db->prepare($query);
         $stmt->execute([':id' => $appId]);
         $app = $stmt->fetch(PDO::FETCH_ASSOC);

         if (!$app) {
             ResponseHelper::error("Invalid test link", 404);
         }
         
         // Fix status check to include both legacy and new
         if ($app['status'] !== 'Tes Psikotes' && $app['status'] !== 'Psikotes') {
             ResponseHelper::error("Test is not available for your current status", 403);
         }

         if ($app['score'] !== null) {
              ResponseHelper::error("You have already completed this test", 403);
         }

         // Fetch Settings
         $sQuery = "SELECT setting_key, setting_value FROM psychotest_settings";
         $sStmt = $this->db->query($sQuery);
         $settings = $sStmt->fetchAll(PDO::FETCH_KEY_PAIR);

         $questions = [];

         // Fetch MC Questions
         if (($settings['use_multiple_choice'] ?? '1') === '1') {
             $limit = (int)($settings['multiple_choice_count'] ?? 10);
             $mcQuery = "SELECT id, type, question, options FROM psychotest_questions WHERE type = 'multiple_choice' ORDER BY RAND() LIMIT $limit";
             $mcStmt = $this->db->query($mcQuery);
             $mcQuestions = $mcStmt->fetchAll(PDO::FETCH_ASSOC);
             foreach ($mcQuestions as &$q) {
                 $q['options'] = json_decode($q['options']);
             }
             $questions = array_merge($questions, $mcQuestions);
         }

         // Fetch Essay Questions
         if (($settings['use_essay'] ?? '1') === '1') {
             $limit = (int)($settings['essay_count'] ?? 2);
             $essayQuery = "SELECT id, type, question FROM psychotest_questions WHERE type = 'essay' ORDER BY RAND() LIMIT $limit";
             $essayStmt = $this->db->query($essayQuery);
             $essayQuestions = $essayStmt->fetchAll(PDO::FETCH_ASSOC);
             $questions = array_merge($questions, $essayQuestions);
         }

         ResponseHelper::success("Test data loaded", [
             'application_id' => $app['id'],
             'psychotest_id' => $app['psychotest_id'],
             'duration' => (int)($settings['test_duration_minutes'] ?? 60),
             'questions' => $questions
         ]);
    }

    public function getPreviewTest() {
        AuthMiddleware::isAdmin();

        // Fetch Settings
        $sQuery = "SELECT setting_key, setting_value FROM psychotest_settings";
        $sStmt = $this->db->query($sQuery);
        $settings = $sStmt->fetchAll(PDO::FETCH_KEY_PAIR);

        $questions = [];

        // Fetch MC Questions
        if (($settings['use_multiple_choice'] ?? '1') === '1') {
            $limit = (int)($settings['multiple_choice_count'] ?? 10);
            $mcQuery = "SELECT id, type, question, options FROM psychotest_questions WHERE type = 'multiple_choice' ORDER BY RAND() LIMIT $limit";
            $mcStmt = $this->db->query($mcQuery);
            $mcQuestions = $mcStmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($mcQuestions as &$q) {
                $q['options'] = json_decode($q['options']);
            }
            $questions = array_merge($questions, $mcQuestions);
        }

        // Fetch Essay Questions
        if (($settings['use_essay'] ?? '1') === '1') {
            $limit = (int)($settings['essay_count'] ?? 2);
            $essayQuery = "SELECT id, type, question FROM psychotest_questions WHERE type = 'essay' ORDER BY RAND() LIMIT $limit";
            $essayStmt = $this->db->query($essayQuery);
            $essayQuestions = $essayStmt->fetchAll(PDO::FETCH_ASSOC);
            $questions = array_merge($questions, $essayQuestions);
        }

        ResponseHelper::success("Preview test data loaded", [
            'application_id' => 'demo',
            'psychotest_id' => 'demo',
            'duration' => (int)($settings['test_duration_minutes'] ?? 60),
            'questions' => $questions
        ]);
    }

    public function submitTest() {
        $data = json_decode(file_get_contents("php://input"), true);

        $isDisqualified = ($data['status'] ?? '') === 'Disqualified';

        if (empty($data['psychotest_id']) || (empty($data['answers']) && !$isDisqualified)) {
            ResponseHelper::error("Invalid submission data", 400);
        }
        
        $psychotestId = $data['psychotest_id'];
        $answers = $data['answers']; // Array of { question_id, answer }

        try {
            $this->db->beginTransaction();

            $score = 0;
            $totalMC = 0;

            // Prepare statements
            $ansStmt = $this->db->prepare("INSERT INTO psychotest_answers (psychotest_id, question_id, answer, is_correct) VALUES (:pid, :qid, :ans, :isc)");
            
            // Get Answer Keys for MC
            $keyQuery = "SELECT id, answer_key, type FROM psychotest_questions WHERE id IN (" . implode(',', array_column($answers, 'question_id')) . ")"; 
            // array_column might be empty if no answers, handle that
            if (count($answers) > 0) {
                 $keyStmt = $this->db->query($keyQuery);
                 $keys = $keyStmt->fetchAll(PDO::FETCH_ASSOC);
                 $keyMap = [];
                 foreach ($keys as $k) {
                     $keyMap[$k['id']] = $k;
                 }
            }

            foreach ($answers as $ans) {
                $qid = $ans['question_id'];
                $userAns = $ans['answer'];
                $isCorrect = null;

                if (isset($keyMap[$qid]) && $keyMap[$qid]['type'] === 'multiple_choice') {
                    $totalMC++;
                    if ($keyMap[$qid]['answer_key'] === $userAns) {
                        $score++;
                        $isCorrect = true;
                    } else {
                        $isCorrect = false;
                    }
                }

                $ansStmt->execute([
                    ':pid' => $psychotestId,
                    ':qid' => $qid,
                    ':ans' => $userAns,
                    ':isc' => $isCorrect
                ]);
            }

            // Calculate formatted score (0-100) based on MC only for now, or just raw score?
            // User requested "grade manual", so maybe we just store the raw score of MC?
            // "Summary" in frontend showed Grade A/B/C. Let's calculate a simple percentage for MC.
            // Essay needs manual review (future feature).
            
            $finalScore = $isDisqualified ? 0 : (($totalMC > 0) ? round(($score / $totalMC) * 100) : 0);
            
            // Determine Grade
            $grade = $isDisqualified ? 'E (Diskualifikasi)' : 'E';
            if (!$isDisqualified) {
                if ($finalScore >= 85) $grade = 'A';
                else if ($finalScore >= 75) $grade = 'B';
                else if ($finalScore >= 60) $grade = 'C';
                else if ($finalScore >= 40) $grade = 'D';
            }

            // Update Psychotests Table
            $updQuery = "UPDATE psychotests SET score = :score, results = :grade WHERE id = :id";
            if ($isDisqualified) {
                // Also update application status maybe? 
                // Let's just keep grade as E for now.
            }
            $updStmt = $this->db->prepare($updQuery);
            $updStmt->execute([':score' => $finalScore, ':grade' => $grade, ':id' => $psychotestId]);

            // Update Application Status -> 'Interview' (if auto-pass) or stay 'Psikotes'?
            // Usually, we keep it in 'Psikotes' until Admin reviews, but "Results" column in table implies auto-grade.
            // Let's set status to 'Selesai' (not a valid enum) or just keep 'Psikotes' but with score.
            // AdminPsychotest.jsx badge check: "Selesai" isn't in Enum.
            // Let's just update score. Admin can manually move to Interview.

            $this->db->commit();
            ResponseHelper::success("Test submitted successfully", ['score' => $finalScore, 'grade' => $grade]);

        } catch (Exception $e) {
            $this->db->rollBack();
            ResponseHelper::error("Submission failed: " . $e->getMessage(), 500);
        }
    }

    public function getSummary() {
        AuthMiddleware::isAdmin();

        try {
            $total = $this->db->query("SELECT COUNT(*) FROM psychotests WHERE score IS NOT NULL")->fetchColumn();
            $avgScore = $this->db->query("SELECT AVG(score) FROM psychotests WHERE score IS NOT NULL")->fetchColumn();
            
            $resultsBreakdown = $this->db->query("SELECT results, COUNT(*) as count FROM psychotests WHERE score IS NOT NULL GROUP BY results")->fetchAll(PDO::FETCH_KEY_PAIR);

            ResponseHelper::success("Psychotest summary fetched", [
                'total_participants' => (int)$total,
                'average_score' => round((float)$avgScore, 2),
                'breakdown' => $resultsBreakdown
            ]);
        } catch (\Exception $e) {
            ResponseHelper::error("Failed to fetch summary: " . $e->getMessage(), 500);
        }
    }
}
