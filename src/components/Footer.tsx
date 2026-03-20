'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#1A1A1A' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">G</span>
              </div>
              <div className="leading-tight">
                <span className="text-[15px] font-semibold text-white tracking-tight">Green Grove</span>
                <span className="block text-[9px] text-gray-500 tracking-wider uppercase">Thiruvananthapuram</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A premium 2-acre open-air event venue amidst lush greenery and coconut trees in Thiruvananthapuram, Kerala.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-300 text-sm mb-4">Quick Links</h3>
            <div className="space-y-2.5">
              <Link href="/venue" className="block text-gray-500 hover:text-gray-300 text-sm transition">Our Venue</Link>
              <Link href="/services" className="block text-gray-500 hover:text-gray-300 text-sm transition">Services</Link>
              <Link href="/pricing" className="block text-gray-500 hover:text-gray-300 text-sm transition">Pricing</Link>
              <Link href="/contact" className="block text-gray-500 hover:text-gray-300 text-sm transition">Contact Us</Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-300 text-sm mb-4">Event Types</h3>
            <div className="space-y-2.5 text-sm text-gray-500">
              <p>Weddings & Receptions</p>
              <p>Corporate Events</p>
              <p>Family Celebrations</p>
              <p>Retirement Parties</p>
              <p>Cultural Events</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-300 text-sm mb-4">Contact</h3>
            <div className="space-y-2.5 text-sm text-gray-500">
              <p>Thiruvananthapuram, Kerala</p>
              <p>India - 695001</p>
              <p className="pt-1">
                <a href="mailto:hello@greengrove.in" className="text-emerald-500 hover:text-emerald-400 transition">hello@greengrove.in</a>
              </p>
              <p>
                <a href="tel:+914712345678" className="hover:text-gray-300 transition">+91 471 234 5678</a>
              </p>
              <p className="text-xs text-gray-600 pt-1">WhatsApp: +91 98765 43210</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid #2A2A2A' }}>
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Green Grove Events. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Serving NRI families from Middle East, Europe, US & Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
