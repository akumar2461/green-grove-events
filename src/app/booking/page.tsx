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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In to Book</h2>
          <p className="text-gray-500 mb-6">You need an account to make a reservation.</p>
          <Link href="/login" className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition">Sign In / Register</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#F9F7F3' }}>
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Event</h1>
        <p className="text-gray-500 mb-8">Fill in the details below to reserve Green Grove for your special occasion.</p>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {['Event Details', 'Add Services', 'Review & Confirm'].map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-emerald-600 text-white' : step === i + 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${step === i + 1 ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>{label}</span>
              {i < 2 && <div className="flex-1 h-0.5 bg-gray-200"><div className={`h-full bg-emerald-600 transition-all ${step > i + 1 ? 'w-full' : 'w-0'}`}></div></div>}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-white border-l-4 border-red-500 text-red-700 text-sm rounded-lg p-3 mb-6">{error}</div>
        )}

        {/* Step 1: Event Details */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #E8E2D9' }}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {EVENT_TYPES.map(et => (
                    <button key={et.id} onClick={() => setForm({...form, event_type: et.id})}
                      className={`p-3 rounded-xl text-center text-sm font-medium transition ${form.event_type === et.id ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-700' : 'bg-white text-gray-700 hover:border-gray-300'}`}
                      style={form.event_type === et.id ? undefined : { border: '1px solid #E8E2D9' }}>
                      {et.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                <input type="text" required value={form.event_name} onChange={e => setForm({...form, event_name: e.target.value})}
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  style={{ border: '1px solid #E8E2D9' }}
                  placeholder="e.g., Priya & Arjun's Wedding" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                  <input type="date" required value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})}
                    className="w-full rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    style={{ border: '1px solid #E8E2D9' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (for multi-day)</label>
                  <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})}
                    className="w-full rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    style={{ border: '1px solid #E8E2D9' }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration Type *</label>
                  <select value={form.duration_type} onChange={e => setForm({...form, duration_type: e.target.value as 'hourly' | 'daily' | 'weekly'})}
                    className="w-full rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    style={{ border: '1px solid #E8E2D9' }}>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {form.duration_type === 'hourly' ? 'Hours' : form.duration_type === 'daily' ? 'Days' : 'Weeks'} *
                  </label>
                  <input type="number" min={VENUE_PRICING[form.duration_type].minUnits} value={form.duration_value}
                    onChange={e => setForm({...form, duration_value: parseInt(e.target.value) || 1})}
                    className="w-full rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    style={{ border: '1px solid #E8E2D9' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Guests</label>
                  <input type="number" min={1} max={500} value={form.guest_count}
                    onChange={e => setForm({...form, guest_count: parseInt(e.target.value) || 100})}
                    className="w-full rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    style={{ border: '1px solid #E8E2D9' }} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                <textarea rows={3} value={form.special_requests} onChange={e => setForm({...form, special_requests: e.target.value})}
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  style={{ border: '1px solid #E8E2D9' }}
                  placeholder="Any special requirements, themes, dietary restrictions, etc." />
              </div>

              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-emerald-800 font-medium">Venue Cost: &#8377;{venueCost.toLocaleString('en-IN')}</p>
                <p className="text-emerald-600 text-sm">{form.duration_value} {form.duration_type === 'hourly' ? 'hour(s)' : form.duration_type === 'daily' ? 'day(s)' : 'week(s)'} @ &#8377;{VENUE_PRICING[form.duration_type].base.toLocaleString('en-IN')} {VENUE_PRICING[form.duration_type].label.toLowerCase()}</p>
              </div>

              <button onClick={() => { if (form.event_type && form.event_name && form.event_date) setStep(2); }}
                disabled={!form.event_type || !form.event_name || !form.event_date}
                className="w-full bg-emerald-600 text-white py-3 rounded-full font-semibold hover:bg-emerald-700 transition disabled:opacity-50">
                Next: Add Services
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #E8E2D9' }}>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Add Value-Added Services</h2>
            <p className="text-gray-500 text-sm mb-6">Select any optional services you&apos;d like for your event.</p>
            <div className="space-y-4">
              {VALUE_ADDED_SERVICES.map(svc => (
                <div key={svc.id}
                  className={`rounded-xl p-4 cursor-pointer transition ${selectedServices[svc.id]?.selected ? 'bg-emerald-50' : 'bg-white'}`}
                  style={{ border: selectedServices[svc.id]?.selected ? '2px solid #059669' : '1px solid #E8E2D9' }}
                  onClick={() => toggleService(svc.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={selectedServices[svc.id]?.selected || false} readOnly
                        className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                      <div>
                        <p className="font-medium text-gray-900">{svc.name}</p>
                        <p className="text-gray-500 text-xs">{svc.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-emerald-600 font-semibold text-sm">&#8377;{svc.pricePerUnit.toLocaleString('en-IN')}</p>
                      <p className="text-gray-400 text-xs">per {svc.unit}</p>
                    </div>
                  </div>
                  {selectedServices[svc.id]?.selected && (
                    <div className="mt-3 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <label className="text-sm text-gray-500">Qty:</label>
                      <input type="number" min={1} value={selectedServices[svc.id]?.quantity || 1}
                        onChange={e => setSelectedServices(prev => ({...prev, [svc.id]: { ...prev[svc.id], quantity: parseInt(e.target.value) || 1 }}))}
                        className="w-20 rounded-xl px-3 py-1.5 text-sm"
                        style={{ border: '1px solid #E8E2D9' }} />
                      <span className="text-sm text-gray-500">= &#8377;{(svc.pricePerUnit * (selectedServices[svc.id]?.quantity || 1)).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(1)} className="flex-1 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-50 transition" style={{ border: '1px solid #E8E2D9' }}>Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-emerald-600 text-white py-3 rounded-full font-semibold hover:bg-emerald-700 transition">Review Booking</button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #E8E2D9' }}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Booking</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Event Type:</span><p className="font-medium text-gray-900">{EVENT_TYPES.find(e => e.id === form.event_type)?.name}</p></div>
                <div><span className="text-gray-500">Event Name:</span><p className="font-medium text-gray-900">{form.event_name}</p></div>
                <div><span className="text-gray-500">Date:</span><p className="font-medium text-gray-900">{form.event_date}{form.end_date ? ` to ${form.end_date}` : ''}</p></div>
                <div><span className="text-gray-500">Duration:</span><p className="font-medium text-gray-900">{form.duration_value} {form.duration_type === 'hourly' ? 'hour(s)' : form.duration_type === 'daily' ? 'day(s)' : 'week(s)'}</p></div>
                <div><span className="text-gray-500">Guests:</span><p className="font-medium text-gray-900">{form.guest_count}</p></div>
              </div>

              {form.special_requests && (
                <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}>
                  <p className="font-medium text-gray-900 mb-1">Special Requests:</p>
                  <p className="text-gray-500">{form.special_requests}</p>
                </div>
              )}

              {/* Cost Summary */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#F9F7F3', border: '1px solid #E8E2D9' }}>
                <h3 className="font-semibold text-gray-900 mb-4">Cost Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Venue Rental</span><span className="font-medium">&#8377;{venueCost.toLocaleString('en-IN')}</span></div>
                  {Object.entries(selectedServices).filter(([, s]) => s.selected).map(([id, s]) => {
                    const svc = VALUE_ADDED_SERVICES.find(v => v.id === id)!;
                    return (
                      <div key={id} className="flex justify-between">
                        <span className="text-gray-500">{svc.name} x{s.quantity}</span>
                        <span className="font-medium">&#8377;{(svc.pricePerUnit * s.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-2 mt-2 flex justify-between text-base" style={{ borderColor: '#E8E2D9' }}>
                    <span className="font-semibold text-gray-900">Total Estimate</span>
                    <span className="font-bold text-emerald-600">&#8377;{(venueCost + servicesCost).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                This is an estimate. Final pricing will be confirmed by our team. GST applicable. A 25% advance is required to confirm the booking.
              </p>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-50 transition" style={{ border: '1px solid #E8E2D9' }}>Back</button>
                <button onClick={handleSubmit} disabled={loading}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-full font-semibold hover:bg-emerald-700 transition disabled:opacity-50">
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
