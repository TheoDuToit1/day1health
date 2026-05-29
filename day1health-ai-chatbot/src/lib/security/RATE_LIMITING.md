# Rate Limiting Implementation

## Overview

The admin login page now includes **IP-based server-side rate limiting** to prevent brute force attacks. This implementation protects against unauthorized access attempts by limiting the number of failed login attempts per IP address.

## Features

### IP-Based Rate Limiting
- **Tracking**: Limits are tracked by IP address, not per-browser or per-user
- **Maximum Attempts**: 5 failed login attempts allowed per IP
- **Lockout Duration**: 30 minutes after exceeding max attempts
- **Attempt Counter**: Displays remaining attempts to the user
- **Countdown Timer**: Shows time remaining until IP unlock
- **Server-Side Enforcement**: Rate limiting is enforced on the backend

### How It Works

1. **Page Load**: Frontend checks if the user's IP is rate limited
2. **Login Attempt**: Frontend sends credentials to `/api/admin/login`
3. **Backend Validation**: Server checks IP rate limit before processing
4. **Failed Attempt**: 
   - Server records attempt for that IP
   - Returns remaining attempts
   - Frontend displays error with countdown
5. **Lockout**: After 5 failures, IP is blocked for 30 minutes
6. **Successful Login**: IP rate limit is reset

### Security Benefits

✅ **IP-Based Tracking**: Prevents attackers from bypassing limits with different browsers
✅ **Server-Side Enforcement**: Cannot be bypassed by client-side manipulation
✅ **Persistent Across Sessions**: Lockout persists even if page is refreshed
✅ **Blocks All Accounts**: Protects all admin accounts from brute force on that IP
✅ **Automatic Unlock**: Lockout expires after 30 minutes

## Implementation Details

### Backend API Endpoints

#### `/api/admin/login` (POST)
Handles login with rate limiting

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user-id",
    "email": "admin@example.com",
    "role": "admin"
  },
  "session": { ... }
}
```

**Response (Rate Limited - 429):**
```json
{
  "error": "Too many login attempts from this IP address",
  "retryAfter": 1800,
  "message": "Your IP has been temporarily blocked. Try again in 30 minutes.",
  "isLocked": true
}
```

**Response (Invalid Credentials - 401):**
```json
{
  "error": "Invalid email or password",
  "remaining": 3,
  "message": "Invalid credentials. 3 attempts remaining from your IP."
}
```

#### `/api/admin/check-rate-limit` (GET)
Checks current rate limit status for the user's IP

**Response:**
```json
{
  "allowed": true,
  "remaining": 5,
  "retryAfter": null,
  "isLocked": false
}
```

### Rate Limiter Utility

The `rateLimiter` singleton in `src/lib/security/rateLimiter.ts` manages:
- In-memory storage of rate limit entries
- Automatic cleanup of old entries (every 5 minutes)
- Per-IP attempt tracking
- Lockout management with expiration

### Frontend Flow

1. **Page Load**: Calls `/api/admin/check-rate-limit` to check status
2. **If Locked**: Shows error and starts countdown timer
3. **If Not Locked**: Shows login form with remaining attempts
4. **On Submit**: Calls `/api/admin/login` with credentials
5. **On Failure**: Updates remaining attempts and shows error
6. **On Success**: Resets rate limit and authenticates user

## User Experience

### Normal Login
```
User enters credentials → Click Login → Success → Redirected to admin panel
```

### Failed Attempt (1-4 failures)
```
User enters wrong credentials → Error: "Invalid credentials. 4 attempts remaining from your IP."
```

### Account Locked (5+ failures)
```
User fails 5 times → Error: "Your IP has been temporarily blocked. Try again in 1800 seconds."
→ Login button disabled
→ Countdown timer shows: "1799 seconds remaining..."
→ After 30 minutes → Lockout expires, counter resets to 5
```

## Security Considerations

### What This Protects Against
- ✅ Brute force attacks on admin accounts
- ✅ Dictionary attacks
- ✅ Credential stuffing
- ✅ Automated login attempts

### What This Does NOT Protect Against
- ❌ Compromised credentials (use strong passwords)
- ❌ Phishing attacks
- ❌ Session hijacking (use HTTPS only)
- ❌ Attacks from multiple IPs (would need additional measures)

### Production Recommendations

1. **Use Redis**: Replace in-memory storage with Redis for distributed systems
2. **Add Logging**: Log all rate limit events for security monitoring
3. **Email Alerts**: Notify admins of suspicious activity
4. **CAPTCHA**: Add CAPTCHA after 3 failed attempts
5. **2FA**: Implement two-factor authentication
6. **IP Whitelist**: Consider whitelisting known admin IPs
7. **VPN/Proxy Detection**: Detect and handle VPN/proxy traffic

## Testing

### Test Scenarios

1. **Valid Credentials**: Should login successfully
2. **Invalid Credentials (1-4 times)**: Should show remaining attempts
3. **Invalid Credentials (5 times)**: Should lock IP for 30 minutes
4. **Page Refresh During Lockout**: Should maintain lockout status
5. **Different IP**: Should have independent rate limit
6. **Successful Login After Failure**: Should reset counter

### Manual Testing

```bash
# Test 1: Valid login
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@day1.co.za","password":"correct-password"}'

# Test 2: Invalid login (repeat 5 times)
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@day1.co.za","password":"wrong-password"}'

# Test 3: Check rate limit status
curl http://localhost:3001/api/admin/check-rate-limit
```

## Configuration

### Adjustable Parameters

In `/pages/api/admin/login.ts`:

```typescript
const MAX_LOGIN_ATTEMPTS = 5;              // Change to adjust max attempts
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;  // 15 minutes - time window for attempts
const LOCKOUT_DURATION = 30 * 60 * 1000;   // 30 minutes - lockout duration
```

## Files

- `pages/api/admin/login.ts` - Login endpoint with rate limiting
- `pages/api/admin/check-rate-limit.ts` - Rate limit status check
- `src/lib/security/rateLimiter.ts` - Rate limiter utility
- `src/admin/ProtectedAdminPage.tsx` - Frontend login component
- `src/lib/security/RATE_LIMITING.md` - This documentation

## Future Enhancements

1. **Redis Integration**: For distributed rate limiting across multiple servers
2. **Database Logging**: Store rate limit events in database for audit trail
3. **Adaptive Rate Limiting**: Adjust limits based on threat level
4. **Geographic Blocking**: Block logins from suspicious locations
5. **Device Fingerprinting**: Track devices in addition to IPs
6. **Anomaly Detection**: Detect unusual login patterns
