# Quick MySQL Access Guide

## Easiest Method: phpMyAdmin

1. **Start Apache and MySQL in XAMPP Control Panel**
2. **Open browser:** http://localhost/phpmyadmin
3. **Click "New"** in the left sidebar
4. **Enter database name:** `coupon_db`
5. **Click "Create"**

✅ Done! No command line needed.

---

## Command Line Methods

### Windows Command Prompt (CMD)

```cmd
cd C:\xampp3\mysql\bin
mysql.exe -u root
```

### Windows PowerShell

```powershell
cd C:\xampp3\mysql\bin
.\mysql.exe -u root
```

### Git Bash or WSL

```bash
# Method 1: Navigate first
cd /c/xampp3/mysql/bin
./mysql.exe -u root

# Method 2: Use full path directly
/c/xampp3/mysql/bin/mysql.exe -u root
```

### After Connecting to MySQL

```sql
-- Show all databases
SHOW DATABASES;

-- Create coupon database
CREATE DATABASE coupon_db;

-- Use the database
USE coupon_db;

-- Exit MySQL
EXIT;
```

---

## Add MySQL to PATH (One-Time Setup)

This allows you to use `mysql` from anywhere:

### Windows

1. **Open Environment Variables:**
   - Press `Win + R`
   - Type: `sysdm.cpl` → Enter
   - Click "Environment Variables"

2. **Edit Path:**
   - Under "System Variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\xampp3\mysql\bin`
   - Click OK on all dialogs

3. **Restart your terminal**

4. **Now you can use:**
   ```bash
   mysql -u root
   ```

---

## Quick Test Commands

### Test if MySQL is running:

**CMD/PowerShell:**
```cmd
cd C:\xampp3\mysql\bin
mysql.exe -u root -e "SELECT 1;"
```

**Git Bash:**
```bash
/c/xampp3/mysql/bin/mysql.exe -u root -e "SELECT 1;"
```

If you see `1`, MySQL is working! ✅

### Check if database exists:

```bash
# Replace with your method
mysql.exe -u root -e "SHOW DATABASES LIKE 'coupon_db';"
```

---

## Troubleshooting

### "mysql.exe: command not found" in Git Bash

**Solution:** Use the full path:
```bash
/c/xampp3/mysql/bin/mysql.exe -u root
```

Or add to PATH (see above).

### "Access denied" error

**Solution:** XAMPP MySQL root user has no password by default. Use:
```bash
mysql.exe -u root
```
(No `-p` flag needed)

### "Can't connect to MySQL server"

**Solution:**
1. Check XAMPP Control Panel - MySQL should be green/running
2. Try restarting MySQL in XAMPP
3. Check if port 3306 is available

---

## Recommended: Use phpMyAdmin

For most users, **phpMyAdmin is the easiest way** to manage databases:
- No command line needed
- Visual interface
- Easy to create databases and tables
- Access at: http://localhost/phpmyadmin

Just make sure Apache and MySQL are running in XAMPP!

