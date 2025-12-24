# XAMPP MySQL Setup Guide

## Starting MySQL in XAMPP

### Windows

1. **Open XAMPP Control Panel**
   - Find XAMPP in your Start Menu
   - Run as Administrator (right-click → Run as administrator)

2. **Start MySQL Service**
   - Click the "Start" button next to MySQL
   - Wait for the status to turn green
   - If it shows "Running" in green, MySQL is active

3. **Common Issues and Solutions**

#### Issue: Port 3306 Already in Use
**Solution:**
- Check if another MySQL instance is running
- Open Command Prompt as Admin and run:
  ```cmd
  netstat -ano | findstr :3306
  ```
- If you see a PID, stop that process or change XAMPP MySQL port:
  - Click "Config" next to MySQL in XAMPP
  - Edit `my.ini` file
  - Change `port=3306` to `port=3307` (or another available port)
  - Update your `.env` file: `DB_PORT=3307`

#### Issue: MySQL Won't Start
**Solutions:**
1. **Check Error Logs**
   - Click "Logs" button next to MySQL in XAMPP
   - Look for error messages

2. **Check if MySQL is already running as Windows Service**
   ```cmd
   sc query MySQL
   ```
   - If running, stop it:
   ```cmd
   net stop MySQL
   ```
   - Or disable it:
   ```cmd
   sc config MySQL start= disabled
   ```

3. **Check Port Conflicts**
   - Skype, TeamViewer, or other apps might use port 3306
   - Change MySQL port in XAMPP (see above)

4. **Reinstall MySQL in XAMPP**
   - Stop MySQL in XAMPP
   - Delete `mysql` folder in XAMPP directory
   - Restart XAMPP and reinstall MySQL

### macOS

1. **Open XAMPP Control Panel**
   - Open Applications → XAMPP
   - Click "Manage Servers" tab

2. **Start MySQL**
   - Select MySQL Database
   - Click "Start"

3. **If MySQL won't start:**
   ```bash
   # Check if MySQL is already running
   ps aux | grep mysql
   
   # Kill existing MySQL processes
   sudo killall mysqld
   
   # Start MySQL via XAMPP again
   ```

### Linux

1. **Start MySQL via XAMPP:**
   ```bash
   sudo /opt/lampp/lampp startmysql
   ```

2. **Check status:**
   ```bash
   sudo /opt/lampp/lampp status
   ```

---

## Alternative: Use XAMPP MySQL via Command Line

### Windows

#### Option 1: Using Command Prompt (CMD) or PowerShell

1. **Open Command Prompt or PowerShell**
   - Navigate to XAMPP MySQL bin directory:
   ```cmd
   cd C:\xampp3\mysql\bin
   ```

2. **Start MySQL:**
   ```cmd
   mysql.exe -u root
   ```

3. **Create Database:**
   ```sql
   CREATE DATABASE coupon_db;
   EXIT;
   ```

#### Option 2: Using Git Bash or WSL

If you're using Git Bash or WSL, use the full Windows path:

```bash
# Navigate to XAMPP MySQL bin directory
cd /c/xampp3/mysql/bin

# Start MySQL (use .exe extension)
./mysql.exe -u root
```

Or use the full path directly:
```bash
/c/xampp3/mysql/bin/mysql.exe -u root
```

Then in MySQL:
```sql
CREATE DATABASE coupon_db;
EXIT;
```

#### Option 3: Add MySQL to PATH (Recommended)

1. **Add to PATH:**
   - Right-click "This PC" → Properties
   - Advanced System Settings → Environment Variables
   - Under "System Variables", find "Path" → Edit
   - Add: `C:\xampp3\mysql\bin`
   - Click OK

2. **Restart your terminal**, then you can use:
   ```bash
   mysql -u root
   ```

#### Option 4: Use phpMyAdmin (Easiest)

1. **Start Apache and MySQL in XAMPP**
2. **Open browser:** http://localhost/phpmyadmin
3. **Click "New"** in left sidebar
4. **Enter database name:** `coupon_db`
5. **Click "Create"**

### macOS/Linux

