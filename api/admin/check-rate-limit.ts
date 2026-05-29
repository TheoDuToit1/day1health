import { VercelRequest, VercelResponse } from '@vercel/node';

// Import the same rate limit store (this is a simplified version)
// In production, use Redis or a database
const rateLimitStore = new Map<string, { attempts: number; firstAttempt: number; lockedUntil?: number }>();

const MAX_LOGIN_ATTEMPTS = 5;

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientIp = getClientIp(req);
    const now = Date.now();
    const entry = rateLimitStore.get(clientIp);

    if (!entry) {
      return res.status(200).json({
        allowed: true,
        remaining: MAX_LOGIN_ATTEMPTS,
        retryAfter: null,
        isLocked: false,
      });
    }

    // Check if locked
    if (entry.lockedUntil && now < entry.lockedUntil) {
      const retryAfter = Math.ceil((entry.lockedUntil - now) / 1000);
      return res.status(200).json({
        allowed: false,
        remaining: 0,
        retryAfter,
        isLocked: true,
      });
    }

    // Reset if lockout expired
    if (entry.lockedUntil && now >= entry.lockedUntil) {
      rateLimitStore.delete(clientIp);
      return res.status(200).json({
        allowed: true,
        remaining: MAX_LOGIN_ATTEMPTS,
        retryAfter: null,
        isLocked: false,
      });
    }

    const remaining = Math.max(0, MAX_LOGIN_ATTEMPTS - entry.attempts);
    return res.status(200).json({
      allowed: remaining > 0,
      remaining,
      retryAfter: null,
      isLocked: false,
    });
  } catch (error) {
    console.error('Rate limit check error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
