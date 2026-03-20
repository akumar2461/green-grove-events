'use client';

import Link from 'next/link';

const venueFeatures = [
  { title: 'Sprawling 2-Acre Property', desc: 'Ample space for events of any scale — from intimate gatherings of 50 to grand celebrations of 500+ guests.' },
  { title: 'Virgin Coconut Trees', desc: 'Majestic coconut palms create a natural canopy, providing shade and an authentic Kerala ambiance.' },
  { title: 'Lush Greenery', desc: 'Meticulously maintained tropical gardens with flowering plants, ferns, and native Kerala flora.' },
  { title: 'Open Sky Setting', desc: 'Unobstructed views of the sky — perfect for evening events under the stars with fairy light canopies.' },
  { title: 'Multiple Event Zones', desc: 'Flexible spaces including a main event area, garden lounge, children\'s zone, and a designated parking area.' },
  { title: 'Modern Amenities', desc: 'Clean restroom facilities, power backup, Wi-Fi, storage rooms, and a prep kitchen for caterers.' },
];

const highlights = [
  { label: 'Total Area', value: '2 Acres (approx. 87,120 sq ft)' },
  { label: 'Max Capacity', value: '500+ Guests' },
  { label: 'Parking', value: 'Up to 100 Vehicles' },
  { label: 'Location', value: 'Thiruvananthapuram, Kerala' },
  { label: 'Nearest Airport', value: 'Trivandrum International (TRV) — 15 min' },
  { label: 'Climate', value: 'Tropical — Pleasant evenings year-round' },
];

export default function VenuePage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: '#F9F7F3' }} className="py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-emerald-600 text-sm font-medium mb-3">Our Venue</p>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Where Nature Meets Celebration
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            A pristine 2-acre property in Thiruvananthapuram, where towering coconut trees meet lush tropical gardens —
            the perfect canvas for your celebration.
          </p>
        </div>
      </section>

      {/* Virtual Tour Section */}
      <section style={{ background: '#FFFFFF' }} className="py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-emerald-600 text-sm font-medium mb-3">The Space</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-6">A Natural Paradise</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Nestled in the heart of Thiruvananthapuram, Green Grove is a rare find — a 2-acre open-air venue
                that combines the untouched beauty of Kerala&apos;s landscape with modern event infrastructure.
              </p>
              <p className="text-gray-500 leading-relaxed mb-4">
                The property features mature coconut trees that have stood for decades, creating a natural cathedral
                of swaying palms. The grounds are adorned with tropical flowers, ornamental plants, and manicured
                lawns that provide a stunning backdrop for any occasion.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Whether you envision a traditional Kerala wedding with a mandapam under the palms, a vibrant
                corporate retreat with team activities across the lawn, or an elegant anniversary dinner under
                a canopy of fairy lights — Green Grove transforms to match your dream.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div style={{ border: '1px solid #E8E2D9' }} className="bg-white rounded-2xl h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🌴</div>
                  <p className="text-gray-900 font-medium text-sm">Coconut Grove</p>
                </div>
              </div>
              <div style={{ border: '1px solid #E8E2D9' }} className="bg-white rounded-2xl h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🌺</div>
                  <p className="text-gray-900 font-medium text-sm">Tropical Gardens</p>
                </div>
              </div>
              <div style={{ border: '1px solid #E8E2D9' }} className="bg-white rounded-2xl h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🌙</div>
                  <p className="text-gray-900 font-medium text-sm">Starlit Evenings</p>
                </div>
              </div>
              <div style={{ border: '1px solid #E8E2D9' }} className="bg-white rounded-2xl h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎪</div>
                  <p className="text-gray-900 font-medium text-sm">Event Spaces</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ background: '#F9F7F3' }} className="py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-emerald-600 text-sm font-medium mb-3 text-center">What We Offer</p>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight text-center mb-12">Venue Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venueFeatures.map((f, i) => (
              <div key={i} style={{ border: '1px solid #E8E2D9' }} className="bg-white rounded-2xl p-6">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-emerald-600 font-bold">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section style={{ background: '#FFFFFF' }} className="py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-emerald-600 text-sm font-medium mb-3 text-center">At a Glance</p>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight text-center mb-12">Quick Facts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <div key={i} style={{ border: '1px solid #E8E2D9' }} className="bg-white rounded-2xl p-5 flex items-start gap-4">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-emerald-600 font-medium">{h.label}</p>
                  <p className="text-gray-900 font-semibold">{h.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#F9F7F3' }} className="py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-emerald-600 text-sm font-medium mb-3">Get Started</p>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Love What You See?</h2>
          <p className="text-gray-500 mb-8">Book a virtual tour or schedule a visit. We&apos;re happy to walk you through the property.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition">Book Now</Link>
            <Link href="/contact" style={{ border: '1px solid #E8E2D9' }} className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
