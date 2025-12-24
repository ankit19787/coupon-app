@echo off
echo ========================================
echo XAMPP MySQL Port Conflict Fixer
echo ========================================
echo.

echo Checking if MySQL service is running...
sc query MySQL >nul 2>&1
if %errorlevel% == 0 (
    echo [INFO] MySQL Windows service found
    echo Stopping MySQL service...
    net stop MySQL >nul 2>&1
    echo Disabling MySQL service...
    sc config MySQL start= disabled >nul 2>&1
    echo [SUCCESS] MySQL service stopped and disabled
) else (
    echo [INFO] No MySQL Windows service found
)
echo.

echo Checking port 3306...
netstat -ano | findstr :3306 >nul
if %errorlevel% == 0 (
    echo [WARNING] Port 3306 is in use!
    echo.
    echo Processes using port 3306:
    netstat -ano | findstr :3306
    echo.
    echo You may need to:
    echo 1. Stop the service using port 3306
    echo 2. Or change XAMPP MySQL port to 3307
    echo.
) else (
    echo [SUCCESS] Port 3306 is available
)
echo.

echo ========================================
echo Next steps:
echo 1. Open XAMPP Control Panel
echo 2. Run as Administrator (right-click)
echo 3. Try starting MySQL
echo ========================================
echo.

pause

