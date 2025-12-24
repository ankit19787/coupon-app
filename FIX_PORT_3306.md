# Fix Port 3306 Conflict

## Your Situation

Port 3306 is being used by **Process ID 23332**. Let's identify and stop it.

## Step 1: Identify What Process 23332 Is

**Open Command Prompt as Administrator** and run:

```cmd
tasklist | findstr 23332
```

This will show you what program is using port 3306. It's likely:
- MySQL Windows Service
- Another MySQL instance
- XAMPP MySQL (if already running)

## Step 2: Stop the Process

### Option A: Stop by Process ID

```cmd
taskkill /PID 23332 /F
```

### Option B: Stop MySQL Windows Service (Most Common)

```cmd
net stop MySQL
sc config MySQL start= disabled
```

### Option C: Use the Helper Script

I've created a script that does this automatically:

```cmd
cd coupon-app\backend\scripts
stop-mysql-conflict.bat
```

**Run it as Administrator** - it will:
1. Stop process 23332
2. Stop MySQL Windows service
3. Check if port 3306 is free

## Step 3: Verify Port is Free

After stopping the process, check again:

```cmd
netstat -ano | findstr :3306
```

**If you see no output**, port 3306 is free! ✅

## Step 4: Start MySQL in XAMPP

1. **Open XAMPP Control Panel**
2. **Run as Administrator** (right-click → Run as administrator)
3. **Click "Start"** next to MySQL
4. It should start successfully now!

## Alternative: Change XAMPP MySQL Port

If you can't stop the process, change XAMPP MySQL port instead:

### Step 1: Change MySQL Port in XAMPP

1. In XAMPP Control Panel, click **"Config"** next to MySQL
2. Select **"my.ini"**
3. Find the line: `port=3306`
4. Change it to: `port=3307`
5. Save and close

### Step 2: Update Your .env File

Edit `coupon-app/backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3307
DB_NAME=coupon_db
DB_USER=root
DB_PASSWORD=
```

### Step 3: Restart MySQL in XAMPP

Now MySQL will use port 3307 instead of 3306.

## Quick Commands Summary

```cmd
# Check what's using port 3306
netstat -ano | findstr :3306

# Identify the process
tasklist | findstr 23332

# Stop the process
taskkill /PID 23332 /F

# Stop MySQL service
net stop MySQL
sc config MySQL start= disabled

# Verify port is free
netstat -ano | findstr :3306
```

## Still Having Issues?

1. **Restart your computer** - This will clear all processes
2. **Check if XAMPP MySQL is already running** - Look in XAMPP Control Panel
3. **Use different port** - Change XAMPP MySQL to port 3307 (see above)

## Next Steps

After fixing the port conflict:

1. ✅ Port 3306 is free (or using port 3307)
2. ✅ Start MySQL in XAMPP
3. ✅ Create database: `coupon_db`
4. ✅ Test connection: `npm run test-db` in backend folder

