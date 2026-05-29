import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Rate limiting storage (in-memory for now)
const rateLimitStore = new Map<string, { attempts: number; firstAttempt: number; lockedUntil?: number }>();

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfter?: number } {
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

function recordFailedAttempt(ip: string): void {
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

function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    const clientIp = getClientIp(req);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check rate limiting
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
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
      return res.status(500).json({ error: 'Supabase configuration missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Attempt authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
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
      return res.status(403).json({
        error: 'You do not have permission to access the admin panel',
      });
    }

    // Reset rate limit on successful login
    resetRateLimit(clientIp);

    return res.status(200).json({
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
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
