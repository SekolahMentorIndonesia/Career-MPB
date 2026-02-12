# Google Login Setup Guide

## Overview
Google Login telah diimplementasikan sebagai metode autentikasi MVP. User dapat login/register menggunakan akun Google mereka tanpa perlu verifikasi email manual.

## Setup Google Cloud Console

### 1. Create Project
1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Create new project atau pilih existing project
3. Enable **Google+ API**

### 2. Create OAuth 2.0 Credentials
1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Configure:

**Authorized JavaScript origins:**
```
http://localhost:5173
https://recruitment.multipriority.com
```

**Authorized redirect URIs:**
```
http://localhost:5173
https://recruitment.multipriority.com
```

5. Copy the **Client ID** (format: `xxxxx.apps.googleusercontent.com`)

### 3. Configure Environment Variables

#### Backend (.env)
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

#### Frontend (.env)
```bash
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

#### Production (.env.production)
```bash
VITE_GOOGLE_CLIENT_ID=your-production-client-id.apps.googleusercontent.com
```

## How It Works

### Authentication Flow
1. User clicks "Sign in with Google" button
2. Google Identity Services popup appears
3. User selects Google account
4. Frontend receives `credential` (ID token)
5. Frontend sends credential to backend: `POST /api/auth/google`
6. **Backend verifies token** with Google's tokeninfo endpoint
7. Backend checks if user exists:
   - **Exists**: Login user
   - **New**: Auto-create account with verified email
8. Backend returns JWT token
9. User redirected to dashboard

### Security Features
- ✅ **Server-side token verification** (NEVER trust frontend)
- ✅ Email verification check from Google
- ✅ Token audience validation
- ✅ Token expiration check
- ✅ No storage of Google access tokens
- ✅ HTTPS required in production

## Database Schema

New columns added to `users` table:
```sql
provider VARCHAR(20) DEFAULT 'local'  -- 'local' or 'google'
google_id VARCHAR(255) DEFAULT NULL   -- Google user ID
password VARCHAR(255) DEFAULT NULL    -- NULL for Google users
email_verified_at DATETIME            -- Auto-set for Google users
```

## API Endpoint

### POST /api/auth/google

**Request:**
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@gmail.com",
      "role": "user",
      "photo": null
    }
  }
}
```

**Error Responses:**
- `400`: Missing credential
- `401`: Invalid Google token
- `403`: Email not verified by Google
- `500`: Server error

## Frontend Components

### GoogleLoginButton.jsx
Reusable component that:
- Initializes Google Identity Services
- Renders Google sign-in button
- Handles authentication flow
- Shows loading state
- Redirects based on user role

### Integration
```jsx
import GoogleLoginButton from '../../components/GoogleLoginButton';

// In your login/register form:
<GoogleLoginButton />
```

## Testing Checklist

### Local Testing
- [ ] Google button appears on login page
- [ ] Google button appears on register page
- [ ] Click button opens Google popup
- [ ] Select account completes login
- [ ] New user auto-creates account
- [ ] Existing user logs in successfully
- [ ] Email/password login still works
- [ ] User redirected to correct dashboard

### Production Testing
- [ ] Update authorized domains in Google Console
- [ ] Add production Client ID to .env files
- [ ] Test HTTPS requirement
- [ ] Verify CORS configuration
- [ ] Check error logging
- [ ] Monitor for security issues

## Troubleshooting

### "Invalid Google token" error
- Check GOOGLE_CLIENT_ID matches in backend .env
- Verify token audience in GoogleAuthController
- Check Google Cloud Console credentials

### Button doesn't appear
- Check Google Identity Services script loaded
- Verify VITE_GOOGLE_CLIENT_ID in frontend .env
- Check browser console for errors

### CORS errors
- Verify authorized origins in Google Console
- Check backend CORS middleware
- Ensure domains match exactly (http vs https)

### Production issues
- Ensure HTTPS is enabled (required by Google)
- Check authorized domains include production URL
- Verify environment variables deployed correctly

## Migration Script

Run once to update existing database:
```bash
php migrate_google_auth.php
```

This adds:
- `provider` column (default: 'local')
- `google_id` column
- Makes `password` nullable

## Notes

- Email/password authentication remains fully functional
- Google users have `password = NULL`
- Existing users can link Google account on first Google login
- Admin role is preserved for existing admin users
- No SMTP configuration needed for Google users
