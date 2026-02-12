# Deployment Checklist

## 1. Prepare Files
- [ ] Build Frontend: `npm run build`
    - Verify `dist/` folder exists and contains `index.html` and `assets/`.
- [ ] Zip Backend: Select all files in `backend/` EXCEPT `.env`, `node_modules`, `.git`.
- [ ] Zip Frontend: Zip the contents of `dist/`.

## 2. Upload to Hostinger
- [ ] Open Hostinger File Manager.
- [ ] **Backend**:
    - Create a folder (e.g., `api` or `backend`) outside or inside `public_html` depending on your structure.
    - Upload and extract `backend.zip`.
    - Rename `.env.production.example` to `.env`.
    - **Edit `.env`**: Fill in your actual Database credentials and Email settings.
- [ ] **Frontend**:
    - Upload and extract `dist.zip` into `public_html` (or your subdomain folder).
    - Ensure `index.html` is in the root of that folder.

## 3. Database Setup
- [ ] Create a MySQL Database & User in Hostinger dashboard.
- [ ] Import `backend/karir_production.sql` or your latest schema into the database via phpMyAdmin.
- [ ] Update `.env` with the new DB credentials.

## 4. Final Checks
- [ ] Visit your website URL.
- [ ] Test Registration (Check if email arrives).
- [ ] Check Network tab in browser DevTools if API calls fail (Look for 404 or 500 errors).
- [ ] Ensure `APP_DEBUG=false` in `.env`.
