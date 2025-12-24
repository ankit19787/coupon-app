# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14+) installed
- ✅ PostgreSQL (v12+) installed and running
- ✅ npm or yarn installed

## Step-by-Step Setup

### 1. Database Setup

**Install PostgreSQL:**
- Download from: https://www.postgresql.org/download/
- Install and remember your `postgres` user password

**Create Database:**

**Option A: Using pgAdmin (Easiest)**
1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Connect to server (enter postgres password)
3. Right-click "Databases" → Create → Database
4. Name: `coupon_db`
5. Click "Save"

**Option B: Using Command Line**

**Windows:**
```cmd
psql -U postgres -c "CREATE DATABASE coupon_db;"
```

**macOS/Linux:**
```bash
sudo -u postgres psql -c "CREATE DATABASE coupon_db;"
```

**See `POSTGRESQL_SETUP.md` for detailed setup guide.**

### 2. Backend Setup

```bash
# Navigate to backend directory
cd coupon-app/backend

# Install dependencies
npm install

# Create environment file
# Copy the content below into a new file named .env
```

Create `backend/.env` file:
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coupon_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_SSL=false
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Important:** Replace `your_postgres_password` with the password you set during PostgreSQL installation.

```bash
# Start backend server
npm run dev
```

Backend should now be running on http://localhost:3001

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd coupon-app/frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

Frontend should now be running on http://localhost:3000

### 4. Access the Application

1. Open browser: http://localhost:3000
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`

## Testing the API

### Using cURL

#### 1. Login to get token:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Copy the token from the response.

#### 2. Create a coupon:
```bash
curl -X POST http://localhost:3001/api/coupons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "code": "TEST20",
    "description": "Test coupon",
    "discount": 20,
    "discountType": "percentage",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "usageLimit": 100,
    "isActive": true
  }'
```

#### 3. Validate a coupon:
```bash
curl -X POST http://localhost:3001/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST20",
    "amount": 100
  }'
```

## Common Issues

### MySQL Shutdown Unexpectedly Error

**If you see "MySQL shutdown unexpectedly" in XAMPP:**

1. **Check the Logs** - Click "Logs" button next to MySQL in XAMPP
2. **Most common fix** - Stop Windows MySQL service:
   ```cmd
   net stop MySQL
   sc config MySQL start= disabled
   ```
3. **Check port conflict** - Port 3306 might be in use:
   ```cmd
   netstat -ano | findstr :3306
   ```
4. **Run XAMPP as Administrator** - Right-click → Run as administrator
5. **See detailed guide:** `MYSQL_SHUTDOWN_FIX.md`

**Quick fix script:** Run `backend/scripts/fix-mysql-port.bat` as Administrator

### Database Connection Error

**For PostgreSQL:**
- Ensure PostgreSQL service is running
  - Windows: Check Services (postgresql-x64-15)
  - macOS: `brew services list`
  - Linux: `sudo systemctl status postgresql`
- Verify database exists: `psql -U postgres -l`
- Check credentials in `.env` file
- Verify PostgreSQL port: `DB_PORT=5432` (default)
- Test connection: `psql -U postgres -d coupon_db`
- See `POSTGRESQL_SETUP.md` for detailed troubleshooting

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Check backend is running before starting frontend

## Next Steps

- Customize authentication (currently demo)
- Add more features as needed
- Deploy to production
- Add tests

## Support

Check the main README.md for detailed documentation.

