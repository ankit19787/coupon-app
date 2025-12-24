# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Endpoints

### Authentication

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

---

### Coupons

#### Get All Coupons
```http
GET /coupons?page=1&limit=10&search=CODE&isActive=true&discountType=percentage
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by code or description
- `isActive` (optional): Filter by active status (true/false)
- `discountType` (optional): Filter by type (percentage/fixed)
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "SAVE20",
      "description": "Save 20%",
      "discount": "20.00",
      "discountType": "percentage",
      "minPurchaseAmount": "50.00",
      "maxDiscountAmount": "100.00",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T23:59:59.000Z",
      "usageLimit": 100,
      "usedCount": 5,
      "isActive": true,
      "isDeleted": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

#### Get Coupon by ID
```http
GET /coupons/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "SAVE20",
    ...
  }
}
```

---

#### Get Coupon by Code
```http
GET /coupons/code/:code
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "SAVE20",
    ...
  }
}
```

---

#### Validate Coupon (Public)
```http
POST /coupons/validate
Content-Type: application/json

{
  "code": "SAVE20",
  "amount": 100
}
```

**Response (Valid):**
```json
{
  "success": true,
  "valid": true,
  "data": {
    "coupon": {
      "id": "uuid",
      "code": "SAVE20",
      "discount": "20.00",
      "discountType": "percentage",
      "description": "Save 20%"
    },
    "discountAmount": 20,
    "finalAmount": 80
  }
}
```

**Response (Invalid):**
```json
{
  "success": false,
  "valid": false,
  "message": "Coupon has expired"
}
```

---

#### Create Coupon (Admin Only)
```http
POST /coupons
Authorization: Bearer <token>
Content-Type: application/json

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

**Required Fields:**
- `code`: String (3-50 chars, unique)
- `discount`: Number (>= 0)
- `discountType`: "percentage" | "fixed"
- `startDate`: ISO 8601 date string
- `endDate`: ISO 8601 date string (must be after startDate)

**Optional Fields:**
- `description`: String
- `minPurchaseAmount`: Number (>= 0)
- `maxDiscountAmount`: Number (>= 0, for percentage type)
- `usageLimit`: Integer (>= 0, null for unlimited)
- `isActive`: Boolean (default: true)

**Response:**
```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "id": "uuid",
    "code": "SUMMER2024",
    ...
  }
}
```

---

#### Update Coupon (Admin Only)
```http
PUT /coupons/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description",
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon updated successfully",
  "data": {
    "id": "uuid",
    ...
  }
}
```

---

#### Delete Coupon (Admin Only)
```http
DELETE /coupons/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

---

#### Toggle Coupon Status (Admin Only)
```http
PATCH /coupons/:id/toggle-status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon activated successfully",
  "data": {
    "id": "uuid",
    "isActive": true,
    ...
  }
}
```

---

#### Apply Coupon
```http
POST /coupons/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "SAVE20"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "id": "uuid",
    "code": "SAVE20",
    "usedCount": 6,
    ...
  }
}
```

---

#### Get Coupon Statistics (Admin Only)
```http
GET /coupons/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCoupons": 50,
    "activeCoupons": 30,
    "expiredCoupons": 15,
    "totalUsage": 1250
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "code",
      "message": "Coupon code is required"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Access token required"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Coupon not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "Coupon code already exists"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Discount Calculation

### Percentage Discount
```
discountAmount = (purchaseAmount * discount) / 100
if (maxDiscountAmount && discountAmount > maxDiscountAmount) {
  discountAmount = maxDiscountAmount
}
finalAmount = purchaseAmount - discountAmount
```

### Fixed Discount
```
discountAmount = discount
finalAmount = purchaseAmount - discountAmount
```

---

## Coupon Validation Rules

A coupon is valid if:
1. `isActive` is `true`
2. `isDeleted` is `false`
3. Current date is between `startDate` and `endDate`
4. `usedCount < usageLimit` (if `usageLimit` is set)
5. Purchase amount >= `minPurchaseAmount` (if set)

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- Rate limiting middleware
- Request throttling
- API key authentication

