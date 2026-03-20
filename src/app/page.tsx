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
      <section className="py-24 sm:py-32">
        <div className="max-w-[980px] mx-auto px-5 sm:px-6 text-center">
          <p className="text-violet-600 text-sm font-medium tracking-wide mb-4">
            Thiruvananthapuram, Kerala
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#1D1D1F] leading-[1.05] mb-6 tracking-tight">
            Where Nature Meets{' '}
            <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">Celebration</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#86868B] mb-10 leading-relaxed max-w-2xl mx-auto">
            Host your dream event in our stunning 2-acre open-air venue, surrounded by lush greenery and virgin coconut trees.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/booking" className="bg-violet-600 text-white px-8 py-3.5 rounded-full font-medium text-[15px] hover:bg-violet-700 transition text-center">
              Book Your Event
            </Link>
            <Link href="/venue" className="text-[#1D1D1F] px-8 py-3.5 rounded-full font-medium text-[15px] transition text-center hover:bg-[#F5F5F7]" style={{ border: '1px solid #D2D2D7' }}>
              Explore Venue
            </Link>
          </div>
        </div>

        <div className="max-w-[980px] mx-auto px-5 sm:px-6 mt-20">
          <div className="flex justify-center gap-12 sm:gap-20">
            {[
              { value: '2 Acres', label: 'Event Space' },
              { value: '500+', label: 'Guest Capacity' },
              { value: '10+', label: 'Services' },
              { value: '24/7', label: 'NRI Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F]">{stat.value}</p>
                <p className="text-xs text-[#86868B] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20" style={{ background: '#F5F5F7' }}>
        <div className="max-w-[980px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#1D1D1F] tracking-tight mb-4">Everything you need.</h2>
            <p className="text-[#86868B] text-lg max-w-xl mx-auto">We understand the unique needs of NRI families planning events back home in Kerala.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 transition hover:scale-[1.02]">
                <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center mb-5">
                  <span className="text-violet-600 text-sm font-semibold">{i + 1}</span>
                </div>
                <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-2">{f.title}</h3>
                <p className="text-[#86868B] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-20">
        <div className="max-w-[980px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#1D1D1F] tracking-tight mb-4">Events we host.</h2>
            <p className="text-[#86868B] text-lg max-w-xl mx-auto">From traditional Kerala weddings to modern corporate gatherings — our versatile venue adapts to your vision.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventTypes.map((e, i) => (
              <div key={i} className="rounded-2xl p-6 transition hover:bg-[#F5F5F7] cursor-pointer group" style={{ border: '1px solid #E5E5EA' }}>
                <div className="w-2 h-2 bg-violet-500 rounded-full mb-4" />
                <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-1.5 group-hover:text-violet-600 transition">{e.name}</h3>
                <p className="text-[#86868B] text-sm">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{ background: '#F5F5F7' }}>
        <div className="max-w-[980px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#1D1D1F] tracking-tight mb-4">What our guests say.</h2>
            <p className="text-[#86868B] text-lg">Trusted by NRI families across the globe.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4 text-violet-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#1D1D1F] text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="pt-4" style={{ borderTop: '1px solid #E5E5EA' }}>
                  <p className="font-medium text-[#1D1D1F] text-sm">{t.name}</p>
                  <p className="text-[#86868B] text-xs mt-0.5">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-4xl sm:text-5xl font-semibold text-[#1D1D1F] mb-5 tracking-tight">Ready to celebrate?</h2>
          <p className="text-[#86868B] text-lg mb-8">Whether you&apos;re planning from Dubai, London, New York, or Sydney — we make it seamless.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/booking" className="bg-violet-600 text-white px-8 py-3.5 rounded-full font-medium text-[15px] hover:bg-violet-700 transition">
              Book Now
            </Link>
            <Link href="/contact" className="text-[#1D1D1F] px-8 py-3.5 rounded-full font-medium text-[15px] hover:bg-[#F5F5F7] transition" style={{ border: '1px solid #D2D2D7' }}>
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
