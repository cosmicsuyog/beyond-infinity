# 🔐 Authentication API Documentation

## Overview
The authentication system uses **OTP (One-Time Password)** based login. The flow is:
1. **Send OTP** → User receives OTP via email
2. **Verify OTP** → User verifies OTP and gets JWT token
3. **Access Protected Routes** → Use JWT token in cookies
4. **Logout** → Blacklist token and clear cookies

---

## Endpoints

### 1. **Send OTP**
**Endpoint:** `POST /auth/send-otp`  
**Access:** Public  
**Description:** Send OTP to user's email. Creates user if doesn't exist.

#### Request Body:
```json
{
  "email": "user@example.com",
  "name": "John Doe",           // Optional
  "role": "employee",           // Optional: "admin" or "employee"
  "avatar": "https://..."       // Optional: Valid URL
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "data": {
    "email": "user@example.com"
  }
}
```

#### Error Responses:
- **400 Bad Request** - Invalid email format
- **403 Forbidden** - Account is disabled
- **429 Too Many Requests** - Rate limit (wait 30 seconds between requests)
- **500 Server Error** - Failed to send OTP

#### Validation Rules:
- `email` (required): Valid email format
- `name` (optional): 2-50 characters
- `role` (optional): "admin" or "employee"
- `avatar` (optional): Valid URL format

---

### 2. **Verify OTP**
**Endpoint:** `POST /auth/verify-otp`  
**Access:** Public  
**Description:** Verify OTP and login user. Returns JWT token.

#### Request Body:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Success Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "employee",
      "avatar": "https://...",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses:
- **400 Bad Request** - Invalid OTP format or OTP not sent
- **400 Bad Request** - OTP expired
- **400 Bad Request** - Invalid OTP with attempts left
- **403 Forbidden** - Maximum OTP attempts exceeded
- **404 Not Found** - User not found
- **500 Server Error** - Verification failed

#### Validation Rules:
- `email` (required): Valid email format
- `otp` (required): Exactly 6 numeric digits

#### Important Notes:
- OTP expires after **5 minutes**
- Maximum **5 failed attempts** allowed
- After max attempts, user must request new OTP
- JWT token is set in HttpOnly cookie (7 days expiry)

---

### 3. **Get Current User**
**Endpoint:** `GET /auth/me`  
**Access:** Private (Requires Authentication)  
**Description:** Get details of currently authenticated user.

#### Headers Required:
- `Authorization: Bearer <token>` OR
- Cookie: `token=<jwt_token>`

#### Success Response (200):
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "employee",
      "avatar": "https://...",
      "isVerified": true,
      "lastLogin": "2024-04-30T10:30:00.000Z",
      "createdAt": "2024-04-28T14:22:15.000Z"
    }
  }
}
```

#### Error Responses:
- **401 Unauthorized** - Invalid or missing token
- **404 Not Found** - User not found
- **500 Server Error** - Failed to fetch user

---

### 4. **Logout**
**Endpoint:** `POST /auth/logout`  
**Access:** Private (Requires Authentication)  
**Description:** Logout user by blacklisting token and clearing cookie.

#### Headers Required:
- `Authorization: Bearer <token>` OR
- Cookie: `token=<jwt_token>`

#### Success Response (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Error Responses:
- **401 Unauthorized** - Token missing
- **500 Server Error** - Logout failed

#### Important Notes:
- Token is blacklisted in Redis for 7 days (JWT expiry)
- Cookie is cleared from client
- User cannot use old token after logout

---

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   CLIENT APPLICATION                         │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
             ┌──────────────────────────┐
             │   1. Send OTP            │
             │   POST /auth/send-otp    │
             │   Body: {email, name}    │
             └──────────────────────────┘
                          │
                          ▼ (User receives OTP email)
             ┌──────────────────────────┐
             │  2. Verify OTP           │
             │  POST /auth/verify-otp   │
             │  Body: {email, otp}      │
             └──────────────────────────┘
                          │
                          ▼ (JWT set in HttpOnly cookie)
             ┌──────────────────────────┐
             │  3. Access Protected     │
             │  GET /auth/me            │
             │  Cookie: token=jwt       │
             └──────────────────────────┘
                          │
                          ▼
             ┌──────────────────────────┐
             │  4. Logout               │
             │  POST /auth/logout       │
             │  Cookie: token=jwt       │
             └──────────────────────────┘
```

