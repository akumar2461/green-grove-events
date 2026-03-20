'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const countries = [
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Oman', 'Bahrain', 'Kuwait',
  'United Kingdom', 'Germany', 'France', 'Ireland', 'Netherlands',
  'United States', 'Canada',
  'Australia', 'New Zealand',
  'India', 'Singapore', 'Malaysia',
  'Other',
];

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    email: '', password: '', full_name: '', phone: '', country: '', city: '', marketing_opt_in: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
    setLoading(false);
  };

  const inputClass = 'w-full px-4 py-2.5 text-sm text-gray-900 rounded-xl outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#F9F7F3' }}>
      <div className="w-full max-w-md">
        {/* Logo and heading */}
        <div className="text-center mb-10">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-5">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin ? 'Sign in to manage your bookings' : 'Register to book your dream event'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #E8E2D9' }}>
          {/* Tab toggle */}
          <div className="flex rounded-xl p-1 mb-8" style={{ border: '1px solid #E8E2D9' }}>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isLogin
                  ? 'bg-white shadow-sm text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isLogin
                  ? 'bg-white shadow-sm text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-white border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg px-4 py-3 mb-6" style={{ border: '1px solid #E8E2D9', borderLeft: '4px solid #ef4444' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={e => setForm({...form, full_name: e.target.value})}
                  className={inputClass}
                  style={{ border: '1px solid #E8E2D9' }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className={inputClass}
                style={{ border: '1px solid #E8E2D9' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className={inputClass}
                style={{ border: '1px solid #E8E2D9' }}
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1.5">Phone (with country code)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className={inputClass}
                    style={{ border: '1px solid #E8E2D9' }}
                    placeholder="+971 50 123 4567"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Country</label>
                    <select
                      value={form.country}
                      onChange={e => setForm({...form, country: e.target.value})}
                      className={inputClass}
                      style={{ border: '1px solid #E8E2D9' }}
                    >
                      <option value="">Select...</option>
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => setForm({...form, city: e.target.value})}
                      className={inputClass}
                      style={{ border: '1px solid #E8E2D9' }}
                    />
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    checked={form.marketing_opt_in}
                    onChange={e => setForm({...form, marketing_opt_in: e.target.checked})}
                    className="mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label className="text-sm text-gray-500 leading-relaxed">
                    I&apos;d like to receive updates about promotions, new services, and special offers from Green Grove Events.
                  </label>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Admin hint */}
        {isLogin && (
          <p className="text-center text-xs text-gray-500 mt-6">
            Admin credentials: <code className="font-mono text-gray-500">admin@greengrove.in</code> / <code className="font-mono text-gray-500">admin123</code>
          </p>
        )}
      </div>
    </div>
  );
}
