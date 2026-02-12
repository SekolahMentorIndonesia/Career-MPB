# Google Login Production Deployment Checklist

## ✅ Pre-Deployment (Sudah Selesai)

### Database Migration
- [x] Tabel `users` sudah memiliki kolom:
  - `provider` VARCHAR(20) DEFAULT 'local'
  - `google_id` VARCHAR(255) NULL
  - `password` VARCHAR(255) NULL (nullable)
  - `email_verified_at` DATETIME NULL

### Backend Implementation
- [x] `GoogleAuthController.php` sudah dibuat
- [x] Route `/api/auth/google` sudah ditambahkan
- [x] Server-side token verification implemented
- [x] Auto-registration untuk user baru
- [x] JWT token generation

### Frontend Implementation
- [x] Google Identity Services script di `index.html`
- [x] `GoogleLoginButton.jsx` component
- [x] Integrasi di `Login.jsx` dan `Register.jsx`

### Environment Configuration
- [x] Backend `.env` - GOOGLE_CLIENT_ID configured
- [x] Backend `.env.production.example` - GOOGLE_CLIENT_ID configured
- [x] Frontend `.env` - VITE_GOOGLE_CLIENT_ID configured
- [x] Frontend `.env.production` - VITE_GOOGLE_CLIENT_ID configured

**Google Client ID:**
```
759262548822-vqokcr588k172e25gclvdr5j131uoeeo.apps.googleusercontent.com
```

---

## 🚀 Production Deployment Steps

### 1. Google Cloud Console Setup

#### A. Verify OAuth Consent Screen
1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Pilih project Anda
3. Navigate to **APIs & Services** > **OAuth consent screen**
4. Pastikan status: **Published** atau **In Production**
5. Verify authorized domains include: `multipriority.com`

#### B. Configure OAuth 2.0 Client
1. Navigate to **APIs & Services** > **Credentials**
2. Klik Client ID: `759262548822-vqokcr588k172e25gclvdr5j131uoeeo`
3. **Authorized JavaScript origins:**
   ```
   https://recruitment.multipriority.com
   http://localhost:5173
   ```
4. **Authorized redirect URIs:**
   ```
   https://recruitment.multipriority.com
   http://localhost:5173
   ```
5. **Save** perubahan

### 2. Database Migration (Production)

SSH ke server Hostinger dan jalankan migration script:

```bash
# Upload migrate_google_auth.php ke root directory
# Lalu jalankan:
php migrate_google_auth.php
```

**Expected Output:**
```
✓ Added 'provider' column
✓ Added 'google_id' column
✓ Modified 'password' column to allow NULL
Migration completed successfully!
```

### 3. Backend Deployment

#### A. Upload Files
Upload file-file berikut ke server:
- `backend/app/controllers/GoogleAuthController.php`
- `backend/app/routes.php` (updated)
- `backend/.env` (dengan GOOGLE_CLIENT_ID yang benar)

#### B. Verify .env Configuration
Pastikan file `backend/.env` di production memiliki:
```bash
APP_ENV=production
APP_DEBUG=false
GOOGLE_CLIENT_ID=759262548822-vqokcr588k172e25gclvdr5j131uoeeo.apps.googleusercontent.com
```

#### C. Test Backend Endpoint
```bash
curl -X POST https://recruitment.multipriority.com/backend/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"credential":"test_invalid_token"}'
```

**Expected Response:**
```json
{"status":"error","success":false,"message":"Invalid Google token"}
```

### 4. Frontend Deployment

#### A. Build Production
```bash
npm run build
```

Ini akan generate folder `dist/` dengan environment variables dari `.env.production`

#### B. Verify Build
Check bahwa `dist/index.html` contains:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

