import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
// Keep the public Vite app on 3000 and the chatbot on 3001.
// The root admin/email API uses 3002 so all local services can run together.
const PORT = Number(process.env.DAY1_API_PORT || 3002);

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting storage
const rateLimitStore = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || 
         req.headers['x-real-ip'] || 
         req.socket.remoteAddress || 
         'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS };
  }

  // Check if locked
  if (entry.lockedUntil && now < entry.lockedUntil) {
    const retryAfter = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  // Reset if lockout expired
  if (entry.lockedUntil && now >= entry.lockedUntil) {
    rateLimitStore.delete(ip);
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_LOGIN_ATTEMPTS - entry.attempts);
  return { allowed: remaining > 0, remaining };
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    rateLimitStore.set(ip, { attempts: 1, firstAttempt: now });
  } else {
    entry.attempts += 1;
    if (entry.attempts >= MAX_LOGIN_ATTEMPTS) {
      entry.lockedUntil = now + LOCKOUT_DURATION;
    }
  }
}

function resetRateLimit(ip) {
  rateLimitStore.delete(ip);
}

// Check rate limit endpoint
app.get('/api/admin/check-rate-limit', (req, res) => {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp);

    res.json({
      allowed: rateLimit.allowed,
      remaining: rateLimit.remaining,
      retryAfter: rateLimit.retryAfter || null,
      isLocked: !rateLimit.allowed,
    });
  } catch (error) {
    console.error('Rate limit check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIp = getClientIp(req);

    console.log(`Login attempt from IP: ${clientIp}, Email: ${email}`);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check rate limiting
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      console.log(`IP ${clientIp} is rate limited`);
      return res.status(429).json({
        error: 'Too many login attempts from this IP address',
        retryAfter: rateLimit.retryAfter,
        message: `Your IP has been temporarily blocked. Try again in ${Math.ceil((rateLimit.retryAfter || 0) / 60)} minutes.`,
        isLocked: true,
      });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration missing');
      return res.status(500).json({ error: 'Supabase configuration missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Attempt authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      console.log(`Failed login attempt from IP ${clientIp}: ${error?.message}`);
      
      // Record failed attempt
      recordFailedAttempt(clientIp);
      const updatedRateLimit = checkRateLimit(clientIp);

      return res.status(401).json({
        error: 'Invalid email or password',
        remaining: updatedRateLimit.remaining,
        message: `Invalid credentials. ${updatedRateLimit.remaining} attempt${updatedRateLimit.remaining !== 1 ? 's' : ''} remaining from your IP.`,
      });
    }

    // Check if user has admin role
    const userMetadata = data.user.user_metadata || {};
    const isAdmin = userMetadata.role === 'admin' || data.user.email?.endsWith('@day1.co.za');

    if (!isAdmin) {
      console.log(`Non-admin user attempted login: ${data.user.email}`);
      return res.status(403).json({
        error: 'You do not have permission to access the admin panel',
      });
    }

    // Reset rate limit on successful login
    resetRateLimit(clientIp);
    console.log(`Successful login from IP ${clientIp}, Email: ${data.user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: 'admin',
      },
      session: data.session,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Admin API server is running' });
});

app.listen(PORT, () => {
  console.log(`\n🔒 Admin API server running on http://localhost:${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/api/health`);
  console.log(`   - GET  http://localhost:${PORT}/api/admin/check-rate-limit`);
  console.log(`   - POST http://localhost:${PORT}/api/admin/login\n`);
});
