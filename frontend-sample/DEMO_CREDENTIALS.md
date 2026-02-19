# Demo Login Credentials

## Mock Authentication Mode

The frontend is currently configured to use **mock authentication** for development without requiring a backend server.

### Configuration

In `.env` file:
```bash
VITE_USE_MOCK_AUTH=true
```

When set to `true`, the app uses hardcoded credentials. When set to `false`, it connects to the real backend API.

---

## Available Demo Accounts

### 1. Admin Account
- **Email:** `admin@school.com`
- **Password:** `admin123`
- **Role:** Admin
- **Access:** Full system access, user management, classes, gallery

### 2. Teacher Account
- **Email:** `teacher@school.com`
- **Password:** `teacher123`
- **Role:** Teacher
- **Access:** Attendance marking, marks entry, class diary

### 3. Student Account
- **Email:** `student@school.com`
- **Password:** `student123`
- **Role:** Student
- **Access:** Syllabus, progress reports, AI tutor

### 4. Parent Account
- **Email:** `parent@school.com`
- **Password:** `parent123`
- **Role:** Parent
- **Access:** Child's attendance, progress, fee payments

### 5. Accountant Account
- **Email:** `accountant@school.com`
- **Password:** `accountant123`
- **Role:** Accountant
- **Access:** Invoice management, payment tracking

### 6. Admissions Staff Account
- **Email:** `admissions@school.com`
- **Password:** `admissions123`
- **Role:** Admissions Staff
- **Access:** Application management, review process

---

## Quick Login Buttons

The login page includes **Quick Login** buttons for easy testing:
- Click any role button to auto-fill credentials
- Then click "Sign In" to login

---

## How It Works

### Mock Authentication Flow:

1. **Login:** Credentials are validated against hardcoded users in `AuthContext.tsx`
2. **Token:** A mock JWT token is generated and stored in localStorage
3. **User Data:** User info is stored in localStorage and Zustand store
4. **Navigation:** User is redirected based on their role
5. **Logout:** Clears localStorage and Zustand store

### Real API Authentication Flow:

1. Set `VITE_USE_MOCK_AUTH=false` in `.env`
2. Ensure backend API is running on `http://localhost:8000`
3. Login calls `/api/auth/login` endpoint
4. Real JWT tokens are returned and stored
5. Protected routes validate tokens with backend

---

## Testing Different Roles

### To test Admin features:
```
Email: admin@school.com
Password: admin123
```
Navigate to: `/admin`, `/admin/users`, `/admin/classes`, `/admin/gallery`

### To test Teacher features:
```
Email: teacher@school.com
Password: teacher123
```
Navigate to: `/teacher`, `/teacher/attendance`, `/teacher/marks`, `/teacher/diary`

### To test Student features:
```
Email: student@school.com
Password: student123
```
Navigate to: `/student`, `/student/syllabus`, `/student/progress`, `/student/ai-tutor`

### To test Parent features:
```
Email: parent@school.com
Password: parent123
```
Navigate to: `/parent`, `/parent/attendance`, `/parent/progress`, `/parent/payments`

### To test Accountant features:
```
Email: accountant@school.com
Password: accountant123
```
Navigate to: `/accountant`, `/accountant/invoices`, `/accountant/payments`

### To test Admissions features:
```
Email: admissions@school.com
Password: admissions123
```
Navigate to: `/admissions`, `/admissions/applications/:id`

---

## Role-Based Access Control (RBAC)

Each role has access only to their designated routes:
- Attempting to access unauthorized routes will redirect to login
- Sidebar navigation shows only relevant menu items for each role
- API calls (when backend is connected) validate permissions server-side

---

## Switching Between Mock and Real API

### Development (No Backend):
```bash
# .env
VITE_USE_MOCK_AUTH=true
```

### Production (With Backend):
```bash
# .env
VITE_USE_MOCK_AUTH=false
VITE_API_URL=http://localhost:8000
```

---

## Security Notes

⚠️ **Important:** Mock authentication is for development only!

- Never use mock auth in production
- Mock credentials are hardcoded and insecure
- Real backend should implement proper JWT authentication
- Passwords should be hashed with bcrypt
- Implement refresh token rotation
- Add rate limiting on login endpoint
- Enable HTTPS in production

---

## Troubleshooting

### Can't login?
1. Check `.env` file exists with `VITE_USE_MOCK_AUTH=true`
2. Restart dev server after changing `.env`
3. Clear browser localStorage
4. Check browser console for errors

### Wrong role access?
1. Logout and login again
2. Check user role in browser DevTools → Application → Local Storage
3. Verify role matches expected routes

### Backend connection issues?
1. Set `VITE_USE_MOCK_AUTH=false`
2. Ensure backend is running on port 8000
3. Check CORS configuration in backend
4. Verify API endpoints match service files

---

## Next Steps

1. ✅ Use mock auth for frontend development
2. 🔄 Build backend authentication service
3. 🔄 Implement real JWT authentication
4. 🔄 Add password reset functionality
5. 🔄 Implement 2FA (optional)
6. 🔄 Add session management
7. 🔄 Deploy with real authentication
