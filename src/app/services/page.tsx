'use client';

import Link from 'next/link';
import { VALUE_ADDED_SERVICES } from '@/lib/pricing';

const iconMap: Record<string, string> = {
  Shield: '🛡️', Car: '🚗', UtensilsCrossed: '🍽️', Wine: '🍷',
  Music: '🎵', Gamepad2: '🎮', Sparkles: '✨', Camera: '📸',
  Lightbulb: '💡', Bus: '🚌',
};

const categoryDescriptions: Record<string, string> = {
  Essential: 'Core services to ensure your event runs smoothly and safely.',
  'Food & Beverage': 'Authentic Kerala cuisine and premium beverage experiences.',
  Entertainment: 'Keep your guests engaged with music, games, and performances.',
  Accessories: 'The finishing touches that transform a venue into your vision.',
};

export default function ServicesPage() {
  const categories = [...new Set(VALUE_ADDED_SERVICES.map(s => s.category))];

  return (
    <div style={{ background: '#F9F7F3' }}>
      {/* Hero */}
      <section className="py-20 sm:py-28" style={{ background: '#F9F7F3' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-emerald-600 text-sm font-medium mb-3">Our Services</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-5">
            Value-Added Services
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Everything you need for a perfect event — from catering and decor to
            security and entertainment. All services are optional add-ons to your
            venue booking.
          </p>
        </div>
      </section>

      {/* Category Sections */}
      {categories.map((cat, index) => {
        const isEven = index % 2 === 0;
        const bgColor = isEven ? '#FFFFFF' : '#F9F7F3';

        return (
          <section key={cat} className="py-16 sm:py-20" style={{ background: bgColor }}>
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
              <p className="text-emerald-600 text-sm font-medium mb-2">{cat}</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-3">
                {cat} Services
              </h2>
              {categoryDescriptions[cat] && (
                <p className="text-gray-500 mb-10 max-w-xl">
                  {categoryDescriptions[cat]}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {VALUE_ADDED_SERVICES.filter(s => s.category === cat).map(service => (
                  <div
                    key={service.id}
                    className="rounded-2xl p-6 transition-shadow duration-200 hover:shadow-md"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E8E2D9',
                    }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <span
                        className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl shrink-0"
                        style={{ background: '#F9F7F3', border: '1px solid #E8E2D9' }}
                      >
                        {iconMap[service.icon] || '📦'}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                          {service.name}
                        </h3>
                        <p className="text-emerald-600 text-sm font-medium mt-0.5">
                          {service.pricing}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section
        className="py-20 sm:py-24"
        style={{
          background: categories.length % 2 === 0 ? '#FFFFFF' : '#F9F7F3',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div
            className="rounded-2xl p-10 sm:p-14 text-center"
            style={{ background: '#FFFFFF', border: '1px solid #E8E2D9' }}
          >
            <p className="text-emerald-600 text-sm font-medium mb-3">Custom Requests</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Need Something Special?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
              We accommodate custom requests. Traditional Kerala performances, themed
              decor, special dietary menus — just ask!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors text-center"
              >
                Book with Services
              </Link>
              <Link
                href="/contact"
                className="text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors text-center"
                style={{ border: '1px solid #E8E2D9' }}
              >
                Custom Request
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
