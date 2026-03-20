'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0" style={{ background: 'rgba(255, 255, 255, 0.72)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
      <div className="max-w-[980px] mx-auto px-5 sm:px-6">
        <div className="flex justify-between h-12 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-xs">G</span>
            </div>
            <span className="text-sm font-semibold text-[#1D1D1F]">Green Grove</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { href: '/', label: 'Home' },
              { href: '/venue', label: 'Venue' },
              { href: '/services', label: 'Services' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/contact', label: 'Contact' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="text-xs text-[#1D1D1F] opacity-80 hover:opacity-100 transition">
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-xs text-[#1D1D1F] opacity-80 hover:opacity-100 transition">
                  {user.role === 'admin' ? 'Admin' : 'Dashboard'}
                </Link>
                <button onClick={logout} className="text-xs text-[#86868B] hover:text-[#1D1D1F] transition">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-violet-600 text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-violet-700 transition">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1.5">
            <svg className="w-5 h-5 text-[#1D1D1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden px-5 py-3 bg-white/95 space-y-1" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          {['/', '/venue', '/services', '/pricing', '/contact'].map((href, i) => (
            <Link key={href} href={href} className="block text-[#1D1D1F] py-2 px-3 text-sm hover:bg-[#F5F5F7] rounded-lg transition" onClick={() => setMenuOpen(false)}>
              {['Home', 'Venue', 'Services', 'Pricing', 'Contact'][i]}
            </Link>
          ))}
          {user ? (
            <>
              <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="block text-violet-600 py-2 px-3 text-sm font-medium hover:bg-violet-50 rounded-lg transition" onClick={() => setMenuOpen(false)}>
                {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
              </Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left text-[#86868B] py-2 px-3 text-sm hover:bg-[#F5F5F7] rounded-lg transition">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="block bg-violet-600 text-white px-4 py-2.5 rounded-full text-center text-sm font-medium mt-2" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
