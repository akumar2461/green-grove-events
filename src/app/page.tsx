'use client';

import Link from 'next/link';

const features = [
  { title: '2 Acres of Paradise', desc: 'Sprawling open-air grounds with lush tropical greenery and towering coconut palms.' },
  { title: 'NRI-Friendly Service', desc: 'End-to-end coordination for families in Middle East, Europe, US & Australia.' },
  { title: 'All-Inclusive Options', desc: 'Catering, decor, music, security, parking — we handle everything.' },
  { title: 'Authentic Kerala Charm', desc: "Experience the beauty of God's Own Country for your special occasion." },
];

const eventTypes = [
  { name: 'Weddings', desc: 'Dreamy outdoor Kerala weddings under coconut trees' },
  { name: 'Corporate Events', desc: 'Team retreats, launches, and business celebrations' },
  { name: 'Family Celebrations', desc: 'Birthdays, anniversaries, reunions & more' },
  { name: 'Retirement Parties', desc: 'Honor milestones in a memorable setting' },
  { name: 'Cultural Events', desc: 'Traditional and themed celebrations' },
  { name: 'Office Parties', desc: 'Fun team outings and celebrations' },
];

const testimonials = [
  { name: 'Priya & Arjun', location: 'Dubai, UAE', text: 'Our dream Kerala wedding came true at Green Grove. The coconut tree backdrop was magical, and the team handled everything flawlessly from Dubai.' },
  { name: 'Suresh Menon', location: 'London, UK', text: "Organized my parents' 50th anniversary from London. The team was incredibly responsive across time zones. A truly memorable evening." },
  { name: 'Lakshmi Nair', location: 'Melbourne, Australia', text: 'Perfect venue for our family reunion. 80+ guests, amazing catering, and the kids loved the games area. Highly recommend!' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center" style={{ background: '#F9F7F3' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #059669, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #059669, transparent 70%)' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="max-w-2xl">
            <p className="text-emerald-600 text-sm font-medium tracking-wide mb-4">
              Thiruvananthapuram, Kerala
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Where Nature Meets{' '}
              <span className="text-emerald-600">Celebration</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-xl">
              Host your dream event in our stunning 2-acre open-air venue, surrounded by lush greenery and virgin coconut trees. From grand NRI weddings to intimate gatherings.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/booking" className="bg-emerald-600 text-white px-7 py-3 rounded-full font-medium text-[15px] hover:bg-emerald-700 transition text-center">
                Book Your Event
              </Link>
              <Link href="/venue" className="text-gray-700 px-7 py-3 rounded-full font-medium text-[15px] transition text-center hover:bg-black/[0.04]" style={{ border: '1px solid #E8E2D9' }}>
                Explore Venue
              </Link>
            </div>
          </div>

          <div className="flex gap-10 mt-16 pt-10" style={{ borderTop: '1px solid #E8E2D9' }}>
            {[
              { value: '2 Acres', label: 'Event Space' },
              { value: '500+', label: 'Guest Capacity' },
              { value: '10+', label: 'Services' },
              { value: '24/7', label: 'NRI Support' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-emerald-600 text-sm font-medium mb-3">Why Green Grove</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Everything you need for your event</h2>
          <p className="text-gray-500 mb-12 max-w-lg">We understand the unique needs of NRI families planning events back home in Kerala.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="rounded-2xl p-6 transition hover:bg-emerald-50/50" style={{ border: '1px solid #E8E2D9' }}>
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center mb-5">
                  <span className="text-white text-sm font-semibold">{i + 1}</span>
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-20" style={{ background: '#F9F7F3' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-emerald-600 text-sm font-medium mb-3">Our Events</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Events we host</h2>
          <p className="text-gray-500 mb-12 max-w-lg">From traditional Kerala weddings to modern corporate gatherings — our versatile venue adapts to your vision.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventTypes.map((e, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 transition hover:shadow-sm cursor-pointer group" style={{ border: '1px solid #E8E2D9' }}>
                <div className="w-2 h-2 bg-emerald-500 rounded-full mb-4" />
                <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5 group-hover:text-emerald-700 transition">{e.name}</h3>
                <p className="text-gray-500 text-sm">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-emerald-600 text-sm font-medium mb-3">Testimonials</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">What our guests say</h2>
          <p className="text-gray-500 mb-12">Trusted by NRI families across the globe</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ border: '1px solid #E8E2D9' }}>
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4 text-emerald-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="pt-4" style={{ borderTop: '1px solid #E8E2D9' }}>
                  <p className="font-medium text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: '#F9F7F3' }}>
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Ready to create unforgettable memories?</h2>
          <p className="text-gray-500 mb-8">Whether you&apos;re planning from Dubai, London, New York, or Sydney — we make it seamless.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/booking" className="bg-emerald-600 text-white px-7 py-3 rounded-full font-medium text-[15px] hover:bg-emerald-700 transition">
              Book Now
            </Link>
            <Link href="/contact" className="text-gray-700 px-7 py-3 rounded-full font-medium text-[15px] hover:bg-black/[0.04] transition" style={{ border: '1px solid #E8E2D9' }}>
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
