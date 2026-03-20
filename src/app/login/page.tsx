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

  const inputClass = 'w-full rounded-xl px-4 py-2.5 text-sm text-[#1D1D1F] outline-none transition focus:ring-2 focus:ring-violet-500';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#F5F5F7' }}>
      <div className="w-full max-w-md">
        {/* Logo and heading */}
        <div className="text-center mb-10">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center mx-auto mb-5">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#1D1D1F] tracking-tight">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-[#86868B] text-sm mt-2">
            {isLogin ? 'Sign in to manage your bookings' : 'Register to book your dream event'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #D2D2D7' }}>
          {/* Tab toggle */}
          <div className="flex rounded-xl p-1 mb-8" style={{ border: '1px solid #D2D2D7' }}>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isLogin
                  ? 'bg-violet-600 text-white'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isLogin
                  ? 'bg-violet-600 text-white'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-white rounded-r-lg px-4 py-3 mb-6 text-sm text-[#1D1D1F]" style={{ border: '1px solid #D2D2D7', borderLeft: '4px solid #dc2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={e => setForm({...form, full_name: e.target.value})}
                  className={inputClass}
                  style={{ border: '1px solid #D2D2D7' }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className={inputClass}
                style={{ border: '1px solid #D2D2D7' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className={inputClass}
                style={{ border: '1px solid #D2D2D7' }}
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Phone (with country code)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className={inputClass}
                    style={{ border: '1px solid #D2D2D7' }}
                    placeholder="+971 50 123 4567"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Country</label>
                    <select
                      value={form.country}
                      onChange={e => setForm({...form, country: e.target.value})}
                      className={inputClass}
                      style={{ border: '1px solid #D2D2D7' }}
                    >
                      <option value="">Select...</option>
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-1.5">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => setForm({...form, city: e.target.value})}
                      className={inputClass}
                      style={{ border: '1px solid #D2D2D7' }}
                    />
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    checked={form.marketing_opt_in}
                    onChange={e => setForm({...form, marketing_opt_in: e.target.checked})}
                    className="mt-0.5 rounded border-[#D2D2D7] text-violet-600 focus:ring-violet-500"
                  />
                  <label className="text-sm text-[#86868B] leading-relaxed">
                    I&apos;d like to receive updates about promotions, new services, and special offers from Green Grove Events.
                  </label>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 text-white py-3 rounded-full font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Admin hint */}
        {isLogin && (
          <p className="text-center text-xs text-[#86868B] mt-6">
            Admin credentials: <code className="font-mono text-[#86868B]">admin@greengrove.in</code> / <code className="font-mono text-[#86868B]">admin123</code>
          </p>
        )}
      </div>
    </div>
  );
}
