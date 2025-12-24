# Postman Collection Setup Guide

## Import Collection

1. **Open Postman**
2. **Click "Import"** button (top left)
3. **Select "File"** tab
4. **Choose** `Coupon_API.postman_collection.json`
5. **Click "Import"**

## Collection Variables

The collection uses these variables:

- `base_url` - Default: `http://localhost:3001`
- `auth_token` - Automatically set after login

### Update Base URL (if needed)

1. Click on collection name: **"Coupon Management API"**
2. Go to **"Variables"** tab
3. Update `base_url` if your server runs on different port/host
4. Click **"Save"**

## Authentication Setup

### Automatic Token Management

The collection is configured to automatically save the authentication token:

1. **Run "Login" request** first
2. Token will be automatically saved to `auth_token` variable
3. All other requests will use this token automatically

### Manual Token Setup (if needed)

1. Run **"Login"** request
2. Copy the `token` from response
3. Click on collection → **Variables** tab
4. Paste token in `auth_token` value
5. Click **"Save"**

## Using the Collection

### Step 1: Health Check
- Run **"Health Check"** to verify server is running

### Step 2: Login
- Run **"Login"** request
- Check response - should return token
- Token is automatically saved

### Step 3: Use Other Endpoints
- All other requests will use the saved token
- No need to manually add Authorization header

## Request Examples

### Create Coupon

**Full Example:**
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

**Minimal Example:**
```json
{
    "code": "TEST20",
    "discount": 20,
    "discountType": "percentage",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z",
    "isActive": true
}
```

### Update Coupon

**Partial Update:**
```json
{
    "description": "Updated description",
    "isActive": false
}
```

## Endpoints Included

### Authentication
- ✅ Login (auto-saves token)

### Coupons
- ✅ Get All Coupons (with filters)
- ✅ Get Coupon by ID
- ✅ Get Coupon by Code
- ✅ Validate Coupon (public)
- ✅ Create Coupon (3 examples)
- ✅ Update Coupon
- ✅ Delete Coupon
- ✅ Toggle Status
- ✅ Apply Coupon
- ✅ Get Statistics

### Health
- ✅ Health Check

## Tips

1. **Always login first** - Token is required for most endpoints
2. **Use variables** - Replace `:id` with actual coupon UUID
3. **Check responses** - Success responses include `success: true`
4. **Error handling** - Errors include `success: false` and `message`

## Testing Workflow

1. **Health Check** → Verify server
2. **Login** → Get token
3. **Create Coupon** → Create test coupon
4. **Get All Coupons** → Verify creation
5. **Validate Coupon** → Test validation
6. **Update Coupon** → Modify coupon
7. **Toggle Status** → Change active status
8. **Apply Coupon** → Increment usage
9. **Get Statistics** → View stats
10. **Delete Coupon** → Remove coupon

## Environment Variables (Optional)

You can create a Postman Environment for different setups:

### Development Environment
```
base_url: http://localhost:3001
```

### Production Environment
```
base_url: https://api.yourdomain.com
```

## Troubleshooting

### "Unauthorized" Error
- Run **Login** request again
- Check if token is saved in collection variables
- Verify token hasn't expired

### "Not Found" Error
- Check `base_url` variable
- Verify server is running
- Check endpoint path is correct

### "Validation Failed" Error
- Check request body format
- Verify all required fields are present
- Check date format (ISO 8601)

## Collection Features

- ✅ Automatic token management
- ✅ Pre-configured headers
- ✅ Example requests
- ✅ Query parameters
- ✅ Path variables
- ✅ Request descriptions
- ✅ Organized folders

## Export/Share

To share the collection:
1. Right-click collection name
2. Select **"Export"**
3. Choose **"Collection v2.1"**
4. Save and share the JSON file

