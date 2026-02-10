CREATE DATABASE IF NOT EXISTS karir_db;
USE karir_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    photo VARCHAR(255) DEFAULT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    
    -- Personal Data
    nik VARCHAR(16) DEFAULT NULL,
    religion VARCHAR(50) DEFAULT NULL,
    height INT DEFAULT NULL COMMENT 'in cm',
    weight INT DEFAULT NULL COMMENT 'in kg',
    birth_place VARCHAR(100) DEFAULT NULL,
    birth_date DATE DEFAULT NULL,
    
    -- KTP Address
    ktp_address TEXT DEFAULT NULL,
    ktp_kelurahan VARCHAR(100) DEFAULT NULL,
    ktp_kecamatan VARCHAR(100) DEFAULT NULL,
    ktp_city VARCHAR(100) DEFAULT NULL,
    ktp_kabupaten VARCHAR(100) DEFAULT NULL,
    
    -- Domicile Address
    domicile_address TEXT DEFAULT NULL,
    domicile_kelurahan VARCHAR(100) DEFAULT NULL,
    domicile_kecamatan VARCHAR(100) DEFAULT NULL,
    domicile_city VARCHAR(100) DEFAULT NULL,
    domicile_kabupaten VARCHAR(100) DEFAULT NULL,
    
    -- Education
    last_education VARCHAR(50) DEFAULT NULL,
    major VARCHAR(100) DEFAULT NULL,
    gpa DECIMAL(3,2) DEFAULT NULL,
    skills TEXT DEFAULT NULL COMMENT 'Comma separated',

    -- Verification
    email_verified_at DATETIME DEFAULT NULL,
    email_otp VARCHAR(255) DEFAULT NULL,
    email_otp_expires_at DATETIME DEFAULT NULL,
    
    phone_verified_at DATETIME DEFAULT NULL,
    phone_otp VARCHAR(255) DEFAULT NULL,
    phone_otp_expires_at DATETIME DEFAULT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
