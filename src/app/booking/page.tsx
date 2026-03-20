'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { VENUE_PRICING, VALUE_ADDED_SERVICES, EVENT_TYPES, calculateVenueCost } from '@/lib/pricing';

export default function BookingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    event_type: '',
    event_name: '',
    event_date: '',
    end_date: '',
    duration_type: 'daily' as 'hourly' | 'daily' | 'weekly',
    duration_value: 1,
    guest_count: 100,
    special_requests: '',
  });

  const [selectedServices, setSelectedServices] = useState<Record<string, { selected: boolean; quantity: number }>>({});

  const venueCost = calculateVenueCost(form.duration_type, form.duration_value);
  const servicesCost = Object.entries(selectedServices).reduce((sum, [id, s]) => {
    if (!s.selected) return sum;
    const svc = VALUE_ADDED_SERVICES.find(v => v.id === id);
    return sum + (svc ? svc.pricePerUnit * s.quantity : 0);
  }, 0);

  const toggleService = (id: string) => {
    setSelectedServices(prev => ({
      ...prev,
      [id]: { selected: !prev[id]?.selected, quantity: prev[id]?.quantity || 1 },
    }));
  };

  const handleSubmit = async () => {
    if (!user) { router.push('/login'); return; }
    setLoading(true);
    setError('');

    const services = Object.entries(selectedServices)
      .filter(([, s]) => s.selected)
      .map(([id, s]) => {
        const svc = VALUE_ADDED_SERVICES.find(v => v.id === id)!;
        return { type: svc.category, name: svc.name, price: svc.pricePerUnit, quantity: s.quantity };
      });

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, services }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error); }
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1D1D1F] mb-4">Please Sign In to Book</h2>
          <p className="text-[#86868B] mb-6">You need an account to make a reservation.</p>
          <Link href="/login" className="bg-violet-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-violet-700 transition">Sign In / Register</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#F5F5F7' }}>
      <div className="max-w-[980px] mx-auto px-5 sm:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] mb-2">Book Your Event</h1>
        <p className="text-[#86868B] mb-8">Fill in the details below to reserve Green Grove for your special occasion.</p>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {['Event Details', 'Add Services', 'Review & Confirm'].map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-violet-600 text-white' : step === i + 1 ? 'bg-violet-600 text-white' : 'text-[#86868B]'}`}
                style={step <= i ? { border: '1px solid #D2D2D7', backgroundColor: '#FFFFFF' } : undefined}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${step === i + 1 ? 'text-violet-600 font-medium' : 'text-[#86868B]'}`}>{label}</span>
              {i < 2 && <div className="flex-1 h-0.5" style={{ backgroundColor: '#D2D2D7' }}><div className={`h-full bg-violet-600 transition-all ${step > i + 1 ? 'w-full' : 'w-0'}`}></div></div>}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-white text-red-700 text-sm rounded-xl p-3 mb-6" style={{ border: '1px solid #D2D2D7', borderLeft: '4px solid #dc2626' }}>{error}</div>
        )}

        {/* Step 1: Event Details */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #D2D2D7' }}>
            <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F] mb-6">Event Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1D1D1F] mb-2">Event Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {EVENT_TYPES.map(et => (
                    <button key={et.id} onClick={() => setForm({...form, event_type: et.id})}
                      className={`p-3 rounded-xl text-center text-sm font-medium transition ${form.event_type === et.id ? 'border-2 border-violet-500 bg-violet-50 text-violet-700' : 'bg-white text-[#1D1D1F] hover:bg-[#F5F5F7]'}`}
                      style={form.event_type === et.id ? undefined : { border: '1px solid #D2D2D7' }}>
                      {et.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D1D1F] mb-1">Event Name *</label>
                <input type="text" required value={form.event_name} onChange={e => setForm({...form, event_name: e.target.value})}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                  style={{ border: '1px solid #D2D2D7' }}
                  placeholder="e.g., Priya & Arjun's Wedding" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1F] mb-1">Event Date *</label>
                  <input type="date" required value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                    style={{ border: '1px solid #D2D2D7' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1F] mb-1">End Date (for multi-day)</label>
                  <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                    style={{ border: '1px solid #D2D2D7' }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1F] mb-1">Duration Type *</label>
                  <select value={form.duration_type} onChange={e => setForm({...form, duration_type: e.target.value as 'hourly' | 'daily' | 'weekly'})}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                    style={{ border: '1px solid #D2D2D7' }}>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
                    {form.duration_type === 'hourly' ? 'Hours' : form.duration_type === 'daily' ? 'Days' : 'Weeks'} *
                  </label>
                  <input type="number" min={VENUE_PRICING[form.duration_type].minUnits} value={form.duration_value}
                    onChange={e => setForm({...form, duration_value: parseInt(e.target.value) || 1})}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                    style={{ border: '1px solid #D2D2D7' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1F] mb-1">Expected Guests</label>
                  <input type="number" min={1} max={500} value={form.guest_count}
                    onChange={e => setForm({...form, guest_count: parseInt(e.target.value) || 100})}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                    style={{ border: '1px solid #D2D2D7' }} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D1D1F] mb-1">Special Requests</label>
                <textarea rows={3} value={form.special_requests} onChange={e => setForm({...form, special_requests: e.target.value})}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                  style={{ border: '1px solid #D2D2D7' }}
                  placeholder="Any special requirements, themes, dietary restrictions, etc." />
              </div>

              <div className="bg-violet-50 rounded-xl p-4">
                <p className="text-violet-900 font-medium">Venue Cost: &#8377;{venueCost.toLocaleString('en-IN')}</p>
                <p className="text-violet-600 text-sm">{form.duration_value} {form.duration_type === 'hourly' ? 'hour(s)' : form.duration_type === 'daily' ? 'day(s)' : 'week(s)'} @ &#8377;{VENUE_PRICING[form.duration_type].base.toLocaleString('en-IN')} {VENUE_PRICING[form.duration_type].label.toLowerCase()}</p>
              </div>

              <button onClick={() => { if (form.event_type && form.event_name && form.event_date) setStep(2); }}
                disabled={!form.event_type || !form.event_name || !form.event_date}
                className="w-full bg-violet-600 text-white py-3 rounded-full font-semibold hover:bg-violet-700 transition disabled:opacity-50">
                Next: Add Services
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #D2D2D7' }}>
            <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F] mb-2">Add Value-Added Services</h2>
            <p className="text-[#86868B] text-sm mb-6">Select any optional services you&apos;d like for your event.</p>
            <div className="space-y-4">
              {VALUE_ADDED_SERVICES.map(svc => (
                <div key={svc.id}
                  className={`rounded-xl p-4 cursor-pointer transition ${selectedServices[svc.id]?.selected ? 'bg-violet-50' : 'bg-white'}`}
                  style={{ border: selectedServices[svc.id]?.selected ? '2px solid #7C3AED' : '1px solid #D2D2D7' }}
                  onClick={() => toggleService(svc.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={selectedServices[svc.id]?.selected || false} readOnly
                        className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500" style={{ borderColor: '#D2D2D7' }} />
                      <div>
                        <p className="font-medium text-[#1D1D1F]">{svc.name}</p>
                        <p className="text-[#86868B] text-xs">{svc.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-violet-600 font-semibold text-sm">&#8377;{svc.pricePerUnit.toLocaleString('en-IN')}</p>
                      <p className="text-[#86868B] text-xs">per {svc.unit}</p>
                    </div>
                  </div>
                  {selectedServices[svc.id]?.selected && (
                    <div className="mt-3 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <label className="text-sm text-[#86868B]">Qty:</label>
                      <input type="number" min={1} value={selectedServices[svc.id]?.quantity || 1}
                        onChange={e => setSelectedServices(prev => ({...prev, [svc.id]: { ...prev[svc.id], quantity: parseInt(e.target.value) || 1 }}))}
                        className="w-20 rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                        style={{ border: '1px solid #D2D2D7' }} />
                      <span className="text-sm text-[#86868B]">= &#8377;{(svc.pricePerUnit * (selectedServices[svc.id]?.quantity || 1)).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(1)} className="flex-1 text-[#1D1D1F] py-3 rounded-full font-semibold hover:bg-[#F5F5F7] transition" style={{ border: '1px solid #D2D2D7' }}>Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-violet-600 text-white py-3 rounded-full font-semibold hover:bg-violet-700 transition">Review Booking</button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #D2D2D7' }}>
            <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F] mb-6">Review Your Booking</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-[#86868B]">Event Type:</span><p className="font-medium text-[#1D1D1F]">{EVENT_TYPES.find(e => e.id === form.event_type)?.name}</p></div>
                <div><span className="text-[#86868B]">Event Name:</span><p className="font-medium text-[#1D1D1F]">{form.event_name}</p></div>
                <div><span className="text-[#86868B]">Date:</span><p className="font-medium text-[#1D1D1F]">{form.event_date}{form.end_date ? ` to ${form.end_date}` : ''}</p></div>
                <div><span className="text-[#86868B]">Duration:</span><p className="font-medium text-[#1D1D1F]">{form.duration_value} {form.duration_type === 'hourly' ? 'hour(s)' : form.duration_type === 'daily' ? 'day(s)' : 'week(s)'}</p></div>
                <div><span className="text-[#86868B]">Guests:</span><p className="font-medium text-[#1D1D1F]">{form.guest_count}</p></div>
              </div>

              {form.special_requests && (
                <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: '#F5F5F7', border: '1px solid #D2D2D7' }}>
                  <p className="font-medium text-[#1D1D1F] mb-1">Special Requests:</p>
                  <p className="text-[#86868B]">{form.special_requests}</p>
                </div>
              )}

              {/* Cost Summary */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#F5F5F7', border: '1px solid #D2D2D7' }}>
                <h3 className="font-semibold text-[#1D1D1F] mb-4">Cost Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#86868B]">Venue Rental</span><span className="font-medium text-[#1D1D1F]">&#8377;{venueCost.toLocaleString('en-IN')}</span></div>
                  {Object.entries(selectedServices).filter(([, s]) => s.selected).map(([id, s]) => {
                    const svc = VALUE_ADDED_SERVICES.find(v => v.id === id)!;
                    return (
                      <div key={id} className="flex justify-between">
                        <span className="text-[#86868B]">{svc.name} x{s.quantity}</span>
                        <span className="font-medium text-[#1D1D1F]">&#8377;{(svc.pricePerUnit * s.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                  <div className="pt-2 mt-2 flex justify-between text-base" style={{ borderTop: '1px solid #D2D2D7' }}>
                    <span className="font-semibold text-[#1D1D1F]">Total Estimate</span>
                    <span className="font-bold text-violet-600">&#8377;{(venueCost + servicesCost).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#86868B]">
                This is an estimate. Final pricing will be confirmed by our team. GST applicable. A 25% advance is required to confirm the booking.
              </p>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 text-[#1D1D1F] py-3 rounded-full font-semibold hover:bg-[#F5F5F7] transition" style={{ border: '1px solid #D2D2D7' }}>Back</button>
                <button onClick={handleSubmit} disabled={loading}
                  className="flex-1 bg-violet-600 text-white py-3 rounded-full font-semibold hover:bg-violet-700 transition disabled:opacity-50">
                  {loading ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
