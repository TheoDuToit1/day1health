# Admin Rate Limiting Setup

## Current Implementation

The admin login currently has **client-side rate limiting** using localStorage. This provides basic protection but can be bypassed.

### How It Works Now
- Tracks failed login attempts in browser localStorage
- 5 attempts allowed before 30-minute lockout
- Lockout persists across page refreshes
- **Limitation**: Can be bypassed by clearing localStorage or using different browsers

## To Enable IP-Based Rate Limiting (Recommended)

### For Local Development

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start both servers**:
   ```bash
   # Terminal 1: Start the API server
   npm run api

   # Terminal 2: Start the Vite dev server
   npm run dev
   ```

   Or run both at once:
   ```bash
   npm run dev:all
   ```

3. **Test the admin login**:
   - Navigate to `http://localhost:3000/admin`
   - Try logging in with wrong credentials 5 times
   - Your IP will be blocked for 30 minutes

### How IP-Based Rate Limiting Works

- **Tracks by IP address**: Each IP gets 5 attempts
- **Server-side enforcement**: Cannot be bypassed by clearing browser data
- **30-minute lockout**: After 5 failed attempts
- **Automatic unlock**: Lockout expires after 30 minutes
- **Persistent**: Works across all browsers from the same IP

### For Production (Vercel)

The API endpoints in `/api/admin/` are already configured as Vercel serverless functions and will work automatically when deployed.

## Testing Rate Limiting

### Test 1: Normal Login
```
1. Go to http://localhost:3000/admin
2. Enter correct credentials
3. Should login successfully
```

### Test 2: Failed Attempts
```
1. Go to http://localhost:3000/admin
2. Enter wrong password 5 times
3. On 5th attempt, should see: "Your IP has been temporarily blocked"
4. Login button should be disabled
5. Countdown timer shows seconds remaining
```

### Test 3: Different Device/IP
```
1. On Device A: Fail login 5 times → Locked
2. On Device B (different IP): Should still be able to attempt login
3. On Device A: Still locked until 30 minutes pass
```

## Configuration

### Adjust Rate Limiting Parameters

Edit `server.js`:

```javascript
const MAX_LOGIN_ATTEMPTS = 5;              // Max attempts per IP
const LOCKOUT_DURATION = 30 * 60 * 1000;   // 30 minutes lockout
```

## Current Status

✅ **Client-side rate limiting**: Working (localStorage-based)
⚠️ **IP-based rate limiting**: Available but requires running API server

## Recommendation

For production, use the IP-based rate limiting by:
1. Running `npm run dev:all` during development
2. Deploying to Vercel (API endpoints will work automatically)

The current localStorage implementation is fine for basic protection, but IP-based is more secure.