#### C. Upload to Hostinger
Upload semua file dari folder `dist/` ke public_html di Hostinger:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ...
```

### 5. SSL/HTTPS Verification

Google OAuth **REQUIRES** HTTPS in production.

1. Verify SSL certificate active: https://recruitment.multipriority.com
2. Check for mixed content warnings
3. Ensure all API calls use HTTPS

---

## 🧪 Testing Checklist

### Local Testing (Development)
- [ ] Buka http://localhost:5173/login
- [ ] Klik "Sign in with Google"
- [ ] Google popup muncul
- [ ] Pilih akun Google
- [ ] Redirect ke dashboard
- [ ] Check database: user baru dengan `provider='google'`
- [ ] Check `email_verified_at` terisi
- [ ] Logout dan login lagi dengan Google → sukses

### Production Testing
- [ ] Buka https://recruitment.multipriority.com/login
- [ ] Klik "Sign in with Google"
- [ ] Google popup muncul (no errors)
- [ ] Pilih akun Google
- [ ] **New User:**
  - [ ] Auto-register berhasil
  - [ ] Email verified otomatis
  - [ ] Redirect ke dashboard user
  - [ ] Check database: `provider='google'`, `email_verified_at` filled
- [ ] **Existing User:**
  - [ ] Login berhasil
  - [ ] Redirect ke dashboard (admin/user sesuai role)
- [ ] **Email/Password Login:**
  - [ ] Masih berfungsi normal
  - [ ] Tidak ada breaking changes

### Security Testing
- [ ] Coba kirim fake token → expect 401 error
- [ ] Verify `APP_DEBUG=false` di production
- [ ] Check tidak ada error logs exposed
- [ ] Verify CORS headers correct
- [ ] Test dengan incognito/private browsing

---

## 🔧 Troubleshooting

### Error: "popup_closed_by_user"
**Cause:** User menutup popup Google sebelum login
**Solution:** Normal behavior, tidak perlu action

### Error: "Invalid Google token"
**Possible Causes:**
1. Client ID tidak match
   - **Fix:** Verify `GOOGLE_CLIENT_ID` di `.env` sama dengan Google Console
2. Token expired
   - **Fix:** Normal, user perlu login ulang
3. Authorized domains tidak configured
   - **Fix:** Add domain di Google Console

### Error: "redirect_uri_mismatch"
**Cause:** Domain tidak ada di authorized redirect URIs
**Fix:** 
1. Buka Google Cloud Console
2. Add `https://recruitment.multipriority.com` ke authorized redirect URIs
3. Save dan tunggu 5 menit

### Google Button Tidak Muncul
**Possible Causes:**
1. Script tidak loaded
   - **Fix:** Check `index.html` contains Google script
2. Client ID salah
   - **Fix:** Verify `VITE_GOOGLE_CLIENT_ID` di `.env.production`
3. Browser console errors
   - **Fix:** Check console untuk error messages

### User Tidak Auto-Register
**Check:**
1. Database migration sudah running?
2. `GoogleAuthController.php` sudah uploaded?
3. Route `/api/auth/google` accessible?
4. Check backend error logs

---

## 📝 Production Environment Variables

### Backend (`backend/.env`)
```bash
APP_ENV=production
APP_DEBUG=false

DB_HOST=localhost
DB_NAME=u245141553_karir
DB_USER=u245141553_admin
DB_PASS=MPBmultipr10r1ty#

GOOGLE_CLIENT_ID=759262548822-vqokcr588k172e25gclvdr5j131uoeeo.apps.googleusercontent.com

MAIL_DRIVER=mail
SMTP_FROM=recruitment@multipriority.com
SMTP_NAME="MPB Karir"

APP_TIMEZONE=Asia/Jakarta
```

### Frontend (`.env.production`)
```bash
VITE_API_BASE_URL=https://recruitment.multipriority.com/backend
VITE_GOOGLE_CLIENT_ID=759262548822-vqokcr588k172e25gclvdr5j131uoeeo.apps.googleusercontent.com
```

---

## 🎯 Success Criteria

✅ **Google Login berfungsi di production**
✅ **User baru auto-register dengan email verified**
✅ **User lama bisa login**
✅ **Email/password login masih berfungsi**
✅ **Admin role preserved**
✅ **No breaking changes**
✅ **HTTPS enforced**
✅ **No security vulnerabilities**

---

## 📞 Support

Jika ada masalah:
1. Check browser console untuk errors
2. Check backend error logs
3. Verify Google Cloud Console configuration
4. Review `GOOGLE_LOGIN_SETUP.md` untuk troubleshooting detail

## 🔗 Related Documentation
- [GOOGLE_LOGIN_SETUP.md](file:///Users/dzarel/Documents/Website_PKL/MPB/karir/GOOGLE_LOGIN_SETUP.md) - Setup guide lengkap
- [walkthrough.md](file:///Users/dzarel/.gemini/antigravity/brain/20c45a38-5607-44a5-8dde-56fec35177da/walkthrough.md) - Implementation walkthrough
