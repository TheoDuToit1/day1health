# IP-Based Rate Limiting Implementation Summary

## What Changed

The admin login now has **server-side, IP-based rate limiting** that prevents brute force attacks by tracking failed login attempts per IP address.

## Key Points

### How It Works
- **Tracks by IP**: Each IP address gets 5 failed login attempts
- **30-minute lockout**: After 5 failures, that IP is blocked for 30 minutes
- **Server-side**: Rate limiting is enforced on the backend (cannot be bypassed)
- **Persistent**: Lockout persists across page refreshes and browser sessions

### Example Scenarios

**Scenario 1: Single attacker, single IP**
```
Attacker IP: 192.168.1.100
Attempt 1: Invalid credentials → 4 attempts remaining
Attempt 2: Invalid credentials → 3 attempts remaining
Attempt 3: Invalid credentials → 2 attempts remaining
Attempt 4: Invalid credentials → 1 attempt remaining
Attempt 5: Invalid credentials → LOCKED for 30 minutes
Attempt 6: Blocked → "Your IP has been temporarily blocked"
```

**Scenario 2: Multiple attackers, different IPs**
```
Attacker A (IP: 192.168.1.100) → Gets 5 attempts, then locked
Attacker B (IP: 192.168.1.101) → Gets independent 5 attempts
Attacker C (IP: 192.168.1.102) → Gets independent 5 attempts
```

**Scenario 3: Legitimate user on same IP as attacker**
```
Attacker (IP: 192.168.1.100) → Fails 5 times → IP locked
Legitimate User (IP: 192.168.1.100) → Cannot login for 30 minutes
(This is a trade-off: security vs. availability)
```

## Files Created/Modified

### New Files
- `pages/api/admin/login.ts` - Backend login endpoint with rate limiting
- `pages/api/admin/check-rate-limit.ts` - Endpoint to check rate limit status
- `src/lib/security/RATE_LIMITING.md` - Detailed documentation

### Modified Files
- `src/admin/ProtectedAdminPage.tsx` - Updated to use backend API
- `src/lib/security/rateLimiter.ts` - Already existed, now used by backend

## How to Test

### Test 1: Check rate limit on page load
```bash
1. Navigate to http://localhost:3001/admin
2. Open browser console
3. Should see rate limit check happening
```

### Test 2: Trigger rate limit
```bash
1. Navigate to http://localhost:3001/admin
2. Enter wrong credentials 5 times
3. On 5th attempt, should see: "Your IP has been temporarily blocked"
4. Login button should be disabled
5. Countdown timer should show seconds remaining
```

### Test 3: Verify IP-based (different browser/device)
```bash
1. On Device A: Fail login 5 times → Locked
2. On Device B (different IP): Should still be able to attempt login
3. On Device A: Still locked until 30 minutes pass
```

## Configuration

To adjust rate limiting parameters, edit `pages/api/admin/login.ts`:

```typescript
const MAX_LOGIN_ATTEMPTS = 5;              // Max attempts per IP
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;  // Time window (15 minutes)
const LOCKOUT_DURATION = 30 * 60 * 1000;   // Lockout duration (30 minutes)
```

## Important Notes

### Advantages
✅ Prevents brute force attacks
✅ Server-side enforcement (secure)
✅ Persistent across sessions
✅ Protects all admin accounts
✅ Automatic unlock after timeout

### Limitations
⚠️ Blocks entire IP (affects all users on that IP)
⚠️ In-memory storage (resets on server restart)
⚠️ Not distributed (doesn't work across multiple servers)

### Production Recommendations

1. **Use Redis**: Replace in-memory storage with Redis for multiple servers
2. **Add Logging**: Log all rate limit events for security audit
3. **Email Alerts**: Notify admins of suspicious activity
4. **Whitelist IPs**: Allow known admin IPs to bypass rate limiting
5. **Add CAPTCHA**: After 3 failed attempts
6. **Enable 2FA**: Two-factor authentication for extra security

## API Endpoints

### POST /api/admin/login
Handles login with rate limiting

**Success (200):**
```json
{
  "success": true,
  "user": { "id": "...", "email": "...", "role": "admin" },
  "session": { ... }
}
```

**Rate Limited (429):**
```json
{
  "error": "Too many login attempts from this IP address",
  "retryAfter": 1800,
  "isLocked": true
}
```

**Invalid Credentials (401):**
```json
{
  "error": "Invalid email or password",
  "remaining": 3
}
```

### GET /api/admin/check-rate-limit
Checks if current IP is rate limited

**Response:**
```json
{
  "allowed": true,
  "remaining": 5,
  "retryAfter": null,
  "isLocked": false
}
```

## Next Steps

1. Test the implementation thoroughly
2. Monitor for false positives (legitimate users getting blocked)
3. Consider adding Redis for production
4. Add email notifications for suspicious activity
5. Implement 2FA for additional security
