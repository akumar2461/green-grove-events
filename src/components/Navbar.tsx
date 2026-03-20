'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0" style={{ background: 'rgba(249, 247, 243, 0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #E8E2D9' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">G</span>
            </div>
            <div className="leading-tight">
              <span className="text-[15px] font-semibold text-gray-900 tracking-tight">Green Grove</span>
              <span className="block text-[9px] text-gray-500 tracking-wider uppercase">Thiruvananthapuram</span>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'Home' },
              { href: '/venue', label: 'Venue' },
              { href: '/services', label: 'Services' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/contact', label: 'Contact' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg text-[13px] font-medium transition hover:bg-black/[0.04]">
                {link.label}
              </Link>
            ))}

            <div className="w-px h-5 bg-gray-200 mx-2" />

            {user ? (
              <div className="flex items-center gap-1">
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg text-[13px] font-medium transition hover:bg-black/[0.04]">
                  {user.role === 'admin' ? 'Admin' : 'Dashboard'}
                </Link>
                <button onClick={logout} className="text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg text-[13px] transition hover:bg-black/[0.04]">
                  Logout
                </button>
                <span className="text-[11px] text-gray-500 bg-black/[0.04] px-2.5 py-1 rounded-full ml-1">{user.full_name}</span>
              </div>
            ) : (
              <Link href="/login" className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[13px] font-medium hover:bg-emerald-700 transition">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1.5 rounded-lg hover:bg-black/[0.04] transition">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-5 py-3 space-y-1" style={{ borderTop: '1px solid #E8E2D9' }}>
          {['/', '/venue', '/services', '/pricing', '/contact'].map((href, i) => (
            <Link key={href} href={href} className="block text-gray-600 hover:text-gray-900 py-2 px-3 rounded-lg text-sm font-medium hover:bg-black/[0.04] transition" onClick={() => setMenuOpen(false)}>
              {['Home', 'Venue', 'Services', 'Pricing', 'Contact'][i]}
            </Link>
          ))}
          {user ? (
            <>
              <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="block text-emerald-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-emerald-50 transition" onClick={() => setMenuOpen(false)}>
                {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
              </Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left text-gray-500 py-2 px-3 rounded-lg text-sm hover:bg-black/[0.04] transition">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="block bg-emerald-600 text-white px-4 py-2.5 rounded-full text-center text-sm font-medium mt-2" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
