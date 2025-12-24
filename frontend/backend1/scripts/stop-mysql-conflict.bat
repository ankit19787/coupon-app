@echo off
echo ========================================
echo Stopping Process Using Port 3306
echo ========================================
echo.

echo Checking process ID 23332...
tasklist | findstr 23332
echo.

echo Stopping process 23332...
taskkill /PID 23332 /F
if %errorlevel% == 0 (
    echo [SUCCESS] Process stopped successfully
) else (
    echo [ERROR] Could not stop process. Try running as Administrator.
)
echo.

echo Checking for MySQL Windows service...
sc query MySQL >nul 2>&1
if %errorlevel% == 0 (
    echo Stopping MySQL Windows service...
    net stop MySQL
    echo Disabling MySQL Windows service...
    sc config MySQL start= disabled
    echo [SUCCESS] MySQL service stopped and disabled
) else (
    echo [INFO] No MySQL Windows service found
)
echo.

echo Checking port 3306 again...
timeout /t 2 >nul
netstat -ano | findstr :3306
if %errorlevel% == 0 (
    echo [WARNING] Port 3306 is still in use!
    echo You may need to restart your computer or change XAMPP MySQL port.
) else (
    echo [SUCCESS] Port 3306 is now free!
    echo You can now start MySQL in XAMPP Control Panel.
)
echo.

pause

