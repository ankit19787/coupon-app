# Coupon Management System - Backend

A RESTful API backend for managing coupons built with Node.js, Express, and Sequelize.

## Features

- ✅ Full CRUD operations for coupons
- ✅ Coupon validation
- ✅ Discount calculation (percentage and fixed)
- ✅ Usage tracking
- ✅ Pagination and filtering
- ✅ JWT authentication
- ✅ Admin dashboard support
- ✅ Soft delete functionality
- ✅ Comprehensive error handling

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v10 or higher)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials:
**Option 1: Using POSTGRES_URL (Recommended)**
```env
PORT=3001
NODE_ENV=development
POSTGRES_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Option 2: Using individual variables (fallback)**
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coupon_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Note:** If `POSTGRES_URL` is set, it will be used. Otherwise, the individual variables will be used.

5. Create the database:
```sql
CREATE DATABASE coupon_db;
```

6. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will automatically create the necessary database tables on first run.

## API Endpoints

### Authentication

#### Login
```
POST /api/auth/login
Body: { "email": "admin@example.com", "password": "admin123" }
```

### Coupons

#### Get All Coupons
```
GET /api/coupons?page=1&limit=10&search=CODE&isActive=true&discountType=percentage
Headers: Authorization: Bearer <token>
```

#### Get Coupon by ID
```
GET /api/coupons/:id
Headers: Authorization: Bearer <token>
```

#### Get Coupon by Code
```
GET /api/coupons/code/:code
Headers: Authorization: Bearer <token>
```

#### Validate Coupon
```
POST /api/coupons/validate
Body: { "code": "SAVE20", "amount": 100 }
```

#### Create Coupon (Admin Only)
```
POST /api/coupons
Headers: Authorization: Bearer <token>
Body: {
  "code": "SAVE20",
  "description": "Save 20% on your purchase",
  "discount": 20,
  "discountType": "percentage",
  "minPurchaseAmount": 50,
  "maxDiscountAmount": 100,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "usageLimit": 100,
  "isActive": true
}
```

#### Update Coupon (Admin Only)
```
PUT /api/coupons/:id
Headers: Authorization: Bearer <token>
Body: { ...coupon fields to update }
```

#### Delete Coupon (Admin Only)
```
DELETE /api/coupons/:id
Headers: Authorization: Bearer <token>
```

#### Toggle Coupon Status (Admin Only)
```
PATCH /api/coupons/:id/toggle-status
Headers: Authorization: Bearer <token>
```

#### Apply Coupon
```
POST /api/coupons/apply
Headers: Authorization: Bearer <token>
Body: { "code": "SAVE20" }
```

#### Get Coupon Statistics (Admin Only)
```
GET /api/coupons/stats
Headers: Authorization: Bearer <token>
```

## Request/Response Examples

### Create Coupon Request
```json
{
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
}
```

### Success Response
```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "id": "uuid-here",
    "code": "SUMMER2024",
    "description": "Summer sale 2024",
    "discount": "25.00",
    "discountType": "percentage",
    "minPurchaseAmount": "100.00",
    "maxDiscountAmount": "500.00",
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-08-31T23:59:59.000Z",
    "usageLimit": 1000,
    "usedCount": 0,
    "isActive": true,
    "isDeleted": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

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

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional, for validation errors
}
```

## Testing

You can test the API using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)
- Insomnia

## License

ISC

