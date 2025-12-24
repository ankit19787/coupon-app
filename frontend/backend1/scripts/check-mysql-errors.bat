@echo off
echo ========================================
echo MySQL Error Diagnostic Tool
echo ========================================
echo.

echo [1/4] Checking MySQL error log files...
if exist "C:\xampp3\mysql\data\*.err" (
    echo Found error log files:
    for %%f in ("C:\xampp3\mysql\data\*.err") do (
        echo   - %%~nxf
    )
    echo.
    echo Last 30 lines of most recent error log:
    echo ----------------------------------------
    for /f "delims=" %%f in ('dir /B /O-D "C:\xampp3\mysql\data\*.err" 2^>nul') do (
        echo File: %%f
        powershell -Command "Get-Content 'C:\xampp3\mysql\data\%%f' | Select-Object -Last 30"
        goto :found
    )
    :found
) else (
    echo [INFO] No error log files found in C:\xampp3\mysql\data\
)
echo.
echo ----------------------------------------
echo.

echo [2/4] Checking port 3306...
netstat -ano | findstr :3306 >nul
if %errorlevel% == 0 (
    echo [WARNING] Port 3306 is in use!
    echo Processes using port 3306:
    netstat -ano | findstr :3306
    echo.
) else (
    echo [OK] Port 3306 is free
)
echo.

echo [3/4] Checking MySQL Windows service...
sc query MySQL >nul 2>&1
if %errorlevel% == 0 (
    echo [INFO] MySQL Windows service exists
    for /f "tokens=3" %%a in ('sc query MySQL ^| findstr STATE') do set STATE=%%a
    echo Service state: %STATE%
    echo.
) else (
    echo [OK] No MySQL Windows service found
)
echo.

echo [4/4] Checking XAMPP MySQL process...
tasklist | findstr /I mysqld >nul
if %errorlevel% == 0 (
    echo [INFO] MySQL process found:
    tasklist | findstr /I mysqld
    echo.
) else (
    echo [INFO] No MySQL process running
)
echo.

echo ========================================
echo Diagnostic Complete
echo ========================================
echo.
echo Next steps:
echo 1. Check the error log above for specific errors
echo 2. If port 3306 is in use, run: stop-mysql-conflict.bat
echo 3. If you see InnoDB errors, you may need to reset MySQL data
echo 4. Share the error log output if you need more help
echo.

pause

