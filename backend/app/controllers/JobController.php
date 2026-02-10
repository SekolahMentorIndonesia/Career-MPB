<?php

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\ResponseHelper;
use App\Middleware\AuthMiddleware;
use PDO;

class JobController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function index() {
        $query = "SELECT * FROM jobs ORDER BY created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();

        $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        ResponseHelper::success("Jobs fetched successfully", $jobs);
    }

    public function create() {
        try {
            AuthMiddleware::isAdmin();

            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data) {
                ResponseHelper::error("Invalid request body", 400);
            }

            $requiredFields = ['title', 'company', 'type', 'target_audience', 'location', 'description'];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    ResponseHelper::error("Missing required field: $field", 400);
                }
            }

            $query = "INSERT INTO jobs (
                title, company, type, target_audience, location, description,
                registration_start_date, registration_end_date,
                psytest_start_date, psytest_end_date,
                interview_start_date, interview_end_date,
                announcement_date
            ) VALUES (
                :title, :company, :type, :target_audience, :location, :description,
                :reg_start, :reg_end,
                :psy_start, :psy_end,
                :int_start, :int_end,
                :announce
            )";

            $stmt = $this->db->prepare($query);

            $params = [
                ":title" => $data['title'],
                ":company" => $data['company'],
                ":type" => $data['type'],
                ":target_audience" => $data['target_audience'],
                ":location" => $data['location'],
                ":description" => $data['description'],
                ":reg_start" => !empty($data['registration_start_date']) ? $data['registration_start_date'] : null,
                ":reg_end" => !empty($data['registration_end_date']) ? $data['registration_end_date'] : null,
                ":psy_start" => !empty($data['psytest_start_date']) ? $data['psytest_start_date'] : null,
                ":psy_end" => !empty($data['psytest_end_date']) ? $data['psytest_end_date'] : null,
                ":int_start" => !empty($data['interview_start_date']) ? $data['interview_start_date'] : null,
                ":int_end" => !empty($data['interview_end_date']) ? $data['interview_end_date'] : null,
                ":announce" => !empty($data['announcement_date']) ? $data['announcement_date'] : null
            ];

            if ($stmt->execute($params)) {
                $data['id'] = $this->db->lastInsertId();
                ResponseHelper::success("Job created successfully", $data, 201);
            } else {
                ResponseHelper::error("Failed to create job", 500);
            }
        } catch (\Exception $e) {
            error_log("Create Job Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        try {
            AuthMiddleware::isAdmin();

            $data = json_decode(file_get_contents("php://input"), true);
            if (!$data) {
                ResponseHelper::error("Invalid request body", 400);
            }

            $query = "UPDATE jobs SET 
                title = :title, 
                company = :company, 
                type = :type, 
                target_audience = :target_audience, 
                location = :location, 
                description = :description,
                registration_start_date = :reg_start, 
                registration_end_date = :reg_end,
                psytest_start_date = :psy_start, 
                psytest_end_date = :psy_end,
                interview_start_date = :int_start, 
                interview_end_date = :int_end,
                announcement_date = :announce,
                updated_at = CURRENT_TIMESTAMP
                WHERE id = :id";

            $stmt = $this->db->prepare($query);

            $params = [
                ":title" => $data['title'],
                ":company" => $data['company'],
                ":type" => $data['type'],
                ":target_audience" => $data['target_audience'],
                ":location" => $data['location'],
                ":description" => $data['description'],
                ":reg_start" => !empty($data['registration_start_date']) ? $data['registration_start_date'] : null,
                ":reg_end" => !empty($data['registration_end_date']) ? $data['registration_end_date'] : null,
                ":psy_start" => !empty($data['psytest_start_date']) ? $data['psytest_start_date'] : null,
                ":psy_end" => !empty($data['psytest_end_date']) ? $data['psytest_end_date'] : null,
                ":int_start" => !empty($data['interview_start_date']) ? $data['interview_start_date'] : null,
                ":int_end" => !empty($data['interview_end_date']) ? $data['interview_end_date'] : null,
                ":announce" => !empty($data['announcement_date']) ? $data['announcement_date'] : null,
                ":id" => $id
            ];

            if ($stmt->execute($params)) {
                ResponseHelper::success("Job updated successfully", $data);
            } else {
                ResponseHelper::error("Failed to update job", 500);
            }
        } catch (\Exception $e) {
            error_log("Update Job Error: " . $e->getMessage());
            ResponseHelper::error("Server Error: " . $e->getMessage(), 500);
        }
    }

    public function delete($id) {
        AuthMiddleware::isAdmin();

        $query = "DELETE FROM jobs WHERE id = :id";
        $stmt = $this->db->prepare($query);
        
        if ($stmt->execute([':id' => $id])) {
            ResponseHelper::success("Job deleted successfully");
        } else {
            ResponseHelper::error("Failed to delete job", 500);
        }
    }

    public function show($id) {
        $query = "SELECT * FROM jobs WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->execute([':id' => $id]);

        $job = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($job) {
            ResponseHelper::success("Job fetched successfully", $job);
        } else {
            ResponseHelper::error("Job not found", 404);
        }
    }
}
