import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Shield, ArrowLeft, Mail } from 'lucide-react';

type Props = {
  onBack?: () => void;
};

type AuthMode = 'login' | 'signup' | 'forgot';

export default function Auth({ onBack }: Props) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === 'forgot') {
      // Handle password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://spurushothaman419.github.io/ZTA-Suite/',
      });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password reset email sent! Check your inbox.');
      }
      setLoading(false);
      return;
    }

    const { error } = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password);

    if (error) {
      setError(error.message);
    } else if (mode === 'signup') {
      setSuccess('Account created! Check your email to confirm, then sign in.');
      setMode('login');
    }

    setLoading(false);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        )}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-12 h-12 text-slate-700 mr-3" />
            <h1 className="text-3xl font-bold text-slate-900">ZTA Assessment</h1>
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
            {mode === 'login' && 'Sign In'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>

          {mode === 'forgot' && (
            <p className="text-sm text-slate-600 text-center mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg text-sm bg-green-50 text-green-800 border border-green-200 flex items-start">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Processing...' : 
                mode === 'login' ? 'Sign In' : 
                mode === 'signup' ? 'Sign Up' : 
                'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center">
            {mode === 'login' && (
              <>
                <button
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-indigo-600 hover:text-indigo-800 block w-full"
                >
                  Forgot your password?
                </button>
                <button
                  onClick={() => switchMode('signup')}
                  className="text-sm text-slate-600 hover:text-slate-800 block w-full"
                >
                  Don't have an account? Sign up
                </button>
              </>
            )}
            {mode === 'signup' && (
              <button
                onClick={() => switchMode('login')}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                Already have an account? Sign in
              </button>
            )}
            {mode === 'forgot' && (
              <button
                onClick={() => switchMode('login')}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
