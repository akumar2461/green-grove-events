'use client';

import Link from 'next/link';
import { VENUE_PRICING, VALUE_ADDED_SERVICES } from '@/lib/pricing';

export default function PricingPage() {
  return (
    <div style={{ backgroundColor: '#F9F7F3' }}>
      {/* Hero */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-sm font-medium text-emerald-600 mb-3">Pricing</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Transparent Pricing</h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Simple venue pricing based on your event duration. All value-added services are quoted separately.
          </p>
        </div>
      </section>

      {/* Venue Pricing */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-emerald-600 mb-3">Venue Rental</p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Pricing is for the venue only. Services like catering, decoration, and entertainment are additional.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {Object.entries(VENUE_PRICING).map(([key, plan]) => {
              const isPopular = key === 'daily';
              return (
                <div
                  key={key}
                  className={`rounded-2xl p-8 text-center transition hover:shadow-md ${isPopular ? 'bg-emerald-50' : ''}`}
                  style={{
                    backgroundColor: isPopular ? undefined : '#FFFFFF',
                    border: isPopular ? '2px solid #059669' : '1px solid #E8E2D9',
                  }}
                >
                  {isPopular && (
                    <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.label}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-emerald-600">&#8377;{plan.base.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
                  {plan.minUnits > 1 && (
                    <p className="text-xs text-amber-600 mb-4">
                      Minimum {plan.minUnits} {key === 'hourly' ? 'hours' : 'units'} booking
                    </p>
                  )}
                  <Link
                    href="/booking"
                    className={`block w-full py-3 rounded-full font-semibold transition ${
                      isPopular
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                    style={isPopular ? undefined : { border: '1px solid #E8E2D9' }}
                  >
                    Book Now
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            All prices in INR. GST applicable as per government regulations. Prices valid for 2026.
          </p>
        </div>
      </section>

      {/* Services Pricing Quick Reference */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-emerald-600 mb-3">Add-On Services</p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Enhance Your Event</h2>
            <p className="text-gray-500">Optional services to elevate your event experience</p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D9' }}>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Service</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Starting From</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 hidden md:table-cell">Unit</th>
                </tr>
              </thead>
              <tbody>
                {VALUE_ADDED_SERVICES.map((s, i) => (
                  <tr
                    key={s.id}
                    style={{ borderTop: '1px solid #E8E2D9' }}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5 md:hidden">per {s.unit}</p>
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-semibold text-sm">
                      &#8377;{s.pricePerUnit.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">{s.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Prices are indicative starting rates. Final pricing depends on requirements and scale.
            <Link href="/contact" className="text-emerald-600 ml-1 hover:underline">
              Contact us for custom quotes.
            </Link>
          </p>
        </div>
      </section>

      {/* Currency Note */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D9' }}>
            <h3 className="font-semibold text-gray-900 mb-2">For Our International Guests</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              All prices are listed in Indian Rupees (INR). For reference: &#8377;1,00,000 INR is approximately
              USD $1,200 / EUR 1,100 / GBP 950 / AED 4,400 / AUD 1,850 (rates vary).
              We accept international bank transfers and all major credit cards. Payment plans available for large events.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-sm font-medium text-emerald-600 mb-3">Ready to begin?</p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Get a Detailed Quote</h2>
          <p className="text-gray-500 mb-8">
            Tell us about your event and we&apos;ll prepare a comprehensive estimate.
          </p>
          <Link
            href="/booking"
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition"
          >
            Start Booking
          </Link>
        </div>
      </section>
    </div>
  );
}
