# Postman Collection - Coupon Management API

## Import Instructions

1. **Open Postman**
2. Click **Import** button (top left)
3. Select the file: `Coupon_Management_API.postman_collection.json`
4. Click **Import**

## Setup

### Environment Variables

The collection uses these variables:
- `base_url`: Base URL for the API (default: `http://localhost:3001`)
- `token`: Authentication token (automatically set after login)

### Quick Start

1. **Set Base URL** (if different from default):
   - Click on the collection name
   - Go to "Variables" tab
   - Update `base_url` if needed

2. **Login First**:
   - Go to **Authentication > Login**
   - Update email/password if needed (default: `admin@example.com` / `admin123`)
   - Send the request
   - The token will be automatically saved to the collection variable

3. **Start Testing**:
   - All other endpoints will automatically use the saved token
   - Replace UUID placeholders (`:id`, `:code`) with actual values from your database

## Endpoints Overview

### Authentication
- `POST /api/auth/login` - Login and get token

### Health Check
- `GET /health` - Check server status

### Coupons (10 endpoints)
- `GET /api/coupons` - Get all coupons (with pagination & filters)
- `GET /api/coupons/:id` - Get coupon by ID
- `GET /api/coupons/code/:code` - Get coupon by code (public)
- `POST /api/coupons` - Create coupon (Admin only)
- `PUT /api/coupons/:id` - Update coupon (Admin only)
- `DELETE /api/coupons/:id` - Delete coupon (Admin only)
- `PATCH /api/coupons/:id/toggle-status` - Toggle status (Admin only)
- `POST /api/coupons/validate` - Validate coupon code
- `POST /api/coupons/apply` - Apply coupon (increment usage)
- `GET /api/coupons/stats` - Get statistics (Admin only)

### Websites (5 endpoints)
- `GET /api/websites` - Get all websites
- `GET /api/websites/:id` - Get website by ID
- `POST /api/websites` - Create website
- `PUT /api/websites/:id` - Update website
- `DELETE /api/websites/:id` - Delete website

### Users (10 endpoints)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `POST /api/users/:id/websites` - Assign websites to user (Admin only)
- `POST /api/users/:id/coupons` - Assign coupons to user (Admin only)
- `GET /api/users/:id/websites` - Get user's websites (Admin only)
- `GET /api/users/:id/coupons` - Get user's coupons (Admin only)
- `GET /api/users/statistics/coupon-usage` - Get user coupon statistics (Admin only)

## Authentication

Most endpoints require authentication. The token is automatically included in requests after login.

**Token Format**: `Bearer {token}`

## Example Request Bodies

### Create Coupon
```json
{
  "code": "SUMMER2024",
  "websiteId": "uuid-here",
  "description": "Summer sale",
  "discount": 25.00,
  "discountType": "percentage",
  "minPurchaseAmount": 100.00,
  "maxDiscountAmount": 500.00,
  "startDate": "2024-06-01T00:00:00.000Z",
  "endDate": "2024-08-31T23:59:59.000Z",
  "usageLimit": 1000,
  "isActive": true
}
```

### Create User
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### Assign Coupons to User
```json
{
  "couponIds": [
    "coupon-uuid-1",
    "coupon-uuid-2"
  ]
}
```

## Notes

- Replace all UUID placeholders (`:id`, `:code`) with actual values
- Admin-only endpoints require a user with `role: "admin"`
- The login endpoint automatically saves the token to collection variables
- All dates should be in ISO 8601 format (e.g., `2024-06-01T00:00:00.000Z`)

## Troubleshooting

1. **401 Unauthorized**: Make sure you've logged in first
2. **403 Forbidden**: You need admin role for this endpoint
3. **404 Not Found**: Check the UUID/ID in the URL
4. **422 Validation Error**: Check the request body format and required fields

