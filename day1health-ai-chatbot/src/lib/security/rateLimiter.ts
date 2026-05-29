/**
 * In-memory rate limiter for login attempts and API calls
 * In production, use Redis for distributed rate limiting
 */

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
  locked: boolean;
  lockedUntil?: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup old entries every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Check if an identifier is rate limited
   */
  isLimited(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry) {
      return false;
    }

    // Check if account is locked
    if (entry.locked && entry.lockedUntil && now < entry.lockedUntil) {
      return true;
    }

    // Reset if outside the time window
    if (now - entry.firstAttempt > windowMs) {
      this.store.delete(identifier);
      return false;
    }

    return entry.attempts >= maxAttempts;
  }

  /**
   * Record an attempt
   */
  recordAttempt(identifier: string, maxAttempts: number = 5, lockoutDurationMs: number = 30 * 60 * 1000): void {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry) {
      this.store.set(identifier, {
        attempts: 1,
        firstAttempt: now,
        lastAttempt: now,
        locked: false,
      });
    } else {
      entry.attempts += 1;
      entry.lastAttempt = now;

      // Lock account after max attempts
      if (entry.attempts >= maxAttempts) {
        entry.locked = true;
        entry.lockedUntil = now + lockoutDurationMs;
      }
    }
  }

  /**
   * Reset attempts for an identifier
   */
  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(identifier: string, maxAttempts: number = 5): number {
    const entry = this.store.get(identifier);
    if (!entry) {
      return maxAttempts;
    }
    return Math.max(0, maxAttempts - entry.attempts);
  }

  /**
   * Get lockout time remaining (in milliseconds)
   */
  getLockoutTimeRemaining(identifier: string): number {
    const entry = this.store.get(identifier);
    if (!entry || !entry.locked || !entry.lockedUntil) {
      return 0;
    }

    const remaining = entry.lockedUntil - Date.now();
    return Math.max(0, remaining);
  }

  /**
   * Cleanup old entries
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour

    for (const [key, entry] of this.store.entries()) {
      if (now - entry.lastAttempt > maxAge) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Destroy the rate limiter
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Helper function to check rate limit and throw error if limited
 */
export const checkRateLimit = (
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfter?: number } => {
  const isLimited = rateLimiter.isLimited(identifier, maxAttempts, windowMs);
  const remaining = rateLimiter.getRemainingAttempts(identifier, maxAttempts);
  const lockoutTime = rateLimiter.getLockoutTimeRemaining(identifier);

  return {
    allowed: !isLimited,
    remaining,
    retryAfter: lockoutTime > 0 ? Math.ceil(lockoutTime / 1000) : undefined,
  };
};
