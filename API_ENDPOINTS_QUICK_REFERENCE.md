# API Endpoints Quick Reference

## Base URL
```
http://localhost:3001/api
```

## Validate Coupon Endpoint

**Method:** `POST` (not GET!)

**URL:** 
```
POST http://localhost:3001/api/coupons/validate
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "code": "SAVE20",
  "amount": 100
}
```

**Example using cURL:**
```bash
curl -X POST http://localhost:3001/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVE20","amount":100}'
```

**Example using Postman:**
1. Method: **POST** (not GET!)
2. URL: `http://localhost:3001/api/coupons/validate`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "code": "SAVE20",
     "amount": 100
   }
   ```

**Success Response:**
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

**Error Response:**
```json
{
  "success": false,
  "valid": false,
  "message": "Coupon has expired"
}
```

## Common Issues

### "Route not found" Error

**Possible causes:**
1. ❌ Using GET instead of POST
   - **Fix:** Use POST method
   
2. ❌ Wrong URL
   - **Wrong:** `GET /api/coupons/validate`
   - **Correct:** `POST /api/coupons/validate`
   
3. ❌ Missing Content-Type header
   - **Fix:** Add `Content-Type: application/json`

4. ❌ Server not running
   - **Fix:** Start backend: `npm run dev` in backend folder

### Testing the Endpoint

**Quick Test:**
```bash
# Test with cURL
curl -X POST http://localhost:3001/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"TEST20","amount":100}'
```

**Expected Response:**
- If coupon exists and is valid: `{"success": true, "valid": true, ...}`
- If coupon doesn't exist: `{"success": false, "valid": false, "message": "Coupon not found"}`
- If route not found: `{"success": false, "message": "Route not found"}`

## All Endpoints

### Public (No Auth Required)
- `POST /api/coupons/validate` - Validate coupon
- `GET /api/coupons/code/:code` - Get coupon by code

### Protected (Auth Required)
- `GET /api/coupons` - Get all coupons
- `GET /api/coupons/:id` - Get coupon by ID
- `POST /api/coupons/apply` - Apply coupon

### Admin Only
- `POST /api/coupons` - Create coupon
- `PUT /api/coupons/:id` - Update coupon
- `DELETE /api/coupons/:id` - Delete coupon
- `PATCH /api/coupons/:id/toggle-status` - Toggle status
- `GET /api/coupons/stats` - Get statistics



