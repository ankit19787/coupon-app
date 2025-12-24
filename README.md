# Coupon Management System

A full-stack coupon management application with backend API and frontend admin dashboard.

## Features

### Backend
- ✅ RESTful API with Express.js
- ✅ MySQL database with Sequelize ORM
- ✅ JWT authentication
- ✅ Full CRUD operations for coupons
- ✅ Coupon validation and discount calculation
- ✅ Usage tracking and statistics
- ✅ Pagination and filtering
- ✅ Comprehensive error handling

### Frontend
- ✅ React with Vite
- ✅ Material-UI components
- ✅ Admin dashboard
- ✅ Coupon management (Create, Read, Update, Delete)
- ✅ Real-time statistics
- ✅ Search and pagination
- ✅ Responsive design

## Project Structure

```
coupon-app/
├── backend/          # Node.js/Express backend
│   ├── config/       # Database configuration
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Auth and error handling
│   ├── models/       # Sequelize models
│   ├── routes/       # API routes
│   ├── validators/   # Input validation
│   └── server.js     # Entry point
│
└── frontend/         # React frontend
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── contexts/    # React contexts
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   └── App.jsx      # Main app component
    └── vite.config.js
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=coupon_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

5. Create MySQL database:
```sql
CREATE DATABASE coupon_db;
```

6. Start backend server:
```bash
npm run dev
```

The server will automatically create database tables on first run.

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

## Usage

### Access the Application

1. Open browser and navigate to `http://localhost:3000`
2. Login with demo credentials:
   - Email: `admin@example.com`
   - Password: `admin123`

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Login

#### Coupons
- `GET /api/coupons` - Get all coupons (with pagination and filters)
- `GET /api/coupons/:id` - Get coupon by ID
- `GET /api/coupons/code/:code` - Get coupon by code
- `POST /api/coupons/validate` - Validate coupon
- `POST /api/coupons` - Create coupon (Admin only)
- `PUT /api/coupons/:id` - Update coupon (Admin only)
- `DELETE /api/coupons/:id` - Delete coupon (Admin only)
- `PATCH /api/coupons/:id/toggle-status` - Toggle coupon status (Admin only)
- `POST /api/coupons/apply` - Apply coupon (increment usage)
- `GET /api/coupons/stats` - Get coupon statistics (Admin only)

### Example API Request

#### Create Coupon
```bash
curl -X POST http://localhost:3001/api/coupons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "code": "SUMMER2024",
    "description": "Summer sale 2024",
    "discount": 25,
    "discountType": "percentage",
    "minPurchaseAmount": 100,
    "maxDiscountAmount": 500,
    "startDate": "2024-06-01T00:00:00Z",
    "endDate": "2024-08-31T23:59:59Z",
    "usageLimit": 1000,
    "isActive": true
  }'
```

#### Validate Coupon
```bash
curl -X POST http://localhost:3001/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER2024",
    "amount": 200
  }'
```

## Database

This application uses **PostgreSQL** as the database.

**Setup Guide:** See `POSTGRESQL_SETUP.md` for installation and configuration.

## Database Schema

### Coupons Table
- `id` (UUID, Primary Key)
- `code` (STRING, Unique, Required)
- `description` (TEXT, Optional)
- `discount` (DECIMAL, Required)
- `discountType` (ENUM: 'percentage' | 'fixed', Required)
- `minPurchaseAmount` (DECIMAL, Optional)
- `maxDiscountAmount` (DECIMAL, Optional)
- `startDate` (DATE, Required)
- `endDate` (DATE, Required)
- `usageLimit` (INTEGER, Optional)
- `usedCount` (INTEGER, Default: 0)
- `isActive` (BOOLEAN, Default: true)
- `isDeleted` (BOOLEAN, Default: false)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon (auto-reload)
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Building for Production

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build  # Creates production build in dist/
npm run preview  # Preview production build
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES_IN` - JWT expiration time
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001)

## Security Notes

- Change JWT_SECRET in production
- Use strong database passwords
- Implement proper user authentication (current demo uses simple login)
- Add rate limiting for production
- Use HTTPS in production
- Validate all inputs on both client and server

## License

ISC

## Support

For issues and questions, please open an issue in the repository.

