'use client';

import Link from 'next/link';
import { VENUE_PRICING, VALUE_ADDED_SERVICES } from '@/lib/pricing';

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20" style={{ background: '#F5F5F7' }}>
        <div className="max-w-[980px] mx-auto px-5 sm:px-8 text-center">
          <p className="text-sm font-medium text-violet-600 mb-3">Pricing</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4" style={{ color: '#1D1D1F' }}>
            Transparent Pricing
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#86868B' }}>
            Simple venue pricing based on your event duration. All value-added services are quoted separately.
          </p>
        </div>
      </section>

      {/* Venue Pricing */}
      <section className="py-20" style={{ background: '#FFFFFF' }}>
        <div className="max-w-[980px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-violet-600 mb-3">Venue Rental</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4" style={{ color: '#1D1D1F' }}>
              Choose Your Plan
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: '#86868B' }}>
              Pricing is for the venue only. Services like catering, decoration, and entertainment are additional.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {Object.entries(VENUE_PRICING).map(([key, plan]) => {
              const isPopular = key === 'daily';
              return (
                <div
                  key={key}
                  className={`rounded-2xl p-8 text-center transition-transform duration-300 hover:scale-[1.02] ${
                    isPopular ? 'bg-violet-50' : 'bg-white'
                  }`}
                  style={{
                    border: isPopular ? '2px solid #7C3AED' : '1px solid #D2D2D7',
                  }}
                >
                  {isPopular && (
                    <span className="inline-block bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#1D1D1F' }}>{plan.label}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-violet-600">&#8377;{plan.base.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-sm mb-6" style={{ color: '#86868B' }}>{plan.description}</p>
                  {plan.minUnits > 1 && (
                    <p className="text-xs text-amber-600 mb-4">
                      Minimum {plan.minUnits} {key === 'hourly' ? 'hours' : 'units'} booking
                    </p>
                  )}
                  <Link
                    href="/booking"
                    className={`block w-full py-3 rounded-full font-semibold transition-colors ${
                      isPopular
                        ? 'bg-violet-600 text-white hover:bg-violet-700'
                        : 'hover:bg-gray-50'
                    }`}
                    style={isPopular ? undefined : { border: '1px solid #D2D2D7', color: '#1D1D1F' }}
                  >
                    Book Now
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="text-center text-sm mt-8" style={{ color: '#86868B' }}>
            All prices in INR. GST applicable as per government regulations. Prices valid for 2026.
          </p>
        </div>
      </section>

      {/* Services Pricing Quick Reference */}
      <section className="py-20" style={{ background: '#F5F5F7' }}>
        <div className="max-w-[980px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-violet-600 mb-3">Add-On Services</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4" style={{ color: '#1D1D1F' }}>
              Enhance Your Event
            </h2>
            <p style={{ color: '#86868B' }}>Optional services to elevate your event experience</p>
          </div>
          <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #D2D2D7' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: '#F5F5F7' }}>
                  <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: '#1D1D1F' }}>Service</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold" style={{ color: '#1D1D1F' }}>Starting From</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold hidden md:table-cell" style={{ color: '#1D1D1F' }}>Unit</th>
                </tr>
              </thead>
              <tbody>
                {VALUE_ADDED_SERVICES.map((s, i) => (
                  <tr
                    key={s.id}
                    style={{ borderTop: '1px solid #E5E5EA' }}
                    className={i % 2 === 0 ? 'bg-white' : ''}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm" style={{ color: '#1D1D1F' }}>{s.name}</p>
                      <p className="text-xs mt-0.5 md:hidden" style={{ color: '#86868B' }}>per {s.unit}</p>
                    </td>
                    <td className="px-6 py-4 text-violet-600 font-semibold text-sm">
                      &#8377;{s.pricePerUnit.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm hidden md:table-cell" style={{ color: '#86868B' }}>{s.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm mt-6" style={{ color: '#86868B' }}>
            Prices are indicative starting rates. Final pricing depends on requirements and scale.
            <Link href="/contact" className="text-violet-600 ml-1 hover:underline">
              Contact us for custom quotes.
            </Link>
          </p>
        </div>
      </section>

      {/* Currency Note */}
      <section className="py-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-[980px] mx-auto px-5 sm:px-8">
          <div className="rounded-2xl p-6 bg-white" style={{ border: '1px solid #D2D2D7' }}>
            <h3 className="font-semibold mb-2" style={{ color: '#1D1D1F' }}>For Our International Guests</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#86868B' }}>
              All prices are listed in Indian Rupees (INR). For reference: &#8377;1,00,000 INR is approximately
              USD $1,200 / EUR 1,100 / GBP 950 / AED 4,400 / AUD 1,850 (rates vary).
              We accept international bank transfers and all major credit cards. Payment plans available for large events.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: '#F5F5F7' }}>
        <div className="max-w-[980px] mx-auto px-5 sm:px-8 text-center">
          <p className="text-sm font-medium text-violet-600 mb-3">Ready to begin?</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4" style={{ color: '#1D1D1F' }}>
            Get a Detailed Quote
          </h2>
          <p className="mb-8" style={{ color: '#86868B' }}>
            Tell us about your event and we&apos;ll prepare a comprehensive estimate.
          </p>
          <Link
            href="/booking"
            className="inline-block bg-violet-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-violet-700 transition-colors"
          >
            Start Booking
          </Link>
        </div>
      </section>
    </div>
  );
}