---

## Constants & Configuration

| Constant | Value | Description |
|----------|-------|-------------|
| OTP_LENGTH | 6 | OTP is 6 digits |
| OTP_EXPIRY | 5 minutes | OTP valid for 5 minutes |
| RATE_LIMIT | 30 seconds | Minimum time between OTP requests |
| MAX_OTP_ATTEMPTS | 5 | Maximum failed OTP verification attempts |
| JWT_EXPIRY | 7 days | JWT token valid for 7 days |
| COOKIE_SECURE | true | Cookie sent only over HTTPS |
| COOKIE_HTTPONLY | true | Cookie inaccessible to JavaScript |
| COOKIE_SAMESITE | Strict | CSRF protection enabled |

---

## Error Handling Best Practices

### Response Format:
All errors follow this format:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [/* optional validation errors */],
  "attemptsLeft": 3,  // optional, for OTP verification
  "retryAfter": 15    // optional, for rate limiting
}
```

### HTTP Status Codes:
- `200` - Success
- `400` - Validation or logic error (invalid input, expired OTP, etc.)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (account disabled, max attempts exceeded)
- `404` - Not found (user not found)
- `429` - Too many requests (rate limited)
- `500` - Server error

---

## Security Features

✅ **OTP Security:**
- OTP hashed using SHA-256 before storage
- Timing-safe comparison to prevent timing attacks
- Automatic expiry after 5 minutes

✅ **JWT Security:**
- Signed with HS256 algorithm
- HttpOnly cookie (prevents XSS)
- Secure flag (HTTPS only)
- SameSite=Strict (prevents CSRF)

✅ **Rate Limiting:**
- 30-second cooldown between OTP requests
- Maximum 5 failed OTP attempts

✅ **Token Blacklisting:**
- Logout blacklists token in Redis
- Prevents reuse of old tokens

---

## Example Usage

### JavaScript/Fetch:
```javascript
// 1. Send OTP
const response = await fetch('/auth/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe'
  })
});

// 2. Verify OTP
const loginResponse = await fetch('/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Include cookies
  body: JSON.stringify({
    email: 'user@example.com',
    otp: '123456'
  })
});

// 3. Get User
const userResponse = await fetch('/auth/me', {
  credentials: 'include' // Send cookie
});

// 4. Logout
const logoutResponse = await fetch('/auth/logout', {
  method: 'POST',
  credentials: 'include'
});
```

---

## Troubleshooting

### Issue: "OTP rate limited"
- **Solution:** Wait 30 seconds before requesting another OTP

### Issue: "OTP expired"
- **Solution:** Request a new OTP using `/auth/send-otp`

### Issue: "Maximum OTP attempts exceeded"
- **Solution:** Request a new OTP using `/auth/send-otp` (resets attempts)

### Issue: "Token missing" on logout
- **Solution:** Ensure token cookie is present in request

### Issue: "User not found" on GET /me
- **Solution:** Token may be invalid or user was deleted

---

## File Structure
```
src/
  controllers/
    auth.controller.js          # Auth controllers
  routes/
    auth.routes.js              # Auth routes
  validators/
    auth.validator.js           # Express-validator rules
  constants/
    auth.constants.js           # Constants & messages
  utils/
    OtpSystem/
      generateOTP.js            # OTP generation & verification
    auth/
      auth.errors.js            # Custom error classes
  middleware/
    auth.middleware.js          # JWT verification middleware
  models/
    user.model.js               # User schema
  services/
    mail/
      mail.service.js           # Email service
```

---

## Changelog

### v2.0 (Current - Scalable)
✅ Separate routes for send-otp and verify-otp  
✅ Improved error messages with constants  
✅ Rate limiting with retry suggestions  
✅ Attempts tracking  
✅ Better validation  
✅ Comprehensive documentation  

### v1.0 (Legacy - Issues)
❌ Mixed register and OTP in single endpoint  
❌ No separate send/verify routes  
❌ Hardcoded magic numbers  
❌ Generic error messages  

---

**Last Updated:** April 30, 2024  
**API Version:** 2.0  
**Status:** Production Ready ✅
