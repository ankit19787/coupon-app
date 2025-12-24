# Fix MySQL Shutdown Unexpectedly Error in XAMPP

## Quick Fix for Port 3306 Conflict

**If you see port 3306 is in use (like PID 23332):**

```cmd
# Stop the process using port 3306
taskkill /PID 23332 /F

# Stop MySQL Windows service
net stop MySQL
sc config MySQL start= disabled

# Verify port is free
netstat -ano | findstr :3306
```

**Or use the helper script:**
```cmd
cd coupon-app\backend\scripts
stop-mysql-conflict.bat
```

See `FIX_PORT_3306.md` for detailed port conflict solutions.

---

## Step-by-Step Troubleshooting

### Step 1: Check the Error Logs

1. **In XAMPP Control Panel**, click the **"Logs"** button next to MySQL
2. **Look for the actual error** - this will tell us what's wrong
3. Common errors you might see:
   - Port already in use
   - InnoDB errors
   - Permission denied
   - Corrupted data files

### Step 2: Check if Port 3306 is Already in Use

**Open Command Prompt as Administrator:**

```cmd
netstat -ano | findstr :3306
```

**If you see output**, something is using port 3306. Find the PID (last number) and check what it is:

```cmd
tasklist | findstr <PID>
```

**Solutions:**

#### Solution A: Stop the Conflicting Service

```cmd
# If it's MySQL service
net stop MySQL

# Or stop by PID
taskkill /PID <PID> /F
```

#### Solution B: Change XAMPP MySQL Port

1. Click **"Config"** next to MySQL in XAMPP
2. Select **"my.ini"**
3. Find `port=3306` and change to `port=3307`
4. Save and close
5. **Update your `.env` file:**
   ```env
   DB_PORT=3307
   ```
6. Restart MySQL in XAMPP

### Step 3: Check for Windows MySQL Service

**Check if MySQL is running as Windows Service:**

```cmd
sc query MySQL
```

**If it shows "RUNNING":**

```cmd
# Stop it
net stop MySQL

# Disable it (so it doesn't start automatically)
sc config MySQL start= disabled
```

**Then try starting MySQL in XAMPP again.**

### Step 4: Fix Corrupted MySQL Data (Common Fix)

**⚠️ Warning: This will delete all your MySQL data. Only do this if you don't have important data.**

1. **Stop MySQL in XAMPP** (if it's trying to start)

2. **Backup your data folder** (optional, if you have data):
   ```cmd
   xcopy C:\xampp3\mysql\data C:\xampp3\mysql\data_backup /E /I
   ```

3. **Delete MySQL data folder:**
   ```cmd
   rmdir /s C:\xampp3\mysql\data
   ```

4. **Create new data folder:**
   ```cmd
   mkdir C:\xampp3\mysql\data
   ```

5. **Copy default MySQL files:**
   ```cmd
   xcopy C:\xampp3\mysql\backup C:\xampp3\mysql\data /E /I
   ```

6. **Or reinitialize MySQL:**
   ```cmd
   cd C:\xampp3\mysql\bin
   mysql_install_db.exe --datadir=C:\xampp3\mysql\data --service=MySQL
   ```

7. **Start MySQL in XAMPP**

### Step 5: Check XAMPP MySQL Logs

**Location:** `C:\xampp3\mysql\data\*.err`

Open the error log file and look for:
- `[ERROR]` messages
- Port conflicts
- Permission issues
- InnoDB errors

### Step 6: Run XAMPP as Administrator

1. **Close XAMPP Control Panel**
2. **Right-click XAMPP Control Panel**
3. **Select "Run as administrator"**
4. **Try starting MySQL again**

### Step 7: Check Antivirus/Firewall

Sometimes antivirus blocks MySQL:
- **Temporarily disable antivirus**
- **Add XAMPP to antivirus exclusions:**
  - `C:\xampp3\mysql\bin\mysqld.exe`
  - `C:\xampp3\mysql\data\`

### Step 8: Reinstall MySQL in XAMPP

**Last resort if nothing works:**

1. **Stop MySQL in XAMPP**
2. **Backup your databases** (if any):
   ```cmd
   cd C:\xampp3\mysql\bin
   mysqldump.exe -u root --all-databases > C:\backup.sql
   ```

3. **Delete MySQL folder:**
   ```cmd
   rmdir /s C:\xampp3\mysql
   ```

4. **Reinstall XAMPP** or download MySQL separately

---

## Quick Fix Script

**Create a file `fix-mysql.bat` and run as Administrator:**

```batch
@echo off
echo Stopping MySQL service...
net stop MySQL 2>nul
sc config MySQL start= disabled 2>nul

echo Checking port 3306...
netstat -ano | findstr :3306
if %errorlevel% == 0 (
    echo Port 3306 is in use!
    echo Please stop the service using port 3306 first.
    pause
    exit
)

echo MySQL service stopped and disabled.
echo Now try starting MySQL in XAMPP Control Panel.
pause
```

---

## Most Common Solutions (Try These First!)

### ⚠️ Solution 0: CHECK THE LOGS FIRST!
**This is critical!** Click "Logs" button in XAMPP and read the actual error.
- See `CHECK_MYSQL_LOGS.md` for how to read logs
- Run `check-mysql-errors.bat` script for automated diagnosis

### Solution 1: Stop Windows MySQL Service
```cmd
net stop MySQL
sc config MySQL start= disabled
```

### Solution 2: Fix Corrupted MySQL Data (Very Common!)

**If logs show InnoDB errors or corrupted data:**

```cmd
# Stop MySQL in XAMPP first!

# Backup (optional)
xcopy C:\xampp3\mysql\data C:\xampp3\mysql\data_backup /E /I

# Delete corrupted data
rmdir /s /q C:\xampp3\mysql\data

# Create new data folder
mkdir C:\xampp3\mysql\data

# Copy default files
xcopy C:\xampp3\mysql\backup\*.* C:\xampp3\mysql\data\ /E /I /Y
```

Then start MySQL in XAMPP - it will recreate everything.

### Solution 3: Change MySQL Port in XAMPP
- Config → my.ini → Change port to 3307
- Update `.env`: `DB_PORT=3307`

### Solution 4: Run XAMPP as Administrator
- Right-click → Run as administrator
- Fixes permission issues

---

## Alternative: Use Docker MySQL (If XAMPP Keeps Failing)

If XAMPP MySQL continues to have issues, use Docker:

```bash
docker run --name mysql-coupon \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=coupon_db \
  -p 3306:3306 \
  -d mysql:8.0
```

Then update `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=coupon_db
DB_USER=root
DB_PASSWORD=rootpassword
```

---

## Still Not Working?

1. **Check the actual error log:**
   - XAMPP → MySQL → Logs button
   - Or check: `C:\xampp3\mysql\data\*.err`

2. **Share the error message** from the logs

3. **Check Windows Event Viewer:**
   - Press `Win + R`
   - Type: `eventvwr.msc`
   - Look under "Windows Logs" → "Application"
   - Find MySQL errors

---

## Quick Checklist

- [ ] Checked error logs in XAMPP
- [ ] Stopped Windows MySQL service
- [ ] Checked port 3306 availability
- [ ] Ran XAMPP as Administrator
- [ ] Checked antivirus/firewall
- [ ] Tried changing MySQL port
- [ ] Checked Windows Event Viewer

