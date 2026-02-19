# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd school_erp/frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Login with Demo Credentials

Open http://localhost:3000 and use any of these:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@school.com | admin123 |
| **Teacher** | teacher@school.com | teacher123 |
| **Student** | student@school.com | student123 |
| **Parent** | parent@school.com | parent123 |
| **Accountant** | accountant@school.com | accountant123 |
| **Admissions** | admissions@school.com | admissions123 |

**Or** use the Quick Login buttons on the login page!

---

## 📱 What You Can Test

### Admin Dashboard
- User management
- Class management
- Gallery management
- System overview

### Teacher Portal
- Mark attendance
- Enter marks/grades
- Create class diary
- View schedule

### Student Portal
- View syllabus
- Check progress
- Chat with AI tutor
- Track attendance

### Parent Portal
- Monitor child's attendance
- View academic progress
- Pay fees online
- Communication

### Accountant Portal
- Manage invoices
- Track payments
- Financial reports

### Admissions Portal
- Review applications
- Process admissions
- Public application form

---

## 🔧 Configuration

The app is in **Mock Mode** by default (no backend required).

To connect to real backend:
```bash
# Edit .env file
VITE_USE_MOCK_AUTH=false
VITE_API_URL=http://localhost:8000
```

---

## 📚 Documentation

- **DEMO_CREDENTIALS.md** - All login credentials
- **FRONTEND_STRUCTURE.md** - Project structure
- **ARCHITECTURE_DIAGRAM.md** - System architecture
- **DEVELOPER_GUIDE.md** - Development guide
- **COMPLETION_STATUS.md** - Feature checklist

---

## 🎯 Key Features

✅ Role-based authentication
✅ 6 different user portals
✅ 22+ pages/screens
✅ Modern UI with Tailwind CSS
✅ Responsive design
✅ Mock authentication for testing
✅ Ready for backend integration

---

## 🐛 Troubleshooting

**Can't login?**
- Make sure `.env` file exists
- Restart dev server after changes
- Clear browser cache/localStorage

**Module errors?**
- Run `npm install` again
- Delete `node_modules` and reinstall

**Port already in use?**
- Change port in `vite.config.ts`
- Or kill process using port 3000

---

## 📞 Need Help?

Check the documentation files or review the code comments!

Happy coding! 🎉
