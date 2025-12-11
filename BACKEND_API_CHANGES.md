# Backend API Changes Documentation

**Version:** 1.0  
**Last Updated:** 2025-11-29  
**Purpose:** Document all backend API changes for frontend integration

---

## ⚠️ CRITICAL: Frontend to Backend URL Mapping

**Your frontend is currently using `/api/auth/*` but backend uses `/api/v1/users/*`**

| Frontend URL (Current) | Backend URL (Actual) | Status |
|------------------------|---------------------|--------|
| `/api/v1/users/register/` | `/api/v1/users/register/` | ❌ Update needed |
| `/api/v1/users/login/` | `/api/v1/users/login/` | ❌ Update needed |
| `/api/auth/forgot-password` | `/api/v1/users/password-reset/request/` | ❌ Update needed |
| `/api/auth/reset-password` | `/api/v1/users/password-reset/confirm/` | ❌ Update needed |
| `/api/auth/verify-email` | `/api/v1/users/verify-email/` | ❌ Update needed |
| `/api/v1/users/profile/` | `/api/v1/users/profile/` | ❌ Update needed |

**Action Required:** Update your frontend API base URL or update all auth API calls to use `/api/v1/users/` instead of `/api/auth/`

---

## Table of Contents
- [Removed Endpoints](#removed-endpoints)
- [New Endpoints](#new-endpoints)
- [Modified Endpoints](#modified-endpoints)
- [Flow Changes](#flow-changes)
- [Email Template Updates](#email-template-updates)

---

## Removed Endpoints

### ❌ DELETE `/api/old-endpoint`
**Status:** DEPRECATED  
**Reason:** Replaced by new endpoint structure  
**Migration:** Use `/api/new-endpoint` instead

---

## New Endpoints

### ✅ POST `/api/v1/users/verify-email/`

**Description:** Verify user email address with OTP

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully"
},
  "data": {
    "user": {
      "id": "user_abc123",
      "email": "user@example.com",
      "emailVerified": true,
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid OTP",
  "message": "The OTP you entered is incorrect or has expired"
}
```

---

### ✅ POST `/api/v1/users/resend-verification/`

**Description:** Resend email verification OTP

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Verification email sent successfully",
  "data": {
    "expiresIn": 600,
    "sentAt": "2025-11-29T19:00:00Z"
  }
}
```

**Response (429 Too Many Requests):**
```json
{
  "success": false,
  "error": "Too many requests",
  "message": "Please wait 60 seconds before requesting another OTP",
  "retryAfter": 60
}
```

---

### ✅ GET `/api/v1/users/profile/`

**Description:** Get authenticated user profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "user_abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "emailVerified": true,
    "createdAt": "2025-01-15T10:30:00Z",
    "addresses": [
      {
        "id": "addr_123",
        "type": "shipping",
        "fullName": "John Doe",
        "addressLine1": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "US",
        "isDefault": true
      }
    ]
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

## Modified Endpoints

### 🔄 POST `/api/v1/users/register/`

**Changes:**
- Added `referralCode` field (optional)
- Added email verification flow
- Response now includes `emailVerificationRequired` flag

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "phoneNumber": "+1234567890",
  "password": "SecurePass123!",
  "referralCode": "REF123" // NEW: Optional referral code
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "user_abc123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "emailVerified": false // NEW: Email verification status
    },
    "emailVerificationRequired": true, // NEW: Frontend should redirect to verification
    "verificationEmailSent": true
  }
}
```

**Response (422 Validation Error):**
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "email": ["Email already exists"],
    "password": ["Password must be at least 8 characters"],
    "phoneNumber": ["Invalid phone number format"]
  }
}
```

---

### 🔄 POST `/api/v1/users/login/`

**Changes:**
- Returns `emailVerified` status
- Blocks login if email not verified

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_abc123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "emailVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

**Response (403 Forbidden - Email Not Verified):** // NEW
```json
{
  "success": false,
  "error": "Email not verified",
  "message": "Please verify your email before logging in",
  "emailVerificationRequired": true,
  "email": "user@example.com"
}
```

---

### 🔄 POST `/api/v1/users/password-reset/request/`

**Changes:**
- Now sends OTP instead of link
- Returns OTP expiry time

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent to email if it exists"
}
```

---

### 🔄 POST `/api/v1/users/password-reset/confirm/`

**Changes:**
- Now requires OTP verification
- Added `otp` field to request

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "new_password": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Invalid or expired OTP"
}
```

---

## Flow Changes

### 1. Registration Flow (UPDATED)

**Old Flow:**
```
Register → Email Sent → Manual verification link click → Login
```

**New Flow:**
```
Register → OTP sent to email → Enter OTP on verification page → Auto-login
```

**Frontend Changes Required:**
- After successful registration, redirect to `/verify-email` page
- Pass email to verification page via query param or state
- Show OTP input (6 digits)
- Add "Resend OTP" button with countdown timer
- Auto-login after successful verification

---

### 2. Password Reset Flow (UPDATED)

**Old Flow:**
```
Forgot Password → Email link → New password page → Login
```

**New Flow:**
```
Forgot Password → OTP sent → Enter email + OTP + new password on same page → Success
```

**Frontend Changes Required:**
- Update reset password page to include OTP field
- Keep all fields on same page (no separate link)
- Add OTP validation
- Show OTP expiry countdown
- Add "Resend OTP" functionality

---

### 3. Login Flow (UPDATED)

**New Behavior:**
- If email not verified, block login and show verification prompt
- Frontend should check `emailVerificationRequired` in error response
- Redirect to verification page if needed

**Frontend Changes Required:**
```javascript
// Handle login response
if (response.error === 'Email not verified') {
  // Redirect to verification page
  router.push(`/verify-email?email=${encodeURIComponent(response.email)}`);
}
```

---

## Email Template Updates

### Email Verification Template

**Template:** `verify_email.html`

**Changes:**
- Removed verification link button
- Added OTP display (6-digit code)
- Updated copy for OTP-based verification

**Variables:**
```javascript
{
  "userName": "John Doe",
  "userEmail": "user@example.com",
  "otp": "123456",
  "expiryMinutes": 10,
  "companyName": "GetMeThis",
  "supportEmail": "support@getmethis.com"
}
```

---

### Password Reset Template

**Template:** `reset_password.html`

**Changes:**
- Removed reset password link
- Added OTP display
- Instructions to use OTP on reset page

**Variables:**
```javascript
{
  "userName": "John Doe",
  "otp": "123456",
  "expiryMinutes": 10,
  "resetUrl": "https://getmethis.in/reset-password",
  "supportEmail": "support@getmethis.in"
}
```

---

## Breaking Changes Summary

⚠️ **CRITICAL CHANGES - Frontend Update Required:**

1. **Registration:** Must handle email verification flow
2. **Login:** Must handle email verification check
3. **Password Reset:** Must include OTP field
4. **All Auth Forms:** Update error handling for new response format

---

## Migration Checklist for Frontend

- [ ] Update registration flow to handle email verification
- [ ] Create/update email verification page with OTP input
- [ ] Add OTP field to password reset page
- [ ] Update login error handling for unverified emails
- [ ] Implement "Resend OTP" functionality
- [ ] Add OTP countdown timers
- [ ] Update API client to handle new response formats
- [ ] Test all auth flows end-to-end
- [ ] Update error messages to match new backend responses

---

## Testing Endpoints

**Base URL:** `https://getmethis.in` (Production)  
**Base URL:** `http://localhost:8000` (Development)

**Test Credentials:**
```
Email: test@example.com
Password: TestPass123!
OTP (development): 123456
```

---

## Need Help?

- **Backend Team:** backend@getmethis.in
- **API Documentation:** https://getmethis.in/api
- **Slack Channel:** #api-changes
