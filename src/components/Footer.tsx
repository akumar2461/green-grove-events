'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#F5F5F7' }}>
      <div className="max-w-[980px] mx-auto px-5 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-xs">G</span>
              </div>
              <span className="text-sm font-semibold text-[#1D1D1F]">Green Grove</span>
            </div>
            <p className="text-[#86868B] text-xs leading-relaxed">
              A premium 2-acre open-air event venue amidst lush greenery and coconut trees in Thiruvananthapuram, Kerala.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-[#1D1D1F] text-xs mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/venue" className="block text-[#86868B] hover:text-[#1D1D1F] text-xs transition">Our Venue</Link>
              <Link href="/services" className="block text-[#86868B] hover:text-[#1D1D1F] text-xs transition">Services</Link>
              <Link href="/pricing" className="block text-[#86868B] hover:text-[#1D1D1F] text-xs transition">Pricing</Link>
              <Link href="/contact" className="block text-[#86868B] hover:text-[#1D1D1F] text-xs transition">Contact Us</Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-[#1D1D1F] text-xs mb-3">Event Types</h3>
            <div className="space-y-2 text-xs text-[#86868B]">
              <p>Weddings & Receptions</p>
              <p>Corporate Events</p>
              <p>Family Celebrations</p>
              <p>Retirement Parties</p>
              <p>Cultural Events</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-[#1D1D1F] text-xs mb-3">Contact</h3>
            <div className="space-y-2 text-xs text-[#86868B]">
              <p>Thiruvananthapuram, Kerala</p>
              <p>India - 695001</p>
              <p className="pt-1">
                <a href="mailto:hello@greengrove.in" className="text-violet-600 hover:text-violet-700 transition">hello@greengrove.in</a>
              </p>
              <p>
                <a href="tel:+914712345678" className="hover:text-[#1D1D1F] transition">+91 471 234 5678</a>
              </p>
              <p className="text-[10px] text-[#86868B] pt-1">WhatsApp: +91 98765 43210</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3" style={{ borderTop: '1px solid #D2D2D7' }}>
          <p className="text-[#86868B] text-[10px]">
            &copy; {new Date().getFullYear()} Green Grove Events. All rights reserved.
          </p>
          <p className="text-[#86868B] text-[10px]">
            Serving NRI families from Middle East, Europe, US & Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
