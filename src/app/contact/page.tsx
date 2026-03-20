'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass = 'w-full rounded-xl px-4 py-2.5 text-sm text-[#1D1D1F] outline-none transition focus:ring-2 focus:ring-violet-500';

  return (
    <div style={{ background: '#FFFFFF' }}>
      {/* Hero */}
      <section className="py-20" style={{ background: '#F5F5F7' }}>
        <div className="max-w-[980px] mx-auto px-5 sm:px-8">
          <p className="text-violet-600 text-sm font-medium mb-3">Contact Us</p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#1D1D1F] mb-4">Get in Touch</h1>
          <p className="text-[#86868B] text-lg max-w-2xl">
            Planning from abroad? No worries — we&apos;re available across time zones via email, phone, and WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-[980px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #D2D2D7' }}>
              <p className="text-violet-600 text-sm font-medium mb-2">Write to Us</p>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] mb-6">Send Us a Message</h2>

              {status === 'sent' && (
                <div className="bg-white rounded-xl px-4 py-3 mb-6" style={{ border: '1px solid #D2D2D7', borderLeft: '4px solid #7C3AED' }}>
                  <p className="text-[#1D1D1F] text-sm font-medium">Message sent successfully! We&apos;ll get back to you within 24 hours.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="bg-white rounded-xl px-4 py-3 mb-6" style={{ border: '1px solid #D2D2D7', borderLeft: '4px solid #dc2626' }}>
                  <p className="text-[#1D1D1F] text-sm font-medium">Something went wrong. Please try again.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                      style={{ border: '1px solid #D2D2D7' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                      style={{ border: '1px solid #D2D2D7' }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-1">Phone (with country code)</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className={inputClass}
                      style={{ border: '1px solid #D2D2D7' }}
                      placeholder="+971 50 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] mb-1">Subject</label>
                    <select
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className={inputClass}
                      style={{ border: '1px solid #D2D2D7' }}
                    >
                      <option value="">Select...</option>
                      <option>Wedding Inquiry</option>
                      <option>Corporate Event</option>
                      <option>Family Celebration</option>
                      <option>Pricing Question</option>
                      <option>Virtual Tour Request</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1F] mb-1">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className={inputClass}
                    style={{ border: '1px solid #D2D2D7' }}
                    placeholder="Tell us about your event..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="bg-violet-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-violet-700 transition disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <p className="text-violet-600 text-sm font-medium mb-2">Reach Us</p>
                <h2 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #D2D2D7' }}>
                    <p className="font-medium text-[#1D1D1F] mb-1">Address</p>
                    <p className="text-[#86868B] text-sm">Green Grove Events, Thiruvananthapuram, Kerala, India - 695001</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #D2D2D7' }}>
                    <p className="font-medium text-[#1D1D1F] mb-1">Email</p>
                    <p className="text-violet-600 text-sm">hello@greengrove.in</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #D2D2D7' }}>
                    <p className="font-medium text-[#1D1D1F] mb-1">Phone</p>
                    <p className="text-[#86868B] text-sm">+91 471 234 5678 (India)</p>
                    <p className="text-[#86868B] text-xs mt-1">WhatsApp: +91 98765 43210</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #D2D2D7', borderLeft: '4px solid #7C3AED' }}>
                <h3 className="font-semibold text-[#1D1D1F] mb-3">NRI Coordination Hours</h3>
                <div className="space-y-2 text-sm text-[#86868B]">
                  <p><span className="font-medium text-[#1D1D1F]">Middle East (GST/AST):</span> 9 AM - 10 PM</p>
                  <p><span className="font-medium text-[#1D1D1F]">UK/Europe (GMT/CET):</span> 7 AM - 8 PM</p>
                  <p><span className="font-medium text-[#1D1D1F]">US (EST/PST):</span> Available by appointment</p>
                  <p><span className="font-medium text-[#1D1D1F]">Australia (AEST):</span> 9 AM - 6 PM</p>
                </div>
                <p className="text-[#86868B] text-xs mt-3">All times in local time zones. Email and WhatsApp available 24/7.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
