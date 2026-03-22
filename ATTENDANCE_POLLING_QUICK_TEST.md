# 🚀 Quick Test - Attendance Polling

## ⚡ 30-Second Test

### 1. Open Admin Dashboard
```
http://localhost:3000
Login → Live Monitoring → Click any trip
```

### 2. Open Console (F12)
```javascript
window.testMarkAttendance("att-3", "PRESENT")
```

### 3. Wait 10 Seconds
```
✅ UI updates automatically!
No refresh needed!
```

---

## 🎯 What to Look For

### Before Update
```
Present: 2/3 (67%)
Unmarked: 1/3 (33%)
⏱️  Olivia Brown [Unmarked]
```

### After 10 Seconds
```
Present: 3/3 (100%)
Unmarked: 0/3 (0%)
✅ Olivia Brown [Present]  ⭐ CHANGED!
```

---

## 🧪 Test Commands

```javascript
// Single student
window.testMarkAttendance("att-3", "PRESENT")

// All students
window.testMarkAllPresent("trip-1")

// Mark as absent
window.testMarkAttendance("att-3", "ABSENT")
```

---

## ✅ Success Indicators

- [ ] Console shows: `✅ Attendance marked successfully!`
- [ ] Console shows: `🔄 Admin UI should update within 10 seconds...`
- [ ] After 10 seconds: Status badge changes
- [ ] After 10 seconds: Counts update
- [ ] No page refresh needed

---

## 🐛 If It Doesn't Work

1. Check `.env` file:
   ```env
   VITE_USE_MOCK=true
   VITE_USE_MOCK_API=true
   ```

2. Restart frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Check console for:
   ```
   🧪 Test utilities loaded!
   ```

---

## 📚 Full Documentation

- `ATTENDANCE_POLLING_FIX_SUMMARY.md` - Complete fix details
- `ATTENDANCE_POLLING_TEST_GUIDE.md` - Comprehensive testing guide

---

**Status:** ✅ READY TO TEST  
**Time Required:** 30 seconds  
**Expected Result:** Automatic UI update
