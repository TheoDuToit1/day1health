import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { hasSupabaseEnv, supabase, supabaseConfigError } from './supabaseClient';
import { Loader, LogOut, AlertCircle } from 'lucide-react';

interface RateLimitData {
  attempts: number;
  firstAttempt: number;
  locked: boolean;
  lockedUntil?: number;
}

type AdminRole = 'claims' | 'it_manager';

const IT_MANAGER_EMAIL = 'day1healthdeveloper@gmail.com';
const IT_MANAGER_PASSWORD = 'day1health';

const resolveRoleForEmail = (email?: string | null): AdminRole => {
  return email?.trim().toLowerCase() === IT_MANAGER_EMAIL.toLowerCase() ? 'it_manager' : 'claims';
};

const ProtectedAdminPage: React.FC = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<AdminRole>('claims');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const getClientIdentifier = (): string => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      const screen = `${window.screen.width}x${window.screen.height}`;
      return `${ua}-${screen}`.substring(0, 50);
    }
    return 'unknown';
  };

  const getRateLimitData = (): RateLimitData | null => {
    if (typeof window === 'undefined') return null;
    try {
      const key = `rate_limit_${getClientIdentifier()}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Error reading rate limit data:', err);
      return null;
    }
  };

  const saveRateLimitData = (data: RateLimitData): void => {
    if (typeof window === 'undefined') return;
    try {
      const key = `rate_limit_${getClientIdentifier()}`;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error('Error saving rate limit data:', err);
    }
  };

  const clearRateLimitData = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`rate_limit_${getClientIdentifier()}`);
  };

  const checkRateLimit = (): void => {
    const rateLimitData = getRateLimitData();
    if (!rateLimitData) {
      setRemainingAttempts(5);
      setIsLocked(false);
      return;
    }

    const now = Date.now();
    const rateLimitWindow = 15 * 60 * 1000;

    if (now - rateLimitData.firstAttempt > rateLimitWindow) {
      clearRateLimitData();
      setRemainingAttempts(5);
      setIsLocked(false);
      return;
    }

    if (rateLimitData.locked && rateLimitData.lockedUntil) {
      if (now < rateLimitData.lockedUntil) {
        setIsLocked(true);
        const remaining = Math.ceil((rateLimitData.lockedUntil - now) / 1000);
        setLockoutTimeRemaining(remaining);
        setRemainingAttempts(0);
      } else {
        clearRateLimitData();
        setIsLocked(false);
        setRemainingAttempts(5);
      }
    } else {
      const remaining = Math.max(0, 5 - rateLimitData.attempts);
      setRemainingAttempts(remaining);
      setIsLocked(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!hasSupabaseEnv) {
        setLoading(false);
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const role = resolveRoleForEmail(session.user.email);
          setUser({ ...session.user, role, authType: 'supabase' });
          setIsAuthenticated(true);
          setSelectedRole(role);
        }

        checkRateLimit();
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    if (!hasSupabaseEnv) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = resolveRoleForEmail(session.user.email);
        setUser({ ...session.user, role, authType: 'supabase' });
        setIsAuthenticated(true);
        setSelectedRole(role);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleSuccessfulLogin = (nextUser: any, role: AdminRole) => {
    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.focus();
      }
    }, 100);

    clearRateLimitData();

    setTimeout(() => {
      setUser(nextUser);
      setSelectedRole(role);
      setIsAuthenticated(true);
      setEmail('');
      setPassword('');
      setIsLoggingIn(false);
      setRemainingAttempts(5);
    }, 3000);
  };

  const handleFailedLogin = (message?: string) => {
    const rateLimitData = getRateLimitData() || {
      attempts: 0,
      firstAttempt: Date.now(),
      locked: false,
    };

    rateLimitData.attempts += 1;

    if (rateLimitData.attempts >= 5) {
      rateLimitData.locked = true;
      rateLimitData.lockedUntil = Date.now() + 30 * 60 * 1000;
      saveRateLimitData(rateLimitData);
      setIsLocked(true);
      setLockoutTimeRemaining(1800);
      setLoginError('Too many failed login attempts. Your device has been temporarily blocked for 30 minutes.');

      const interval = setInterval(() => {
        setLockoutTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsLocked(false);
            setRemainingAttempts(5);
            clearRateLimitData();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      saveRateLimitData(rateLimitData);
      const remaining = 5 - rateLimitData.attempts;
      setRemainingAttempts(remaining);
      setLoginError(message ?? `Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
    }

    setIsLoggingIn(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      setLoginError(`Your device has been temporarily blocked. Try again in ${lockoutTimeRemaining} seconds.`);
      return;
    }

    setLoginError('');
    setIsLoggingIn(true);

    try {
      if (!hasSupabaseEnv) {
        setLoginError(supabaseConfigError ?? 'Supabase environment variables are missing for this environment.');
        setIsLoggingIn(false);
        return;
      }

      if (selectedRole === 'it_manager') {
        const emailMatches = email.trim().toLowerCase() === IT_MANAGER_EMAIL.toLowerCase();
        const passwordMatches = password === IT_MANAGER_PASSWORD;

        if (!emailMatches || !passwordMatches) {
          handleFailedLogin('Invalid IT Manager credentials.');
          return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.user) {
          handleFailedLogin();
          return;
        }

        handleSuccessfulLogin({ ...data.user, role: 'it_manager', authType: 'supabase' }, 'it_manager');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        handleFailedLogin();
        return;
      }

      const userMetadata = data.user.user_metadata || {};
      const isAdmin = userMetadata.role === 'admin' || data.user.email?.endsWith('@day1.co.za');

      if (!isAdmin) {
        setLoginError('You do not have permission to access the admin panel');
        setIsLoggingIn(false);
        return;
      }

      handleSuccessfulLogin({ ...data.user, role: 'claims', authType: 'supabase' }, 'claims');
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('An error occurred. Please try again.');
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (!hasSupabaseEnv) {
      setUser(null);
      setIsAuthenticated(false);
      setSelectedRole('claims');
      navigate('/admin', { replace: true });
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setSelectedRole('claims');
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const currentRole = user?.role === 'it_manager' ? 'it_manager' : 'claims';

    if (currentRole === 'it_manager' && location.pathname === '/admin') {
      navigate('/admin/cms', { replace: true });
      return;
    }

    if (currentRole === 'claims' && (location.pathname === '/admin' || location.pathname === '/admin/cms')) {
      navigate('/admin/providers', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate, user]);

  const roleDescription = selectedRole === 'it_manager'
    ? 'Use the Supabase IT manager user to access the CMS panel directly.'
    : 'Use your existing Supabase admin login for claims access.';

  if (loading || (isAuthenticated && location.pathname === '/admin')) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <Loader className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`w-full max-w-md rounded-lg shadow-lg p-8 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Admin Login
            </h1>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Select a role before signing in
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('it_manager')}
              className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
                selectedRole === 'it_manager'
                  ? 'border-green-600 bg-green-600 text-white'
                  : isDark
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:border-green-500'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-green-500'
              }`}
            >
              IT Manager
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('claims')}
              className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
                selectedRole === 'claims'
                  ? 'border-green-600 bg-green-600 text-white'
                  : isDark
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:border-green-500'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-green-500'
              }`}
            >
              Claims
            </button>
          </div>

          <p className={`mb-6 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {roleDescription}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter Admin Email"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="********"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-700 font-medium">{loginError}</p>
                    {isLocked && (
                      <p className="text-xs text-red-600 mt-1">
                        Your IP address has been temporarily blocked due to too many failed login attempts.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Remaining attempts: {remainingAttempts}
              </span>
              {isLocked && (
                <span className="text-red-600">
                  Locked for {lockoutTimeRemaining}s
                </span>
              )}
            </div>

            <button
              ref={buttonRef}
              type="submit"
              disabled={isLocked || isLoggingIn}
              className={`send-message-button ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="outline"></div>
              <div className="state state--default">
                <div className="icon">
                  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g style={{ filter: 'url(#shadow)' }}>
                      <path d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63ZM7.63988 7.03001C4.85988 7.96001 3.86988 9.06001 3.86988 9.78001C3.86988 10.5 4.85988 11.6 7.63988 12.52L10.1599 13.36C10.3799 13.43 10.5599 13.61 10.6299 13.83L11.4699 16.35C12.3899 19.13 13.4999 20.12 14.2199 20.12C14.9399 20.12 16.0399 19.13 16.9699 16.35L19.7999 7.86001C20.3099 6.32001 20.2199 5.06001 19.5699 4.41001C18.9199 3.76001 17.6599 3.68001 16.1299 4.19001L7.63988 7.03001Z" fill="currentColor"></path>
                      <path d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z" fill="currentColor"></path>
                    </g>
                    <defs>
                      <filter id="shadow">
                        <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodOpacity="0.5"></feDropShadow>
                      </filter>
                    </defs>
                  </svg>
                </div>
                <p>
                  <span style={{ '--i': 0 } as any}>L</span><span style={{ '--i': 1 } as any}>o</span><span style={{ '--i': 2 } as any}>g</span><span style={{ '--i': 3 } as any}>i</span><span style={{ '--i': 4 } as any}>n</span>
                </p>
              </div>
              <div className="state state--sent">
                <div className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="1em" width="1em" strokeWidth="0.5px" stroke="black">
                    <g style={{ filter: 'url(#shadow)' }}>
                      <path fill="currentColor" d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"></path>
                      <path fill="currentColor" d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"></path>
                    </g>
                  </svg>
                </div>
                <p>
                  <span style={{ '--i': 5 } as any}>L</span>
                  <span style={{ '--i': 6 } as any}>o</span>
                  <span style={{ '--i': 7 } as any}>g</span>
                  <span style={{ '--i': 8 } as any}>g</span>
                  <span style={{ '--i': 9 } as any}>e</span>
                  <span style={{ '--i': 10 } as any}>d</span>
                </p>
              </div>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={`fixed top-4 right-4 z-40 flex items-center gap-3 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } px-4 py-2 rounded-lg shadow-lg`}>
        <span className={`text-sm ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {user?.email}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <Outlet />
    </div>
  );
};

export default ProtectedAdminPage;
