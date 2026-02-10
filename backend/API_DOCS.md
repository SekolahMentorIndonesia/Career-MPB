# Karir Backend API Documentation

Base URL: `http://localhost/backend/public`

## Authentication

### 1. Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "Dzarel",
    "email": "email@example.com",
    "password": "password123"
  }
  ```
- **Notes**: Returns a 6-digit OTP for email verification.

### 2. Verify Email
- **URL**: `/api/auth/verify-email`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "email@example.com",
    "otp": "123456"
  }
  ```

### 3. Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "email@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns a JWT token.

---

## User Profile (Require Authorization Header)
*Header: `Authorization: Bearer <token>`*

### 1. Get Profile
- **URL**: `/api/user/profile`
- **Method**: `GET`

### 2. Update Profile
- **URL**: `/api/user/profile`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "nik": "1234567890123456",
    "religion": "Islam",
    "height": 175,
    "weight": 70,
    "ktp_city": "Jakarta",
    "last_education": "S1",
    "skills": "PHP, React, MySQL"
  }
  ```

### 3. Upload Photo
- **URL**: `/api/user/upload-photo`
- **Method**: `POST`
- **Body**: `multipart/form-data` with field `photo`.

### 4. Request Phone OTP
- **URL**: `/api/user/request-phone-otp`
- **Method**: `POST`
- **Request Body**: `{"phone": "+6281234567890"}`

### 5. Verify Phone
- **URL**: `/api/user/verify-phone`
- **Method**: `POST`
- **Request Body**: `{"otp": "123456"}`

---

## Admin (Require Admin Token)

### 1. Get All Users
- **URL**: `/api/admin/users`
- **Method**: `GET`

### 2. Export Users (Excel/CSV)
- **URL**: `/api/admin/export-users`
- **Method**: `GET`
- **Note**: Triggers a browser download of `users_export_*.csv`.