```bash
# Navigate to MySQL bin
cd /Applications/XAMPP/xamppfiles/bin

# Start MySQL
./mysql -u root

# Create database
CREATE DATABASE coupon_db;
EXIT;
```

---

## Update Backend Configuration

### Option 1: Use Default XAMPP Settings

Update `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=coupon_db
DB_USER=root
DB_PASSWORD=
```

### Option 2: If Changed MySQL Port

If you changed MySQL port to 3307:
```env
DB_HOST=localhost
DB_PORT=3307
DB_NAME=coupon_db
DB_USER=root
DB_PASSWORD=
```

---

## Verify MySQL Connection

### Test Connection via Command Line

**Windows (CMD/PowerShell):**
```cmd
cd C:\xampp3\mysql\bin
mysql.exe -u root -e "SHOW DATABASES;"
```

**Windows (Git Bash/WSL):**
```bash
/c/xampp3/mysql/bin/mysql.exe -u root -e "SHOW DATABASES;"
```

**Or if MySQL is in PATH:**
```bash
mysql -u root -e "SHOW DATABASES;"
```

**macOS/Linux:**
```bash
/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "SHOW DATABASES;"
```

### Test from Backend

1. Start your backend:
   ```bash
   cd coupon-app/backend
   npm run dev
   ```

2. Check console output:
   - Should see: "Database connection established successfully."
   - If error, check the error message

---

## Common XAMPP MySQL Issues

### 1. MySQL Service Won't Start
**Causes:**
- Port 3306 already in use
- Corrupted MySQL data
- Windows service conflict

**Solutions:**
- Change port in XAMPP MySQL config
- Stop other MySQL services
- Reinstall MySQL in XAMPP

### 2. Access Denied Error
**Solution:**
- XAMPP MySQL root user has no password by default
- Use empty password in `.env`: `DB_PASSWORD=`
- Or set password:
  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';
  ```

### 3. Can't Connect to MySQL
**Check:**
- MySQL is running in XAMPP (green status)
- Correct port in `.env`
- Firewall not blocking MySQL
- MySQL socket path (usually not needed for localhost)

### 4. Database Not Found
**Solution:**
- Create database manually:
  ```sql
  CREATE DATABASE coupon_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

---

## Alternative: Use Standalone MySQL

If XAMPP MySQL continues to cause issues, consider:

1. **Install MySQL separately**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Install and configure
   - Use MySQL Workbench for management

2. **Use Docker MySQL**
   ```bash
   docker run --name mysql-coupon \
     -e MYSQL_ROOT_PASSWORD=rootpassword \
     -e MYSQL_DATABASE=coupon_db \
     -p 3306:3306 \
     -d mysql:8.0
   ```

3. **Use SQLite (for development)**
   - Modify backend to use SQLite instead
   - No separate database server needed

---

## Quick Troubleshooting Checklist

- [ ] XAMPP Control Panel is running as Administrator
- [ ] MySQL shows "Running" (green) in XAMPP
- [ ] Port 3306 is not used by another service
- [ ] `.env` file has correct database credentials
- [ ] Database `coupon_db` exists
- [ ] Backend can connect (check console logs)
- [ ] Firewall allows MySQL connections

---

## Still Having Issues?

1. **Check XAMPP MySQL Logs:**
   - XAMPP Control Panel → MySQL → Logs

2. **Check Backend Logs:**
   - Look at console output when starting backend
   - Error messages will indicate the issue

3. **Test MySQL Connection:**
   
   **Windows CMD/PowerShell:**
   ```cmd
   cd C:\xampp3\mysql\bin
   mysql.exe -u root
   ```
   
   **Git Bash/WSL:**
   ```bash
   /c/xampp3/mysql/bin/mysql.exe -u root
   ```
   
   **Or use phpMyAdmin:**
   - Open: http://localhost/phpmyadmin
   - If it loads, MySQL is working
   
   If successful, you'll see MySQL prompt: `mysql>`

4. **Verify Database:**
   ```sql
   SHOW DATABASES;
   USE coupon_db;
   SHOW TABLES;
   ```

---

## Need Help?

If MySQL still won't start:
1. Share the error message from XAMPP logs
2. Share backend connection error
3. Check if port 3306 is available
4. Consider using Docker or standalone MySQL

